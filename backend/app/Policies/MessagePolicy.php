<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Auth\Access\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a message in the conversation.
     */
    public function create(User $user, Conversation $conversation): bool
    {
        return $user->id === $conversation->buyer_id || $user->id === $conversation->seller_id;
    }

    /**
     * Determine whether the user can view the message.
     */
    public function view(User $user, Message $message): bool
    {
        $conversation = $message->conversation;
        return $user->id === $conversation->buyer_id || $user->id === $conversation->seller_id;
    }
}
