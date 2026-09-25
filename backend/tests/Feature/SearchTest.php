<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_returns_listings_matching_query()
    {
        Listing::factory()->create(['title' => 'Robe bleue d\'été', 'status' => 'active']);
        Listing::factory()->create(['title' => 'Pantalon noir', 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?query=Robe');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['title' => 'Robe bleue d\'été']);
    }

    public function test_search_can_filter_by_category()
    {
        $cat1 = Category::factory()->create();
        $cat2 = Category::factory()->create();
        
        Listing::factory()->create(['category_id' => $cat1->id, 'status' => 'active']);
        Listing::factory()->create(['category_id' => $cat2->id, 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?category_id=' . $cat1->id);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_search_can_filter_by_price_range()
    {
        Listing::factory()->create(['price' => 10, 'status' => 'active']);
        Listing::factory()->create(['price' => 50, 'status' => 'active']);
        Listing::factory()->create(['price' => 100, 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?min_price=20&max_price=80');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_search_can_filter_by_condition()
    {
        Listing::factory()->create(['condition' => 'new_with_tags', 'status' => 'active']);
        Listing::factory()->create(['condition' => 'good', 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?condition=new_with_tags');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_search_can_filter_by_city()
    {
        Listing::factory()->create(['city' => 'Paris', 'status' => 'active']);
        Listing::factory()->create(['city' => 'Lyon', 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?city=Paris');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_search_can_sort_by_price_ascending()
    {
        Listing::factory()->create(['price' => 50, 'status' => 'active']);
        Listing::factory()->create(['price' => 10, 'status' => 'active']);
        Listing::factory()->create(['price' => 100, 'status' => 'active']);

        $response = $this->getJson('/api/v1/search?sort=price_asc');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(10, $data[0]['price']);
        $this->assertEquals(50, $data[1]['price']);
    }

    public function test_search_returns_paginated_results()
    {
        Listing::factory()->count(30)->create(['status' => 'active']);

        $response = $this->getJson('/api/v1/search?per_page=15');

        $response->assertStatus(200)
                 ->assertJsonCount(15, 'data');
        $this->assertArrayHasKey('current_page', $response->json('meta'));
    }
}
