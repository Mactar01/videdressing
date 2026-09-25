<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Listing\StoreListingRequest;
use App\Http\Requests\Listing\UpdateListingRequest;
use App\Jobs\IncrementListingViews;
use App\Models\Listing;
use App\Models\ListingAttributeValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * ListingController
 *
 * Gère le CRUD des annonces (listings) avec support des attributs dynamiques
 * par catégorie, des images, des favoris et du cycle de vie (draft → active → sold/archived).
 */
class ListingController extends BaseApiController
{
    /**
     * Liste paginée des annonces actives avec filtres.
     *
     * Filtres supportés: category_id, city, condition, min_price, max_price, sort
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'city'        => ['nullable', 'string', 'max:100'],
            'condition'   => ['nullable', 'string', 'in:new,like_new,good,fair,poor'],
            'min_price'   => ['nullable', 'numeric', 'min:0'],
            'max_price'   => ['nullable', 'numeric', 'min:0'],
            'sort'        => ['nullable', 'string', 'in:date_desc,price_asc,price_desc,popular'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Listing::where('status', 'active')
            ->with(['images' => fn ($q) => $q->where('is_cover', true)->limit(1), 'user:id,name,avatar', 'category:id,name,slug']);

        if ($request->filled('category_id')) {
            $query->scopeForCategory((int) $request->category_id);
        }
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $sort = $request->input('sort', 'date_desc');
        match ($sort) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'popular'    => $query->orderByDesc('favorites_count'),
            default      => $query->orderByDesc('created_at'),
        };

        $listings = $query->paginate((int) $request->input('per_page', 20));

        return $this->success($listings, 'Listings retrieved successfully');
    }

    /**
     * Détail d'une annonce avec ses images, attributs dynamiques et vendeur.
     * Incrémente le compteur de vues de manière asynchrone.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $listing = Listing::with([
            'images',
            'user:id,name,avatar,bio,is_verified,created_at',
            'category:id,name,slug',
            'category.attributes',
            'attributeValues.categoryAttribute',
        ])->findOrFail($id);

        // Incrémenter les vues en asynchrone (queue job)
        dispatch(new IncrementListingViews($listing->id));

        return $this->success($listing, 'Listing retrieved successfully');
    }

    /**
     * Crée une nouvelle annonce avec ses attributs dynamiques.
     * Démarre en statut 'draft'.
     *
     * @param  StoreListingRequest  $request
     * @return JsonResponse
     */
    public function store(StoreListingRequest $request): JsonResponse
    {
        $data             = $request->validated();
        $data['user_id']  = auth()->id();
        $data['status']   = 'draft';
        $attributes       = $data['attributes'] ?? [];
        unset($data['attributes']);

        $listing = DB::transaction(function () use ($data, $attributes) {
            $listing = Listing::create($data);
            $this->syncAttributes($listing, $attributes);
            return $listing;
        });

        $listing->load(['images', 'attributeValues.categoryAttribute']);

        return $this->created($listing, 'Listing created successfully');
    }

    /**
     * Met à jour une annonce existante.
     *
     * @param  UpdateListingRequest  $request
     * @param  Listing               $listing
     * @return JsonResponse
     */
    public function update(UpdateListingRequest $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $data       = $request->validated();
        $attributes = $data['attributes'] ?? null;
        unset($data['attributes']);

        DB::transaction(function () use ($listing, $data, $attributes) {
            $listing->update($data);
            if ($attributes !== null) {
                $this->syncAttributes($listing, $attributes);
            }
        });

        $listing->load(['images', 'attributeValues.categoryAttribute']);

        return $this->success($listing, 'Listing updated successfully');
    }

    /**
     * Supprime (soft delete) une annonce.
     *
     * @param  Listing  $listing
     * @return JsonResponse
     */
    public function destroy(Listing $listing): JsonResponse
    {
        $this->authorize('delete', $listing);
        $listing->delete();

        return $this->noContent();
    }

    /**
     * Liste les annonces de l'utilisateur connecté (tous statuts).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function myListings(Request $request): JsonResponse
    {
        $listings = $request->user()
            ->listings()
            ->with(['images' => fn ($q) => $q->where('is_cover', true)->limit(1)])
            ->withTrashed()
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return $this->success($listings, 'My listings retrieved successfully');
    }

    /**
     * Publie une annonce (draft → active) et l'indexe dans Meilisearch.
     *
     * @param  Listing  $listing
     * @return JsonResponse
     */
    public function publish(Listing $listing): JsonResponse
    {
        $this->authorize('publish', $listing);

        if ($listing->images()->count() === 0) {
            return $this->error('Cannot publish a listing without at least one image.', 422);
        }

        $listing->update(['status' => 'active']);
        $listing->searchable(); // Force Meilisearch indexation

        return $this->success($listing, 'Listing published successfully');
    }

    /**
     * Archive une annonce (active → archived) et la désindexe.
     *
     * @param  Listing  $listing
     * @return JsonResponse
     */
    public function archive(Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $listing->update(['status' => 'archived']);
        $listing->unsearchable(); // Retire de Meilisearch

        return $this->success($listing, 'Listing archived successfully');
    }

    // =========================================================================
    // Private helpers
    // =========================================================================

    /**
     * Synchronise les attributs dynamiques d'une annonce.
     * Crée ou met à jour les valeurs selon les attributs de la catégorie.
     *
     * @param  Listing  $listing
     * @param  array    $attributes  Tableau [attribute_id => value]
     * @return void
     */
    private function syncAttributes(Listing $listing, array $attributes): void
    {
        foreach ($attributes as $attributeId => $value) {
            ListingAttributeValue::updateOrCreate(
                [
                    'listing_id'            => $listing->id,
                    'category_attribute_id' => $attributeId,
                ],
                ['value' => $value]
            );
        }
    }
}
