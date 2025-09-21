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
            'traveler_id' => 'required',
            'host_id' => 'required',
            // 'host_entry_id' => 'required',
            // 'user_id' => 'required',
            'location' => 'required|string|max:255',
            'message' => 'required|string',
            'date' => 'required|string',
            'number_of_guests' => 'required',
            // 'status' => 'required|string',
            // 'is_suspicious' => 'required|boolean'
        ]);


        $hostingRequest = HostingRequest::create($validated);

        return response()->json([
            'message' => 'Hosting request created successfully.',
            'data' => $hostingRequest
        ], 201);
    }

    public function show($id) {
        $hostingRequest = HostingRequest::find($id);
        return response()->json([
            'message' => 'Retrieved successfully',
            'data' => $hostingRequest
        ]);
    }
}
