<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_leave_review_after_delivery()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $order = Order::factory()->create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'status' => 'delivered'
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/orders/' . $order->id . '/review', [
            'rating' => 5,
            'comment' => 'Parfait !'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'order_id' => $order->id,
            'rating' => 5
        ]);
    }

    public function test_cannot_review_without_delivered_order()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $order = Order::factory()->create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'status' => 'shipped' // Not delivered
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/orders/' . $order->id . '/review', [
            'rating' => 5,
            'comment' => 'Parfait !'
        ]);

        $response->assertStatus(403); // Or 422 depending on implementation
    }

    public function test_cannot_review_twice_on_same_order()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $order = Order::factory()->create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'status' => 'delivered'
        ]);

        Review::factory()->create([
            'order_id' => $order->id,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/orders/' . $order->id . '/review', [
            'rating' => 4,
            'comment' => 'Encore parfait !'
        ]);

        $response->assertStatus(422); // Or 403
    }

    public function test_rating_must_be_between_1_and_5()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $listing = Listing::factory()->create(['user_id' => $seller->id]);
        $order = Order::factory()->create([
            'listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'status' => 'delivered'
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/v1/orders/' . $order->id . '/review', [
            'rating' => 6,
            'comment' => 'Parfait !'
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['rating']);
    }
}
