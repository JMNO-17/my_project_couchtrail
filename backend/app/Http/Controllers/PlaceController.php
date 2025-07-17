<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    public function index()
    {
        return response()->json(Place::with('user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|string', // could be JSON string or comma-separated paths
            'popular' => 'nullable|boolean',
        ]);

        $place = Place::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        return response()->json(['message' => 'Place created successfully', 'data' => $place], 201);
    }

    public function show($id)
    {
        $place = Place::with('user')->find($id);
        if (!$place) {
            return response()->json(['message' => 'Place not found'], 404);
        }
        return response()->json($place);
    }

    public function update(Request $request, $id)
    {
        $place = Place::find($id);
        if (!$place) {
            return response()->json(['message' => 'Place not found'], 404);
        }
        if ($place->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|string',
            'popular' => 'nullable|boolean',
        ]);

        $place->update($validated);

        return response()->json(['message' => 'Place updated successfully', 'data' => $place]);
    }

    public function destroy($id)
    {
        $place = Place::find($id);
        if (!$place) {
            return response()->json(['message' => 'Place not found'], 404);
        }
        if ($place->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $place->delete();

        return response()->json(['message' => 'Place deleted successfully']);
    }
}
