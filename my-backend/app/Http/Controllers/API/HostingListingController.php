<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\HostingListing;
use App\Http\Controllers\Controller;

class HostingListingController extends Controller
{
    // GET /api/hosting-listings
    public function index()
    {
        $userId = auth()->guard('api')->id();

        // You can uncomment below for debugging:
        // return response()->json(HostingListing::all());

        $listings = HostingListing::where('host_id', $userId)->get();
        return response()->json($listings);
    }

    // GET /api/hosting-listings/{id}
    public function show($id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::findOrFail($id);

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($listing);
    }

    // POST /api/hosting-listings
    public function store(Request $request)
    {
        $userId = auth()->guard('api')->id();

        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'address' => 'required|string',
            'home_description' => 'required|string',
            'max_guests' => 'required|integer',
            'amenities' => 'required|string',
            'additional_details' => 'nullable|string',
        ]);

        $listing = HostingListing::create([
            'host_id' => $userId,
            'address' => $request->address,
            'home_description' => $request->home_description,
            'max_guests' => $request->max_guests,
            'amenities' => $request->amenities,
            'additional_details' => $request->additional_details,
        ]);

        return response()->json($listing, 201);
    }

    // PUT /api/hosting-listings/{id}
    public function update(Request $request, $id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::findOrFail($id);

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'address' => 'sometimes|required|string',
            'home_description' => 'sometimes|required|string',
            'max_guests' => 'sometimes|required|integer',
            'amenities' => 'sometimes|required|string',
            'additional_details' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $listing->update($request->only([
            'address',
            'home_description',
            'max_guests',
            'amenities',
            'additional_details',
            'is_available',
        ]));

        return response()->json($listing);
    }

    // DELETE /api/hosting-listings/{id}
    public function destroy($id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::findOrFail($id);

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted']);
    }
}
