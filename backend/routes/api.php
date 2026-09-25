<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CategoryAttributeController;
use App\Http\Controllers\Api\V1\ListingController;
use App\Http\Controllers\Api\V1\ListingImageController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\Admin\AdminListingController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\AdminReportController;

/*
|--------------------------------------------------------------------------
| API Routes � VideDressing v1
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api/v1 automatically via bootstrap/app.php.
| Additional prefix 'v1' is added here for explicit versioning.
|
*/

Route::middleware('set.locale')->prefix('v1')->group(function () {

    // =========================================================================
    // AUTH � Public endpoints
    // =========================================================================
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->name('verification.verify');

    // =========================================================================
    // PUBLIC � No authentication required
    // =========================================================================

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/categories/{categoryId}/attributes', [CategoryAttributeController::class, 'index']);

    // Listings
    Route::get('/listings', [ListingController::class, 'index']);
    Route::get('/listings/{id}', [ListingController::class, 'show']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);

    // Public user profiles & reviews
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/users/{id}/reviews', [ReviewController::class, 'index']);

    // =========================================================================
    // AUTHENTICATED � Requires valid Sanctum token
    // =========================================================================
    Route::middleware('auth:sanctum')->group(function () {

        // --- Auth management ---
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/resend-verification', [AuthController::class, 'resendVerification']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // --- Profile ---
        Route::put('/profile', [UserController::class, 'update']);
        Route::get('/profile/export', [UserController::class, 'exportData']);
        Route::delete('/profile', [UserController::class, 'deleteAccount']);

        // --- Addresses ---
        Route::get('/addresses', [UserController::class, 'addresses']);
        Route::post('/addresses', [UserController::class, 'storeAddress']);
        Route::put('/addresses/{address}', [UserController::class, 'updateAddress']);
        Route::delete('/addresses/{address}', [UserController::class, 'destroyAddress']);
        Route::patch('/addresses/{address}/default', [UserController::class, 'setDefaultAddress']);

        // --- Listings ---
        Route::get('/my-listings', [ListingController::class, 'myListings']);
        Route::post('/listings', [ListingController::class, 'store']);
        Route::put('/listings/{listing}', [ListingController::class, 'update']);
        Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);
        Route::patch('/listings/{listing}/publish', [ListingController::class, 'publish']);
        Route::patch('/listings/{listing}/archive', [ListingController::class, 'archive']);

        // --- Listing Images ---
        Route::post('/listings/{listing}/images', [ListingImageController::class, 'store']);
        Route::delete('/listings/{listing}/images/{image}', [ListingImageController::class, 'destroy']);
        Route::post('/listings/{listing}/images/reorder', [ListingImageController::class, 'reorder']);
        Route::patch('/listings/{listing}/images/{image}/cover', [ListingImageController::class, 'setCover']);

        // --- Favorites ---
        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/listings/{listing}/favorite', [FavoriteController::class, 'toggle']);

        // --- Conversations ---
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::post('/conversations', [ConversationController::class, 'store']);
        Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
        Route::delete('/conversations/{conversation}', [ConversationController::class, 'destroy']);

        // --- Messages ---
        Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index']);
        Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
        Route::post('/conversations/{conversation}/read', [MessageController::class, 'markAsRead']);

        // --- Orders (Stripe stand-by � stubs retournent 501) ---
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::post('/orders/{order}/confirm-delivery', [OrderController::class, 'confirmDelivery']);
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

        // --- Reviews ---
        Route::post('/orders/{order}/review', [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // --- Reports ---
        Route::post('/reports', [ReportController::class, 'store']);
        Route::get('/reports', [ReportController::class, 'index']);

        // =====================================================================
        // ADMIN � Requires auth:sanctum + IsAdmin middleware
        // =====================================================================
        Route::middleware('is.admin')->prefix('admin')->group(function () {

            // Admin: Categories management
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

            // Admin: Category Attributes management
            Route::post('/categories/{categoryId}/attributes', [CategoryAttributeController::class, 'store']);
            Route::put('/categories/{categoryId}/attributes/{attribute}', [CategoryAttributeController::class, 'update']);
            Route::delete('/categories/{categoryId}/attributes/{attribute}', [CategoryAttributeController::class, 'destroy']);

            // Admin: Listings moderation
            Route::get('/listings', [AdminListingController::class, 'index']);
            Route::patch('/listings/{listing}/ban', [AdminListingController::class, 'ban']);
            Route::patch('/listings/{listing}/unban', [AdminListingController::class, 'unban']);
            Route::delete('/listings/{listing}', [AdminListingController::class, 'destroy']);

            // Admin: Users management
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::get('/users/{user}', [AdminUserController::class, 'show']);
            Route::patch('/users/{user}/ban', [AdminUserController::class, 'ban']);
            Route::patch('/users/{user}/unban', [AdminUserController::class, 'unban']);
            Route::patch('/users/{user}/make-admin', [AdminUserController::class, 'makeAdmin']);

            // Admin: Reports resolution
            Route::get('/reports', [AdminReportController::class, 'index']);
            Route::get('/reports/{report}', [AdminReportController::class, 'show']);
            Route::patch('/reports/{report}/resolve', [AdminReportController::class, 'resolve']);
        });
    });
});



