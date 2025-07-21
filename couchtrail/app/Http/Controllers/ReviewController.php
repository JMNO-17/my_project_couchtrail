<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return Review::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'reviewer_id' => 'required|exists:users,id',
            'reviewed_id' => 'required|exists:users,id',
            'type' => 'required|in:host,traveler',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'is_flagged' => 'boolean',
        ]);

        $review = Review::create($data);

        return response()->json($review, 201);
    }

    public function show($id)
    {
        return Review::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $data = $request->validate([
            'type' => 'nullable|in:host,traveler',
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'is_flagged' => 'boolean',
        ]);

        $review->update($data);

        return response()->json($review);
    }

    public function destroy($id)
    {
        Review::destroy($id);

        return response()->json(null, 204);
    }
}
