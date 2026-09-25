<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $orders = Order::where('status', 'delivered')->take(3)->get();
        
        foreach ($orders as $order) {
            Review::create([
                'order_id' => $order->id,
                'reviewer_id' => $order->buyer_id,
                'reviewee_id' => $order->seller_id,
                'rating' => rand(3, 5),
                'comment' => 'Très bonne transaction, je recommande ce vendeur !',
            ]);
        }
    }
}
