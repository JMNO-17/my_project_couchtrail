<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query();

        if ($request->has('reviewed_id')) {
            $query->where('reviewed_id', $request->reviewed_id);
        }

        return response()->json($query->get());
    }
}
