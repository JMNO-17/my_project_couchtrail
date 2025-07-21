<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\PermissionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/auth/login', [AuthController::class, 'login']);

Route::apiResource('/users', UserController::class);

Route::apiResource('/roles', RoleController::class);

Route::apiResource('/permissions', PermissionController::class);

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/auth/register', [AuthController::class, 'register']);

    Route::apiResource('/categories', CategoryController::class);

    Route::apiResource('/products', ProductController::class);
});
