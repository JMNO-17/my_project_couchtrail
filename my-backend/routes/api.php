<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HostingListingController;
use App\Http\Controllers\API\HostingRequestController;
use App\Http\Controllers\API\HostController;
use App\Http\Controllers\API\TravelerController;
use App\Http\Controllers\API\UserRoleController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ReviewController;


// Registration and Login routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// Protected routes (requires JWT token)
Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/posts', [AuthController::class, 'posts']);
    Route::get('me', [AuthController::class, 'me']);
    Route::get('/admin', [AdminController::class, 'index']);

    Route::get('/hosting-listings', [HostingListingController::class, 'index']);
    Route::get('/hosting-listings/{id}', [HostingListingController::class, 'show']);
    Route::post('/hosting-listings', [HostingListingController::class, 'store']);
    Route::put('/hosting-listings/{id}', [HostingListingController::class, 'update']);
    Route::delete('/hosting-listings/{id}', [HostingListingController::class, 'destroy']);

    Route::patch('/hosting-requests/{hostingRequest}/status', [HostingRequestController::class, 'updateStatus']);
    Route::get('/hosting-requests/{id}', [HostingRequestController::class, 'show']);
    Route::get('/hosting-requests/host_id/{id}',[HostingRequestController::class, 'getRequestByHostId']);
    Route::get('/hosting-requests/traveler_id/{id}',[HostingRequestController::class, 'getRequestByTravelerId']);
    Route::get('/hosting-requests', [HostingRequestController::class, 'index']);
    Route::post('/hosting-requests', [HostingRequestController::class, 'store']);
    Route::delete('/hosting-requests/{id}',[HostingRequestController::class,'destory']);



    Route::get('/hosts', [HostController::class, 'index']);
    Route::get('/hosts/{id}', [HostController::class, 'show']); // id = user_id
    Route::post('/hosts', [HostController::class, 'store']);


    Route::get('/travelers', [TravelerController::class, 'index']);
    Route::get('/travelers/{id}', [TravelerController::class, 'show']);
    Route::post('/travelers', [TravelerController::class, 'store']);

    Route::get('/me/type', [UserRoleController::class, 'check']);



    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::get('/users', [UserController::class, 'index']);
    Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/reviews', [ReviewController::class, 'index']);

    Route::get('/hosting-listings/user/{id}', [HostingListingController::class, 'getHostingByUserId']);
});

