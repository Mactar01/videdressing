<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminListingController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $listings = Listing::with(['user:id,name', 'category:id,name'])
            ->latest()->paginate(20);
        return $this->success($listings);
    }

    public function ban(Listing $listing): JsonResponse
    {
        $listing->update(['status' => 'banned']);
        return $this->success($listing, 'Listing banned');
    }

    public function unban(Listing $listing): JsonResponse
    {
        $listing->update(['status' => 'active']);
        return $this->success($listing, 'Listing unbanned');
    }

    public function destroy(Listing $listing): JsonResponse
    {
        $listing->delete();
        return $this->noContent();
    }
}
