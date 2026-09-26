<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Twilio\Rest\Client;

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
        $otp = (string) random_int(100000, 999999);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : null,
            'phone' => $request->phone,
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // \Illuminate\Support\Facades\Log::info("OTP pour {$user->phone} : {$otp}");
        $this->sendWhatsappViaTwilio($user->phone, "Bienvenue sur VideDressing ! Votre code de vérification est : {$otp}");

        return $this->sendResponse([
            'message' => 'OTP sent',
        ], 'User registered successfully, OTP sent', 201);
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
        if (\Illuminate\Support\Facades\Auth::attempt($request->only('phone', 'password'))) {
            $user = \Illuminate\Support\Facades\Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->sendResponse([
                'user' => $user,
                'token' => $token
            ], 'User logged in successfully');
        }

        return $this->sendError('Invalid credentials', [], 401);
    }

    /**
     * Send OTP to existing user for login.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return $this->sendError('User not found', [], 404);
        }

        $otp = (string) random_int(100000, 999999);
        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // \Illuminate\Support\Facades\Log::info("OTP pour {$user->phone} : {$otp}");
        $this->sendWhatsappViaTwilio($user->phone, "Bienvenue sur VideDressing ! Votre code de vérification est : {$otp}");

        return $this->sendResponse([
            'message' => 'OTP sent',
        ], 'OTP sent successfully');
    }

    /**
     * Verify OTP and login user.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        // Bypass OTP for dev (magic code 000000)
        if ($request->code !== '000000' && (!$user || $user->otp_code !== $request->code || $user->otp_expires_at < now())) {
            return $this->sendError('Invalid or expired OTP', [], 401);
        }

        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->sendResponse([
            'user' => $user,
            'token' => $token
        ], 'User logged in successfully');
    }

    /**
     * Logout user (Revoke the token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

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
    /**
     * Helper pour envoyer le SMS via Twilio
     */
    private function sendWhatsappViaTwilio(string $to, string $messageBody)
    {
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_WHATSAPP_FROM'); // Doit être configuré (ex: whatsapp:+14155238886)

        if ($sid && $token && $from) {
            try {
                // Assurez-vous que le format du numéro commence par un +
                if (!str_starts_with($to, '+')) {
                    $to = '+' . ltrim($to, '0');
                }

                $client = new Client($sid, $token);
                $client->messages->create("whatsapp:" . $to, [
                    'from' => $from, // ex: "whatsapp:+14155238886"
                    'body' => $messageBody
                ]);
                \Illuminate\Support\Facades\Log::info("WhatsApp envoyé à {$to}");
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Erreur Twilio WhatsApp : " . $e->getMessage());
            }
        } else {
            \Illuminate\Support\Facades\Log::warning("Twilio WhatsApp non configuré. Le message n'a pas pu être envoyé à {$to} : {$messageBody}");
        }
    }
}

