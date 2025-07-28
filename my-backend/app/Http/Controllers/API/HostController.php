<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Host;
use App\Models\HostingListing;
use App\Models\Traveler;

class HostController extends Controller
{

  public function index()
{
    $hosts = Host::with('user')->get();

    // Transform to add user.name and user.avatar to each host
    $transformedHosts = $hosts->map(function ($host) {
        return [
            'id' => $host->id,
            'user_id' => $host->user_id,
            'name' => $host->user->name ?? 'Unknown',
            'avatar' => $host->user->avatar ?? null,
            'location' => $host->location,
            'rating' => $host->rating,
            'review_count' => $host->review_count,
            'description' => $host->description,
            'amenities' => $host->amenities,
            'is_verified' => $host->is_verified,
            'response_time' => $host->response_time,
        ];
    });

    return response()->json($transformedHosts);
}


  public function store(Request $request)
{
    $user = auth()->guard('api')->user();

    if (!$user) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    // Validate required fields
    $validated = $request->validate([
        'location' => 'required|string',
        'description' => 'required|string',
        'home_description' => 'required|string',
        'max_guests' => 'required|integer',
        'address' => 'required|string',
        'amenities' => 'required|string',
        'additional_details' => 'nullable|string',
    ]);

    // Remove traveler role if exists
    \App\Models\Traveler::where('user_id', $user->id)->delete();

    // Step 1: Create Host Profile
    $host = \App\Models\Host::updateOrCreate(
        ['user_id' => $user->id],
        [
            'location' => $validated['location'],
            'avatar' => $user->avatar ?? null,
            'rating' => 0,
            'review_count' => 0,
            'description' => $validated['description'],
            'home_description' => $validated['home_description'],
            'additional_details' => $validated['additional_details'] ?? null,
            'max_guests' => $validated['max_guests'],
            'amenities' => $validated['amenities'],
            'is_verified' => false,
            'response_time' => '< 1 hour',
            'is_available' => true,
        ]
    );

    // Step 2: Create Hosting Listing
    \App\Models\HostingListing::create([
        'user_id' => $user->id,
        'host_id' => $host->id,
        'address' => $validated['address'],
        'home_description' => $validated['home_description'],
        'max_guests' => $validated['max_guests'],
        'amenities' => $validated['amenities'],
        'additional_details' => $validated['additional_details'] ?? null,
        'is_available' => true,
    ]);

    return response()->json([
        'message' => 'Host and listing created successfully',
        'host_id' => $host->id
    ]);
}

}
