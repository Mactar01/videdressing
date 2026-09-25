<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;
use App\Models\Order;
use App\Models\Favorite;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sellers = User::where('is_admin', false)->get();
        if ($sellers->isEmpty()) {
            return;
        }

        $categories = Category::whereNotNull('parent_id')->get();
        if ($categories->isEmpty()) {
            return;
        }

        $cities     = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse'];
        $conditions = ['new', 'like_new', 'good', 'fair', 'poor'];

        // Create 15 active
        for ($i = 0; $i < 15; $i++) {
            $listing = Listing::factory()->create([
                'user_id' => $sellers->random()->id,
                'category_id' => $categories->random()->id,
                'status' => 'active',
                'price' => rand(5, 250),
                'condition' => $conditions[array_rand($conditions)],
                'city' => $cities[array_rand($cities)],
            ]);
            
            // Generate some random favorites
            if (rand(0, 1)) {
                Favorite::create([
                    'user_id' => $sellers->where('id', '!=', $listing->user_id)->random()->id,
                    'listing_id' => $listing->id,
                ]);
            }
        }

        // Create 3 draft
        for ($i = 0; $i < 3; $i++) {
            Listing::factory()->create([
                'user_id' => $sellers->random()->id,
                'category_id' => $categories->random()->id,
                'status' => 'draft',
                'price' => rand(5, 250),
                'condition' => $conditions[array_rand($conditions)],
                'city' => $cities[array_rand($cities)],
            ]);
        }

        // Create 2 sold with orders
        for ($i = 0; $i < 2; $i++) {
            $seller = $sellers->random();
            $buyer = $sellers->where('id', '!=', $seller->id)->random();
            
            $listing = Listing::factory()->create([
                'user_id' => $seller->id,
                'category_id' => $categories->random()->id,
                'status' => 'sold',
                'price' => rand(5, 250),
                'condition' => $conditions[array_rand($conditions)],
                'city' => $cities[array_rand($cities)],
            ]);

            Order::factory()->create([
                'listing_id'          => $listing->id,
                'buyer_id'            => $buyer->id,
                'seller_id'           => $seller->id,
                'shipping_address_id' => $buyer->addresses()->first()->id ?? null,
                'amount'              => $listing->price + 5,
                'platform_fee'        => round(($listing->price + 5) * 0.10, 2),
                'seller_amount'       => ($listing->price + 5) - round(($listing->price + 5) * 0.10, 2),
            ]);
        }
    }
}
