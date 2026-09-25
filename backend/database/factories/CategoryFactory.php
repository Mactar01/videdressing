<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Category>
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * Generates a category with bilingual JSON name (fr/en),
     * a unique slug derived from the French name, and no parent.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nameFr = fake('fr_FR')->unique()->words(fake()->numberBetween(1, 3), true);
        $nameEn = fake('en_US')->words(fake()->numberBetween(1, 3), true);

        return [
            'name'       => json_encode(['fr' => ucfirst($nameFr), 'en' => ucfirst($nameEn)], JSON_UNESCAPED_UNICODE),
            'slug'       => Str::slug($nameFr) . '-' . fake()->unique()->numerify('###'),
            'is_active'  => true,
            'sort_order' => 0,
            'parent_id'  => null,
        ];
    }

    /**
     * Indicate that the category is a subcategory of the given parent.
     *
     * @param int $parentId The ID of the parent category.
     */
    public function child(int $parentId): static
    {
        return $this->state(['parent_id' => $parentId]);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
