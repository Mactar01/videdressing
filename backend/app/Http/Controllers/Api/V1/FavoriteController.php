<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FavoriteController extends BaseApiController
{
    /**
     * Ajoute ou retire une annonce des favoris de l'utilisateur (Toggle)
     *
     * @param Request $request
     * @param Listing $listing
     * @return JsonResponse
     */
    public function toggle(Request $request, Listing $listing): JsonResponse
    {
        $user = $request->user();
        $isFavorited = $user->favorites()->where('listing_id', $listing->id)->exists();

        if ($isFavorited) {
            $user->favorites()->where('listing_id', $listing->id)->delete();
            // Optionnel : on pourrait décrémenter le compteur sur Listing
            $favorited = false;
        } else {
            $user->favorites()->create(['listing_id' => $listing->id]);
            // Optionnel : on pourrait incrémenter le compteur
            $favorited = true;
        }

        return $this->success([
            'favorited' => $favorited,
        ], 'Favorite status toggled');
    }

    /**
     * Liste les annonces favorites de l'utilisateur connecté.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // On récupère les modèles "Favorite" en chargeant l'annonce reliée et ses images
        $favorites = $request->user()
            ->favorites()
            ->with(['listing.images' => function($query) {
                $query->orderBy('sort_order', 'asc');
            }])
            ->latest()
            ->paginate((int) $request->input('per_page', 24));
            
        // Pour être plus propre côté Frontend, on peut mapper la réponse
        // pour renvoyer directement une liste d'annonces (Listings)
        $listings = $favorites->getCollection()->map(function ($favorite) {
            return $favorite->listing;
        });

        // Remettre les listings extraits dans l'objet paginé
        $favorites->setCollection($listings);

        return $this->success($favorites, 'Favorites retrieved successfully');
    }
}
