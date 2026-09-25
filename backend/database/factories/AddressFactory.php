<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Address>
     */
    protected $model = Address::class;

    /**
     * Map of French cities with their zip code and GPS coordinates.
     *
     * @var array<string, array{zip: string, lat: float, lon: float}>
     */
    private const CITIES = [
        'Paris'     => ['zip' => '75001', 'lat' => 48.8566,  'lon' => 2.3522],
        'Lyon'      => ['zip' => '69001', 'lat' => 45.7640,  'lon' => 4.8357],
        'Marseille' => ['zip' => '13001', 'lat' => 43.2965,  'lon' => 5.3698],
        'Bordeaux'  => ['zip' => '33000', 'lat' => 44.8378,  'lon' => -0.5792],
        'Toulouse'  => ['zip' => '31000', 'lat' => 43.6047,  'lon' => 1.4442],
        'Nantes'    => ['zip' => '44000', 'lat' => 47.2184,  'lon' => -1.5536],
        'Strasbourg'=> ['zip' => '67000', 'lat' => 48.5734,  'lon' => 7.7521],
        'Lille'     => ['zip' => '59000', 'lat' => 50.6292,  'lon' => 3.0573],
        'Rennes'    => ['zip' => '35000', 'lat' => 48.1173,  'lon' => -1.6778],
        'Montpellier'=> ['zip' => '34000', 'lat' => 43.6108, 'lon' => 3.8767],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker      = fake('fr_FR');
        $cityName   = $faker->randomElement(array_keys(self::CITIES));
        $cityData   = self::CITIES[$cityName];

        return [
            'label'        => $faker->randomElement(['Domicile', 'Bureau', 'Chez mes parents', 'Résidence principale']),
            'first_name'   => $faker->firstName(),
            'last_name'    => $faker->lastName(),
            'line1'        => $faker->streetAddress(),
            'line2'        => fake()->optional(0.2)->secondaryAddress(),
            'city'         => $cityName,
            'zip_code'     => $cityData['zip'],
            'country_code' => 'FR',
            'is_default'   => false,
        ];
    }

    /**
     * Indicate that this is the user's default address.
     */
    public function default(): static
    {
        return $this->state(['is_default' => true]);
    }
}
