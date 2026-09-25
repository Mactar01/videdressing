<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Message>
     */
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * Note: `conversation_id` and `sender_id` MUST be provided by the seeder.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'body'    => fake('fr_FR')->paragraph(fake()->numberBetween(1, 4)),
            'read_at' => null,
        ];
    }

    /**
     * Indicate that the message has been read by the recipient.
     */
    public function read(): static
    {
        return $this->state([
            'read_at' => now(),
        ]);
    }

    /**
     * Indicate that the message has not been read yet.
     */
    public function unread(): static
    {
        return $this->state(['read_at' => null]);
    }
}
