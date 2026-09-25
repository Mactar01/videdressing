<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends BaseApiController
{
    /**
     * Get global statistics for the Admin Dashboard.
     */
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalListings = Listing::count();
        $activeListings = Listing::where('status', 'active')->count();
        $totalOrders = Order::count();
        $volumeTotal = Order::whereIn('status', ['paid', 'shipped', 'delivered'])->sum('amount');
        
        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']);
        $recentListings = Listing::with('user:id,name')->latest()->take(5)->get();

        return $this->success([
            'metrics' => [
                'users_count' => $totalUsers,
                'listings_count' => $totalListings,
                'active_listings_count' => $activeListings,
                'orders_count' => $totalOrders,
                'revenue' => $volumeTotal,
            ],
            'recent_users' => $recentUsers,
            'recent_listings' => $recentListings,
        ]);
    }
}
