<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\User>
     */
    protected $model = User::class;

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password = null;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'               => fake('fr_FR')->name(),
            'email'              => fake()->unique()->safeEmail(),
            'email_verified_at'  => now(),
            'password'           => static::$password ??= Hash::make('password'),
            'phone'              => fake('fr_FR')->phoneNumber(),
            'bio'                => fake('fr_FR')->sentence(10),
            'locale'             => 'fr',
            'is_verified'        => true,
            'is_admin'           => false,
            'is_banned'          => false,
            'remember_token'     => \Illuminate\Support\Str::random(10),
        ];
    }

    /**
     * Indicate that the user has administrator privileges.
     */
    public function admin(): static
    {
        return $this->state(['is_admin' => true]);
    }

    /**
     * Indicate that the user's email address is unverified.
     */
    public function unverified(): static
    {
        return $this->state(['email_verified_at' => null]);
    }

    /**
     * Indicate that the user is banned from the platform.
     */
    public function banned(): static
    {
        return $this->state(['is_banned' => true]);
    }
}
