<?php

namespace App\Http\Controllers;

use App\Models\Hosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HostingController extends Controller
{
    public function index()
    {
        return response()->json(Hosting::with('user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'home_description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'preferences' => 'nullable|string',
            'details' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'availability_calendar' => 'nullable|string',
        ]);

        $hosting = Hosting::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        return response()->json(['message' => 'Hosting created successfully', 'data' => $hosting], 201);
    }

    public function show($id)
    {
        $hosting = Hosting::with('user')->find($id);
        if (!$hosting) {
            return response()->json(['message' => 'Hosting not found'], 404);
        }
        return response()->json($hosting);
    }

    public function update(Request $request, $id)
    {
        $hosting = Hosting::find($id);
        if (!$hosting) {
            return response()->json(['message' => 'Hosting not found'], 404);
        }
        if ($hosting->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'home_description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'preferences' => 'nullable|string',
            'details' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'availability_calendar' => 'nullable|string',
        ]);

        $hosting->update($validated);

        return response()->json(['message' => 'Hosting updated successfully', 'data' => $hosting]);
    }

    public function destroy($id)
    {
        $hosting = Hosting::find($id);
        if (!$hosting) {
            return response()->json(['message' => 'Hosting not found'], 404);
        }
        if ($hosting->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $hosting->delete();

        return response()->json(['message' => 'Hosting deleted successfully']);
    }
}
