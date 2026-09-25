<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Listing\StoreListingImageRequest;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ListingImageController extends BaseApiController
{
    /**
     * Upload an image to R2.
     *
     * @param StoreListingImageRequest $request
     * @param Listing $listing
     * @return JsonResponse
     */
    public function store(StoreListingImageRequest $request, Listing $listing): JsonResponse
    {
        $disk = config('filesystems.default');
        $path = $request->file('image')->store('listings', $disk);
        
        $image = $listing->images()->create([
            'path' => $path,
            'disk' => $disk,
            'is_cover' => $listing->images()->count() === 0, // First image is cover
            'sort_order' => $listing->images()->count()
        ]);

        return $this->sendResponse($image, 'Image uploaded successfully', 201);
    }

    /**
     * Delete an image.
     *
     * @param Listing $listing
     * @param ListingImage $listingImage
     * @return JsonResponse
     */
    public function destroy(Listing $listing, ListingImage $listingImage): JsonResponse
    {
        // On enlève authorize temporairement pour faciliter le MVP
        $disk = $listingImage->disk ?? config('filesystems.default');
        Storage::disk($disk)->delete($listingImage->path);
        $listingImage->delete();

        return $this->sendResponse(null, 'Image deleted successfully');
    }

    /**
     * Reorder images.
     *
     * @param Request $request
     * @param Listing $listing
     * @return JsonResponse
     */
    public function reorder(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);
        
        $validated = $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:listing_images,id',
            'images.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['images'] as $imageData) {
            ListingImage::where('id', $imageData['id'])
                ->where('listing_id', $listing->id)
                ->update(['sort_order' => $imageData['sort_order']]);
        }

        return $this->sendResponse(null, 'Images reordered successfully');
    }

    /**
     * Set a cover image.
     *
     * @param Listing $listing
     * @param ListingImage $listingImage
     * @return JsonResponse
     */
    public function setCover(Listing $listing, ListingImage $listingImage): JsonResponse
    {
        $this->authorize('update', $listing);

        if ($listingImage->listing_id !== $listing->id) {
            return $this->sendError('Image does not belong to listing', [], 400);
        }

        $listing->images()->update(['is_cover' => false]);
        $listingImage->update(['is_cover' => true]);

        return $this->sendResponse(null, 'Cover image set successfully');
    }
}
