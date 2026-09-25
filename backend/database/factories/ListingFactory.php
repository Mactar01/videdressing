<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Listing>
 */
class ListingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Listing>
     */
    protected $model = Listing::class;

    /**
     * Listing conditions available on the platform.
     *
     * @var list<string>
     */
    private const CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor'];

    /**
     * Map of French cities with their default zip code and GPS bounding box
     * so generated coordinates stay realistic within each city area.
     *
     * @var array<string, array{zip: string, lat_min: float, lat_max: float, lon_min: float, lon_max: float}>
     */
    private const CITIES = [
        'Paris'     => ['zip' => '75001', 'lat_min' => 48.815, 'lat_max' => 48.902, 'lon_min' => 2.224,  'lon_max' => 2.470],
        'Lyon'      => ['zip' => '69001', 'lat_min' => 45.707, 'lat_max' => 45.808, 'lon_min' => 4.772,  'lon_max' => 4.898],
        'Marseille' => ['zip' => '13001', 'lat_min' => 43.212, 'lat_max' => 43.380, 'lon_min' => 5.296,  'lon_max' => 5.537],
        'Bordeaux'  => ['zip' => '33000', 'lat_min' => 44.806, 'lat_max' => 44.874, 'lon_min' => -0.639, 'lon_max' => -0.534],
        'Toulouse'  => ['zip' => '31000', 'lat_min' => 43.560, 'lat_max' => 43.650, 'lon_min' => 1.358,  'lon_max' => 1.497],
    ];

    /**
     * Define the model's default state.
     *
     * Note: `user_id` and `category_id` MUST be provided by the seeder
     * as they have no sensible default — do not add a default here.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker    = fake('fr_FR');
        $cityName = $faker->randomElement(array_keys(self::CITIES));
        $city     = self::CITIES[$cityName];
        $price    = fake()->randomFloat(2, 5.00, 500.00);

        return [
            'title'           => json_encode([
                'fr' => $faker->sentence(fake()->numberBetween(3, 7)),
            ], JSON_UNESCAPED_UNICODE),
            'description'     => json_encode([
                'fr' => $faker->paragraphs(fake()->numberBetween(1, 3), true),
            ], JSON_UNESCAPED_UNICODE),
            'price'           => $price,
            'currency'        => 'EUR',
            'condition'       => fake()->randomElement(self::CONDITIONS),
            'status'          => 'active',
            'city'            => $cityName,
            'zip_code'        => $city['zip'],
            'country_code'    => 'FR',
            'latitude'        => fake()->randomFloat(6, $city['lat_min'], $city['lat_max']),
            'longitude'       => fake()->randomFloat(6, $city['lon_min'], $city['lon_max']),
            'views_count'     => fake()->numberBetween(0, 500),
            'favorites_count' => 0,
        ];
    }

    /**
     * Indicate that the listing is a draft (not yet published).
     */
    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }

    /**
     * Indicate that the listing is active and visible to buyers.
     */
    public function active(): static
    {
        return $this->state(['status' => 'active']);
    }

    /**
     * Indicate that the listing has been sold.
     */
    public function sold(): static
    {
        return $this->state(['status' => 'sold']);
    }

    /**
     * Indicate that the listing is for a brand-new item.
     */
    public function newCondition(): static
    {
        return $this->state(['condition' => 'new']);
    }
}
