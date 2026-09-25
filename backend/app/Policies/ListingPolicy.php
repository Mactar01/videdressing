<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Auth\Access\HandlesAuthorization;

class ListingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Determine whether the user can delete the listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Determine whether the user can publish the listing.
     */
    public function publish(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id && $listing->status === 'draft';
    }

    /**
     * Determine whether the user can upload an image to the listing.
     */
    public function uploadImage(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Determine whether the user can delete an image of the listing.
     */
    public function deleteImage(User $user, Listing $listing, ListingImage $image): bool
    {
        return $user->id === $listing->user_id;
    }
}
