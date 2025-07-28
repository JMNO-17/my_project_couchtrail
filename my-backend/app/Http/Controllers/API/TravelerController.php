<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Traveler;

class TravelerController extends Controller
{
    public function index()
    {
        return response()->json(Traveler::all());
    }

    public function show($id)
    {
        return response()->json(Traveler::where('user_id', $id)->first());
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
