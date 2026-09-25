<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Events\MessageSent;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * MessageController
 *
 * Gère la messagerie entre acheteurs et vendeurs dans le contexte
 * d'une conversation liée à une annonce. Les messages sont broadcastés
 * en temps réel via Laravel Reverb (WebSocket).
 */
class MessageController extends BaseApiController
{
    /**
     * Liste les messages d'une conversation (ordre chronologique).
     * Marque automatiquement les messages reçus comme lus.
     *
     * @param  Request       $request
     * @param  Conversation  $conversation
     * @return JsonResponse
     */
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $messages = $conversation->messages()
            ->with('sender:id,name,avatar')
            ->withTrashed() // Inclure les messages supprimés (affiche "Message supprimé")
            ->orderBy('created_at', 'asc')
            ->paginate((int) $request->input('per_page', 50));

        // Marquer automatiquement les messages reçus comme lus
        $conversation->messages()
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success($messages, 'Messages retrieved successfully');
    }

    /**
     * Envoie un nouveau message dans une conversation.
     * Broadcast via Reverb sur le canal privé de la conversation.
     *
     * @param  StoreMessageRequest  $request
     * @param  Conversation         $conversation
     * @return JsonResponse
     */
    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('create', [Message::class, $conversation]);

        $attachments = [];

        // Upload des pièces jointes si présentes
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('messages/' . $conversation->id, 'public');
                $attachments[] = [
                    'path' => $path,
                    'url'  => Storage::disk('public')->url($path),
                    'mime' => $file->getMimeType(),
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        $message = $conversation->messages()->create([
            'sender_id'   => $request->user()->id,
            'body'        => $request->input('body'),
            'attachments' => empty($attachments) ? null : $attachments,
        ]);

        // Mettre à jour le timestamp de la conversation pour le tri
        $conversation->update(['last_message_at' => now()]);

        $message->load('sender:id,name,avatar');

        // Broadcast en temps réel via Reverb
        broadcast(new MessageSent($message))->toOthers();

        return $this->created($message, 'Message sent successfully');
    }

    /**
     * Marque tous les messages non lus de la conversation comme lus
     * (côté destinataire = l'utilisateur courant).
     *
     * @param  Request       $request
     * @param  Conversation  $conversation
     * @return JsonResponse
     */
    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $updated = $conversation->messages()
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success(
            data: ['updated' => $updated],
            message: 'Messages marked as read'
        );
    }
}
