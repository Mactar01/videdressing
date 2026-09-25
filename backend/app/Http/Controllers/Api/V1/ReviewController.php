<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends BaseApiController
{
    /**
     * Leave a review for a completed order.
     *
     * @param StoreReviewRequest $request
     * @param Order $order
     * @return JsonResponse
     */
    public function store(StoreReviewRequest $request, Order $order): JsonResponse
    {
        $review = Review::create([
            'order_id' => $order->id,
            'reviewer_id' => $request->user()->id,
            'reviewee_id' => $order->seller_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $this->sendResponse($review, 'Review created successfully', 201);
    }

    /**
     * List reviews for a specific user.
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function index(Request $request, $userId): JsonResponse
    {
        $user = User::findOrFail($userId);
        $reviews = $user->receivedReviews()->with('reviewer')->paginate(15);

        return $this->sendResponse($reviews, 'Reviews retrieved successfully');
    }

    /**
     * Delete a review.
     *
     * @param Review $review
     * @return JsonResponse
     */
    public function destroy(Review $review): JsonResponse
    {
        $this->authorize('delete', $review);
        $review->delete();

        return $this->sendResponse(null, 'Review deleted successfully');
    }
}
