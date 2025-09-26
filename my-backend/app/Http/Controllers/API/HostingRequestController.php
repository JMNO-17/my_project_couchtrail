<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HostingRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\RequestMatcher\HostRequestMatcher;
use App\Http\Resources\HostingRequestResource;
use App\Models\HostingListing;
use Carbon\Carbon;

class HostingRequestController extends Controller
{
    // public function index()
    // {
    //     $hostingRequest = HostingRequest::with('traveler')->get();
    //     return HostingRequestResource::collection($hostingRequest);
    // }

    public function getAcceptRequest($id)
    {

        $hostingRequest = HostingRequest::with('traveler')->where('host_id', $id)->where('status','accepted')->get();

        return HostingRequestResource::collection($hostingRequest);

    }

    public function getRequestByHostId($id)
    {
        $hostingRequest = HostingRequest::with('traveler')->where('host_id', $id)->where('status','pending')->get();


        return HostingRequestResource::collection($hostingRequest);
    }

    public function getRequestByTravelerId($id)
    {
        return HostingRequest::where('traveler_id', $id)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'traveler_id' => 'required',
            'host_id' => 'required',
            'name' => 'string',
            // 'host_entry_id' => 'required',
            // 'user_id' => 'required',
            'location' => 'required|string|max:255',
            'message' => 'required|string',
            'date' => 'required|string',
            'number_of_guests' => 'required',
            'status' => 'required|string',

            // 'is_suspicious' => 'required|boolean'
        ]);

        $hostingRequest = HostingRequest::create($validated);

        return response()->json([
            'message' => 'Hosting request created successfully.',
            'data' => $hostingRequest
        ], 201);
    }

    public function show($id)
    {
        $hostingRequest = HostingRequest::find($id);
        return response()->json([
            'message' => 'Retrieved successfully',
            'data' => $hostingRequest
        ]);
    }

    public function updateStatus(Request $request, $id)
    {

        $hostingRequest = HostingRequest::find($id);
        $hostingRequest->status = $request->status;
        $hostingRequest->save();

        if($request->status === 'accepted') {
            HostingRequest::where('host_id', $hostingRequest->host_id)
            ->where('id','!=',$id)
            ->update(['status' => 'rejected']);
        }

        return response()->json([
            'message' => 'Hosting request status updated successfully.',
            'data' => $hostingRequest
        ], 200);
    }

    public function destory($id)
    {
        $hostingRequest = HostingRequest::find($id);
        $hostingRequest->delete();

        return response()->json([
            'message' => 'Hosting request deleted successfully',
        ]);
    }
}
