<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends BaseApiController
{
    /**
     * List all users.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::orderBy('created_at', 'desc')->paginate(20);
        return $this->sendResponse($users, 'Users retrieved successfully');
    }

    /**
     * Show user details.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['listings', 'orders']);
        return $this->sendResponse($user, 'User details retrieved');
    }

    /**
     * Ban a user.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function ban(User $user): JsonResponse
    {
        $user->update(['banned_at' => now()]);
        return $this->sendResponse($user, 'User banned');
    }

    /**
     * Unban a user.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function unban(User $user): JsonResponse
    {
        $user->update(['banned_at' => null]);
        return $this->sendResponse($user, 'User unbanned');
    }

    /**
     * Make a user an admin.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function makeAdmin(User $user): JsonResponse
    {
        $user->update(['is_admin' => true]);
        return $this->sendResponse($user, 'User is now an admin');
    }
}
