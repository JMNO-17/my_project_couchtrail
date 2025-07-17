<?php

namespace App\Http\Controllers;

use App\Models\HostingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HostingRequestController extends Controller
{
    public function index()
    {
        return response()->json(HostingRequest::with(['traveler', 'host'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'host_id' => 'required|exists:users,id',
            'location' => 'required|string',
            'message' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $hostingRequest = HostingRequest::create([
            'traveler_id' => Auth::id(),
            ...$validated,
            'status' => 'pending',
            'is_suspicious' => false,
        ]);

        return response()->json(['message' => 'Hosting request created', 'data' => $hostingRequest], 201);
    }

    public function show($id)
    {
        $request = HostingRequest::with(['traveler', 'host'])->find($id);
        if (!$request) {
            return response()->json(['message' => 'Hosting request not found'], 404);
        }
        return response()->json($request);
    }

    public function update(Request $request, $id)
    {
        $hostingRequest = HostingRequest::find($id);
        if (!$hostingRequest) {
            return response()->json(['message' => 'Hosting request not found'], 404);
        }
        if ($hostingRequest->traveler_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'location' => 'nullable|string',
            'message' => 'nullable|string',
            'date' => 'nullable|date',
            'status' => 'nullable|in:pending,accepted,rejected',
            'is_suspicious' => 'nullable|boolean',
        ]);

        $hostingRequest->update($validated);

        return response()->json(['message' => 'Hosting request updated', 'data' => $hostingRequest]);
    }

    public function destroy($id)
    {
        $hostingRequest = HostingRequest::find($id);
        if (!$hostingRequest) {
            return response()->json(['message' => 'Hosting request not found'], 404);
        }
        if ($hostingRequest->traveler_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $hostingRequest->delete();

        return response()->json(['message' => 'Hosting request deleted']);
    }
}
