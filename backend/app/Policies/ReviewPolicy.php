<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a review for the order.
     */
    public function create(User $user, Order $order): bool
    {
        return $user->id === $order->buyer_id && $order->status === 'delivered' && !$order->review;
    }

    /**
     * Determine whether the user can delete the review.
     */
    public function delete(User $user, Review $review): bool
    {
        if ($user->is_admin) {
            return true;
        }

        return $user->id === $review->reviewer_id && $review->created_at->diffInHours(now()) <= 24;
    }
}
