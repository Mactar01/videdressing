<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * SearchController
 *
 * Gère la recherche d'annonces via Laravel Scout + Meilisearch.
 * Supporte les filtres standards (catégorie, condition, ville, prix)
 * et les filtres dynamiques par attributs de catégorie.
 */
class SearchController extends BaseApiController
{
    /**
     * Recherche des annonces avec filtres dynamiques.
     *
     * Paramètres de requête :
     *  - q          : Texte libre de recherche
     *  - category   : Slug ou ID de catégorie (inclut les descendants)
     *  - condition  : new|like_new|good|fair|poor
     *  - city       : Nom de ville (ex: Paris)
     *  - min_price  : Prix minimum en EUR
     *  - max_price  : Prix maximum en EUR
     *  - sort       : relevance|price_asc|price_desc|date (défaut: relevance)
     *  - per_page   : Résultats par page (défaut: 20, max: 100)
     *  - filters    : Filtres dynamiques encodés en JSON { "size": "M", "color": ["rouge","bleu"] }
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q'         => ['nullable', 'string', 'max:255'],
            'category'  => ['nullable', 'string'],
            'condition' => ['nullable', 'string', 'in:new,like_new,good,fair,poor'],
            'city'      => ['nullable', 'string', 'max:100'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort'      => ['nullable', 'string', 'in:relevance,price_asc,price_desc,date'],
            'per_page'  => ['nullable', 'integer', 'min:1', 'max:100'],
            'page'      => ['nullable', 'integer', 'min:1'],
        ]);

        $query   = $request->input('q', '');
        $perPage = (int) $request->input('per_page', 20);
        $sort    = $request->input('sort', 'relevance');

        // --- Initialise la recherche Scout ---
        $scout = Listing::search($query);

        // Filtre : seules les annonces actives
        $scout->where('status', 'active');

        // --- Filtre par catégorie (avec descendants via CTE MySQL 8) ---
        if ($request->filled('category')) {
            $cat = is_numeric($request->category)
                ? Category::find($request->category)
                : Category::where('slug', $request->category)->first();

            if ($cat) {
                $descendantIds   = $cat->getDescendantIds();
                $categoryIds     = array_merge([$cat->id], $descendantIds);
                $scout->whereIn('category_id', $categoryIds);
            }
        }

        // --- Filtre par condition ---
        if ($request->filled('condition')) {
            $scout->where('condition', $request->condition);
        }

        // --- Filtre par ville (insensible à la casse via Meilisearch) ---
        if ($request->filled('city')) {
            $scout->where('city', $request->city);
        }

        // --- Filtre par prix ---
        if ($request->filled('min_price')) {
            $scout->where('price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $scout->where('price', '<=', (float) $request->max_price);
        }

        // --- Filtres dynamiques par attributs de catégorie ---
        // Format: filters={"size":"M","color":["rouge","bleu"]}
        $dynamicFilters = [];
        if ($request->filled('filters')) {
            $dynamicFilters = json_decode($request->input('filters'), true) ?? [];
            foreach ($dynamicFilters as $key => $value) {
                if (is_array($value)) {
                    $scout->whereIn("attributes.{$key}", $value);
                } else {
                    $scout->where("attributes.{$key}", $value);
                }
            }
        }

        // --- Tri ---
        match ($sort) {
            'price_asc'  => $scout->orderBy('price', 'asc'),
            'price_desc' => $scout->orderBy('price', 'desc'),
            'date'       => $scout->orderBy('created_at', 'desc'),
            default      => null, // Relevance: pas de orderBy (Meilisearch scoring)
        };

        // --- Pagination ---
        $results = $scout->paginate($perPage);

        // Charger les relations pour l'affichage
        $results->getCollection()->load(['images', 'user:id,name,avatar', 'category:id,name,slug']);

        return $this->success(
            data: $results,
            message: 'Search completed successfully',
            meta: [
                'query'           => $query,
                'sort'            => $sort,
                'dynamic_filters' => $dynamicFilters,
                'total'           => $results->total(),
            ]
        );
    }
}
