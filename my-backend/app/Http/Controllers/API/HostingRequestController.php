<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HostingRequest;

class HostingRequestController extends Controller
{
    public function index()
    {
        return HostingRequest::with(['host', 'traveler', 'hostEntry'])->get();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'traveler_id' => 'required|exists:users,id',
            'host_id' => 'required|exists:users,id',
            'host_entry_id' => 'required|exists:hosts,id', // ✅ New validation
            'location' => 'required|string',
            'date' => 'required|date',
            'message' => 'required|string',
        ]);

        $hostingRequest = HostingRequest::create($validated);
        return response()->json($hostingRequest->load(['host', 'traveler', 'hostEntry']), 201);
    }

    public function updateStatus(Request $request, HostingRequest $hostingRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        $hostingRequest->status = $validated['status'];
        $hostingRequest->save();

        return response()->json($hostingRequest);
    }
}
