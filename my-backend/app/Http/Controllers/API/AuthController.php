<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Traveler;

class AuthController extends Controller
{
    /**
     * Register new user and assign role
     */

   public function register(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|string|email|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => bcrypt($request->password),
    ]);

    $user->assignRole($request->role);

    // ✅ Create Traveler record by default
    Traveler::create([
        'user_id' => $user->id,
        'name' => $user->name,
        'location' => '',
        'avatar' => '',
        'bio' => '',
        'trip_count' => 0,
        'is_verified' => false,
    ]);

    $token = JWTAuth::fromUser($user);

    return response()->json([
        'user'  => $user,
        'token' => $token
    ]);
}






    /**
     * Login user and return JWT token
     */
    public function login(Request $request)
    {

        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $roleName = $user->getRoleNames()->first();  // returns the first role name as a string

        $user = auth()->guard('api')->user();

        $token = JWTAuth::fromUser($user);

        $user = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $roleName,
        ];

        return response()->json([
            'user'  => $user,
            'token' => $token,

        ]);
    }

    /**
     * Logout (invalidate token)
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout, token missing or invalid'], 401);
        }
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        try {
            $user = User::where('id', Auth::user()->id)->first();

            $roleName = $user->getRoleNames()->first();  // returns the first role name as a string

            $user = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleName,
            ];

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated.'], 401);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token error: ' . $e->getMessage()], 401);
        }
    }

    // public function posts(){

    //     return Auth::user();

    // }
}
