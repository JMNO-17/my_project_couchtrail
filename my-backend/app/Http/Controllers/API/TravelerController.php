<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\TravelerResource;
use App\Models\HostingListing;
use Illuminate\Http\Request;
use App\Models\Traveler;
use App\Models\User;

class TravelerController extends Controller
{
    public function index()
    {
        $usersInHostListing = HostingListing::pluck('user_id');
        $userId = auth()->guard('api')->id();
        $traveler = Traveler::whereNotIn("user_id", $usersInHostListing)->where('user_id','!=', $userId)->get();
            foreach($traveler as $t) {
                $user = User::where("id",$t->user_id)->first();

                $t->email = $user->email;
            }

        return $traveler;

    }

    public function show($id)
    {
        $traveler = Traveler::where('user_id', $id)->first();

        $user = User::where("id",$traveler->id)->first();

        $traveler->email = $user->email;

        return $traveler;
    }

    public function store(Request $request)
    {
        $user = auth()->guard('api')->user();

        $traveler = Traveler::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'location' => $request->location ?? '',
            'avatar' => $request->avatar ?? '',
            'bio' => $request->bio ?? '',
            'trip_count' => 0,
            'is_verified' => false,
        ]);

        return response()->json($traveler, 201);
    }
}
