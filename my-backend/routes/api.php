<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HostingListingController;


// Registration and Login routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes (requires JWT token)
Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/posts', [AuthController::class, 'posts']);
    Route::get('me', [AuthController::class, 'me']);
    Route::get('/admin', [AdminController::class, 'index']);



    // Route::get('hosting-listings', [HostingListingController::class, 'index']);
    // Route::get('hosting-listings/{id}', [HostingListingController::class, 'show']);
    // Route::post('hosting-listings', [HostingListingController::class, 'store']);
    // Route::put('hosting-listings/{id}', [HostingListingController::class, 'update']);
    // Route::delete('hosting-listings/{id}', [HostingListingController::class, 'destroy']);

    Route::get('/hosting-listings', [HostingListingController::class, 'index']);
    Route::get('/hosting-listings/{id}', [HostingListingController::class, 'show']);
    Route::post('/hosting-listings', [HostingListingController::class, 'store']);
    Route::put('/hosting-listings/{id}', [HostingListingController::class, 'update']);
    Route::delete('/hosting-listings/{id}', [HostingListingController::class, 'destroy']);
});
