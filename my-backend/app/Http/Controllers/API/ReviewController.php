<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    // List reviews for a specific user
    public function index(Request $request)
{
    $userId = $request->query('user_id');

    $reviews = Review::with(['reviewer', 'reviewed'])
        ->when($userId, function($q) use ($userId) {
            $q->where(function($query) use ($userId) {
                $query->where('reviewed_id', $userId)
                      ->orWhere('reviewer_id', $userId);
            });
        })
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($reviews->map(fn($r) => [
        'id' => (int)$r->id,
        'reviewer_id' => (int)$r->reviewer_id,
        'reviewed_id' => (int)$r->reviewed_id,
        'rating' => (int)$r->rating,
        'comment' => $r->comment,
        'is_flagged' => (bool)$r->is_flagged,
        'date' => $r->date,
        'reviewer' => $r->reviewer ? [
            'id' => (int)$r->reviewer->id,
            'name' => $r->reviewer->name,
            'avatar' => $r->reviewer->avatar ?? null,
        ] : null,
        'reviewed' => $r->reviewed ? [
            'id' => (int)$r->reviewed->id,
            'name' => $r->reviewed->name,
            'avatar' => $r->reviewed->avatar ?? null,
        ] : null,
    ]));
}


    // Submit a new review
    public function store(Request $request)
    {
        $data = $request->validate([
            'reviewer_id' => 'required|exists:users,id',
            'reviewed_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $data['is_flagged'] = false;

        $review = Review::create($data)->load(['reviewer', 'reviewed']);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => [
                'id' => (int)$review->id,
                'reviewer_id' => (int)$review->reviewer_id,
                'reviewed_id' => (int)$review->reviewed_id,
                'rating' => (int)$review->rating,
                'comment' => $review->comment,
                'is_flagged' => (bool)$review->is_flagged,
                'date' => $review->date,
                'reviewer' => [
                    'id' => (int)$review->reviewer->id,
                    'name' => $review->reviewer->name,
                    'avatar' => $review->reviewer->avatar ?? null,
                ],
                'reviewed' => [
                    'id' => (int)$review->reviewed->id,
                    'name' => $review->reviewed->name,
                    'avatar' => $review->reviewed->avatar ?? null,
                ],
            ],
        ]);
    }
}
