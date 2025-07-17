<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json(Review::with(['reviewer', 'reviewed'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reviewed_id' => 'required|exists:users,id',
            'type' => 'required|in:host,traveler',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = Review::create([
            'reviewer_id' => Auth::id(),
            ...$validated,
            'date' => now(),
            'is_flagged' => false,
        ]);

        return response()->json(['message' => 'Review created', 'data' => $review], 201);
    }

    public function show($id)
    {
        $review = Review::with(['reviewer', 'reviewed'])->find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        return response()->json($review);
    }

    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        if ($review->reviewer_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'is_flagged' => 'nullable|boolean',
        ]);

        $review->update($validated);

        return response()->json(['message' => 'Review updated', 'data' => $review]);
    }

    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        if ($review->reviewer_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted']);
    }
}
