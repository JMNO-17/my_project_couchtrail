<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HostingController;
use App\Http\Controllers\HostingRequestController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Admin\UserManagementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are for token-based API use (e.g. React/Vue frontend).
*/

// Public Auth Endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected API routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Authenticated user profile
    Route::get('/user', [UserController::class, 'profile']);
   

    // Resource routes for CouchTrail features
    Route::apiResource('hostings', HostingController::class);
    Route::apiResource('hosting-requests', HostingRequestController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('places', PlaceController::class);
    Route::apiResource('reviews', ReviewController::class);

    // Admin-only API routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    });
});
