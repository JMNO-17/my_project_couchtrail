<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HostingRequest;
use Illuminate\Http\Request;

class HostingRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'traveler_id' => 'required|exists:users,id',
            'host_id' => 'required|exists:users,id',
            'host_entry_id' => 'required|exists:hosts,id',
            'location' => 'required|string|max:255',
            'message' => 'required|string',
            'date' => 'required|date',
            'status' => 'required|string',
            'is_suspicious' => 'required|boolean'
        ]);

        $hostingRequest = HostingRequest::create($validated);

        return response()->json([
            'message' => 'Hosting request created successfully.',
            'data' => $hostingRequest
        ], 201);
    }
}
