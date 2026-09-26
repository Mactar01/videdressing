<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        $users = [
            [
                'name'              => 'Marie Dubois (Admin)',
                'phone'             => '+22177' . rand(1000000, 9999999),
                'email'             => 'marie.admin@vdressing.fr',
                'password'          => $password,
                'is_admin'          => true,
                'is_verified'       => true,
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Sophie Martin',
                'phone'             => '+22177' . rand(1000000, 9999999),
                'email'             => 'sophiemartin@example.fr',
                'password'          => $password,
                'is_admin'          => false,
                'is_verified'       => true,
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Thomas Bernard',
                'phone'             => '+22177' . rand(1000000, 9999999),
                'email'             => 'thomas.b@example.fr',
                'password'          => $password,
                'is_admin'          => false,
                'is_verified'       => true,
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Emma Petit',
                'phone'             => '+22177' . rand(1000000, 9999999),
                'email'             => 'emma.p@example.fr',
                'password'          => $password,
                'is_admin'          => false,
                'is_verified'       => false,
                'email_verified_at' => null,
            ],
            [
                'name'              => 'Lucas Moreau',
                'phone'             => '+22177' . rand(1000000, 9999999),
                'email'             => 'lucas.m@example.fr',
                'password'          => $password,
                'is_admin'          => false,
                'is_verified'       => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Create 1-2 addresses for each user (which natively contain first_name / last_name / line1 etc.)
            Address::factory()->count(rand(1, 2))->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
