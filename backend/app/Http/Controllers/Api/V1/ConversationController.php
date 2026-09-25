<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Conversation;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConversationController extends BaseApiController
{
    /**
     * List user conversations sorted by last message.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where(function ($query) use ($userId) {
            $query->where('buyer_id', $userId)
                  ->whereNull('buyer_deleted_at');
        })->orWhere(function ($query) use ($userId) {
            $query->where('seller_id', $userId)
                  ->whereNull('seller_deleted_at');
        })
        ->with([
            'listing:id,title,price',
            'listing.images' => fn ($q) => $q->where('is_cover', true)->limit(1),
            'buyer:id,name,avatar',
            'seller:id,name,avatar',
        ])
        ->orderByDesc('last_message_at')
        ->paginate((int) $request->input('per_page', 15));

        return $this->success($conversations, 'Conversations retrieved successfully');
    }

    /**
     * Show conversation details and messages.
     *
     * @param Conversation $conversation
     * @return JsonResponse
     */
    public function show(Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $conversation->load([
            'listing:id,title,price',
            'listing.images' => fn ($q) => $q->where('is_cover', true)->limit(1),
            'buyer:id,name,avatar',
            'seller:id,name,avatar',
        ]);

        return $this->success($conversation, 'Conversation retrieved successfully');
    }

    /**
     * Start a conversation about a listing (buyer -> seller).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id'
        ]);

        $listing = Listing::findOrFail($request->listing_id);
        
        if ($listing->user_id === $request->user()->id) {
            return $this->error('You cannot start a conversation with yourself', 400);
        }

        $conversation = Conversation::firstOrCreate([
            'listing_id' => $listing->id,
            'buyer_id' => $request->user()->id,
            'seller_id' => $listing->user_id,
        ], [
            'last_message_at' => now(),
        ]);

        return $this->created($conversation, 'Conversation started successfully');
    }

    /**
     * Soft delete a conversation for the user.
     *
     * @param Request $request
     * @param Conversation $conversation
     * @return JsonResponse
     */
    public function destroy(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('delete', $conversation);

        if ($request->user()->id === $conversation->buyer_id) {
            $conversation->update(['buyer_deleted_at' => now()]);
        } else {
            $conversation->update(['seller_deleted_at' => now()]);
        }

        return $this->noContent();
    }
}
