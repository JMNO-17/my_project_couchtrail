<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            'flaggedReviews' => Review::where('is_flagged', true)->count()
        ]);
    }

    public function users()
    {
        return User::all();
    }

    public function toggleUserStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json(['message' => 'User status updated.', 'user' => $user]);
    }

    public function reviews()
    {
        return Review::all();
    }

    public function approveReview($id)
    {
        $review = Review::findOrFail($id);
        $review->is_flagged = false;
        $review->save();

        return response()->json(['message' => 'Review approved.', 'review' => $review]);
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}
