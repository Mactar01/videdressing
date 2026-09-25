<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends BaseApiController
{
    /**
     * Register a new user.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        \Illuminate\Support\Facades\Auth::login($user); $request->session()->regenerate();

        return $this->sendResponse([
            'user' => $user,
            
        ], 'User registered successfully', 201);
    }

    /**
     * Login user and create token.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    /**
     * @OA\Post(
     *      path="/api/v1/auth/login",
     *      tags={"Authentification"},
     *      summary="Connecter un utilisateur",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"email","password"},
     *              @OA\Property(property="email", type="string", format="email", example="marie.admin@vdressing.fr"),
     *              @OA\Property(property="password", type="string", format="password", example="password")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Connexion r�ussie avec token"),
     *      @OA\Response(response=401, description="Identifiants invalides")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (\Illuminate\Support\Facades\Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            return $this->sendResponse([
                'user' => \Illuminate\Support\Facades\Auth::user(),
            ], 'User logged in successfully');
        }

        return $this->sendError('Invalid credentials', [], 401);
    }

    /**
     * Logout user (Revoke the token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->sendResponse(null, 'User logged out successfully');
    }

    /**
     * Get the authenticated User.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['addresses']);
        
        return $this->sendResponse($user, 'User fetched successfully');
    }

    /**
     * Verify email.
     *
     * @param Request $request
     * @param int $id
     * @param string $hash
     * @return JsonResponse
     */
    public function verifyEmail(Request $request, $id, $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return $this->sendError('Invalid verification link', [], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->sendResponse(null, 'Email already verified');
        }

        $user->markEmailAsVerified();

        return $this->sendResponse(null, 'Email verified successfully');
    }

    /**
     * Resend verification email.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->sendResponse(null, 'Email already verified');
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->sendResponse(null, 'Verification link sent');
    }
}

