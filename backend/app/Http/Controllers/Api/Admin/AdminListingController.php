<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminListingController extends BaseApiController
{
    /**
     * List all listings (including drafts/archived).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $listings = Listing::with('user')->orderBy('created_at', 'desc')->paginate(20);
        return $this->sendResponse($listings, 'Listings retrieved successfully');
    }

    /**
     * Ban/Suspend a listing.
     *
     * @param Listing $listing
     * @return JsonResponse
     */
    public function ban(Listing $listing): JsonResponse
    {
        $listing->update(['status' => 'suspended']);
        return $this->sendResponse($listing, 'Listing suspended');
    }

    /**
     * Unban a listing.
     *
     * @param Listing $listing
     * @return JsonResponse
     */
    public function unban(Listing $listing): JsonResponse
    {
        $listing->update(['status' => 'active']);
        return $this->sendResponse($listing, 'Listing activated');
    }

    /**
     * Hard delete a listing.
     *
     * @param Listing $listing
     * @return JsonResponse
     */
    public function destroy(Listing $listing): JsonResponse
    {
        $listing->forceDelete();
        return $this->sendResponse(null, 'Listing permanently deleted');
    }
}
