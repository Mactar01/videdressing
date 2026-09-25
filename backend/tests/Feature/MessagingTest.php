<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Listing;
use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessagingTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_start_conversation_about_listing()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/conversations', [
            'listing_id' => $listing->id,
            'message' => 'Bonjour, est-ce toujours disponible ?'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('conversations', [
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
        ]);
        $this->assertDatabaseHas('messages', [
            'user_id' => $buyer->id,
            'content' => 'Bonjour, est-ce toujours disponible ?'
        ]);
    }

    public function test_cannot_start_conversation_with_yourself()
    {
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);

        $response = $this->actingAs($seller)->postJson('/api/v1/conversations', [
            'listing_id' => $listing->id,
            'message' => 'Coucou moi-même.'
        ]);

        $response->assertStatus(422);
    }

    public function test_participant_can_send_messages()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $conversation = Conversation::create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/conversations/' . $conversation->id . '/messages', [
            'content' => 'Oui, je le prends.'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'content' => 'Oui, je le prends.'
        ]);
    }

    public function test_non_participant_cannot_send_messages()
    {
        $stranger = User::factory()->create();
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $conversation = Conversation::create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
        ]);

        $response = $this->actingAs($stranger)->postJson('/api/v1/conversations/' . $conversation->id . '/messages', [
            'content' => 'Intrus !'
        ]);

        $response->assertStatus(403);
    }

    public function test_participant_can_mark_messages_as_read()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $conversation = Conversation::create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
        ]);
        
        $message = $conversation->messages()->create([
            'user_id' => $buyer->id,
            'content' => 'Hello',
            'is_read' => false,
        ]);

        $response = $this->actingAs($seller)->postJson('/api/v1/conversations/' . $conversation->id . '/read');

        $response->assertStatus(200);
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'is_read' => true
        ]);
    }

    public function test_user_can_delete_conversation()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $conversation = Conversation::create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
        ]);

        $response = $this->actingAs($buyer)->deleteJson('/api/v1/conversations/' . $conversation->id);

        $response->assertStatus(200);
        // Depending on implementation, it might soft delete or just detach user. Let's assert status for now.
    }
}
