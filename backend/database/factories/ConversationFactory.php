<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Conversation>
     */
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * Note: `listing_id`, `buyer_id` and `seller_id` MUST be provided by
     * the seeder — they carry domain invariants (buyer ≠ seller, listing
     * must belong to seller) that cannot be enforced inside the factory.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'last_message_at' => now(),
        ];
    }

    /**
     * Indicate that the conversation has no messages yet.
     */
    public function idle(): static
    {
        return $this->state(['last_message_at' => null]);
    }
}
