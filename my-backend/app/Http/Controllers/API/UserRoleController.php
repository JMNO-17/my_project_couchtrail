<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Host;
use App\Models\Traveler;

class UserRoleController extends Controller
{
    public function check()
    {
        $user = auth()->guard('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $isHost = Host::where('user_id', $user->id)->exists();
        $isTraveler = Traveler::where('user_id', $user->id)->exists();

        return response()->json([
            'user_id' => $user->id,
            'name' => $user->name,
            'role' => $isHost ? 'host' : 'traveler'
        ]);
    }
}
