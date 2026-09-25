<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Order>
     */
    protected $model = Order::class;

    /**
     * Platform commission rate applied to every order.
     */
    private const PLATFORM_FEE_RATE = 0.10;

    /**
     * Define the model's default state.
     *
     * The reference follows the format VD-{YEAR}-{6 random uppercase letters},
     * which guarantees human-readable, sortable, unique order numbers.
     *
     * Note: `listing_id`, `buyer_id` and `seller_id` MUST be provided by the seeder.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount        = fake()->randomFloat(2, 10.00, 300.00);
        $platformFee   = round($amount * self::PLATFORM_FEE_RATE, 2);
        $sellerAmount  = round($amount - $platformFee, 2);

        return [
            'reference'     => 'VD-' . date('Y') . '-' . strtoupper(fake()->lexify('??????')),
            'amount'        => $amount,
            'platform_fee'  => $platformFee,
            'seller_amount' => $sellerAmount,
            'currency'      => 'EUR',
            'status'        => 'delivered',
        ];
    }

    /**
     * Indicate that payment is pending for this order.
     */
    public function pendingPayment(): static
    {
        return $this->state(['status' => 'pending_payment']);
    }

    /**
     * Indicate that the order has been paid but not yet shipped.
     */
    public function paid(): static
    {
        return $this->state(['status' => 'paid']);
    }

    /**
     * Indicate that the order has been shipped to the buyer.
     */
    public function shipped(): static
    {
        return $this->state(['status' => 'shipped']);
    }

    /**
     * Indicate that the order has been delivered to the buyer.
     */
    public function delivered(): static
    {
        return $this->state(['status' => 'delivered']);
    }

    /**
     * Indicate that the order has been cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }
}
