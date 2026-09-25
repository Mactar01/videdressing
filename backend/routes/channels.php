<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels — VideDressing
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

/**
 * Canal privé de conversation.
 * Seuls les participants (buyer ou seller) peuvent s'abonner.
 */
Broadcast::channel('conversation.{conversationId}', function ($user, int $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (! $conversation) {
        return false;
    }

    return $user->id === $conversation->buyer_id
        || $user->id === $conversation->seller_id;
});

/**
 * Canal privé utilisateur (notifications personnelles).
 */
Broadcast::channel('user.{userId}', function ($user, int $userId) {
    return $user->id === $userId;
});
