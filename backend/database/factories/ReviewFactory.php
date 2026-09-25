<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Review>
     */
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * Note: `order_id`, `reviewer_id` and `reviewee_id` MUST be provided
     * by the seeder.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rating'  => fake()->numberBetween(1, 5),
            'comment' => fake('fr_FR')->sentence(fake()->numberBetween(5, 20)),
        ];
    }

    /**
     * Indicate that the review is a five-star rating.
     */
    public function fiveStar(): static
    {
        return $this->state([
            'rating'  => 5,
            'comment' => fake('fr_FR')->sentence(fake()->numberBetween(8, 15)),
        ]);
    }

    /**
     * Indicate that the review is a negative (1-star) rating.
     */
    public function negative(): static
    {
        return $this->state([
            'rating'  => 1,
            'comment' => fake('fr_FR')->sentence(fake()->numberBetween(8, 15)),
        ]);
    }
}
