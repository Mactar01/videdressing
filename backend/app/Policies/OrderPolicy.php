<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the order.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->buyer_id || $user->id === $order->seller_id;
    }

    /**
     * Determine whether the user can cancel the order.
     */
    public function cancel(User $user, Order $order): bool
    {
        return $user->id === $order->buyer_id && $order->status === 'pending_payment';
    }

    /**
     * Determine whether the user can confirm delivery of the order.
     */
    public function confirmDelivery(User $user, Order $order): bool
    {
        return $user->id === $order->buyer_id && $order->status === 'shipped';
    }
}
