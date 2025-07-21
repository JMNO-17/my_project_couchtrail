<?php

namespace App\Http\Controllers;

use App\Models\HostingRequest;
use Illuminate\Http\Request;

class HostingRequestController extends Controller
{
    public function index()
    {
        return HostingRequest::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'traveler_id' => 'required|exists:users,id',
            'host_id' => 'required|exists:users,id',
            'location' => 'required|string',
            'message' => 'nullable|string',
            'date' => 'required|date',
            'status' => 'in:pending,accepted,rejected',
            'is_suspicious' => 'boolean',
        ]);

        $hostingRequest = HostingRequest::create($data);

        return response()->json($hostingRequest, 201);
    }

    public function show($id)
    {
        return HostingRequest::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $hostingRequest = HostingRequest::findOrFail($id);

        $data = $request->validate([
            'location' => 'nullable|string',
            'message' => 'nullable|string',
            'date' => 'nullable|date',
            'status' => 'in:pending,accepted,rejected',
            'is_suspicious' => 'boolean',
        ]);

        $hostingRequest->update($data);

        return response()->json($hostingRequest);
    }

    public function destroy($id)
    {
        HostingRequest::destroy($id);

        return response()->json(null, 204);
    }
}
