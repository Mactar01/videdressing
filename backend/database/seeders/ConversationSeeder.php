<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Listing;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::where('is_admin', false)->get();
        if ($users->count() < 2) {
            return;
        }

        $listings = Listing::where('status', 'active')->get();
        
        for ($i = 0; $i < 5; $i++) {
            $buyer = $users->random();
            $listing = $listings->random();
            $seller = $listing->user;
            
            if ($buyer->id === $seller->id) {
                continue; // Skip if same user
            }

            $conversation = Conversation::create([
                'listing_id' => $listing->id,
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
            ]);

            $messageCount = rand(3, 8);
            for ($j = 0; $j < $messageCount; $j++) {
                $sender = rand(0, 1) ? $buyer : $seller;
                $isRead = ($j !== $messageCount - 1) ? true : (bool)rand(0, 1);
                
                Message::factory()->create([
                    'conversation_id' => $conversation->id,
                    'sender_id'       => $sender->id,
                    'body'            => 'Message de test ' . ($j + 1) . ' pour la conversation.',
                    'read_at'         => $isRead ? now() : null,
                ]);
            }
        }
    }
}
