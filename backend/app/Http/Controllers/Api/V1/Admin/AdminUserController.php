<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $users = User::latest()->paginate(20);
        return $this->success($users);
    }

    public function show(User $user): JsonResponse
    {
        return $this->success($user->load('listings'));
    }

    public function ban(User $user): JsonResponse
    {
        $user->update(['is_banned' => true]);
        return $this->success($user, 'User banned');
    }

    public function unban(User $user): JsonResponse
    {
        $user->update(['is_banned' => false]);
        return $this->success($user, 'User unbanned');
    }

    public function makeAdmin(User $user): JsonResponse
    {
        $user->update(['is_admin' => true]);
        return $this->success($user, 'User promoted to admin');
    }
}
