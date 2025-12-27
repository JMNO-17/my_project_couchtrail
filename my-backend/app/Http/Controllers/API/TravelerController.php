<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\TravelerResource;
use App\Models\HostingListing;
use App\Models\HostingRequest;
use Illuminate\Http\Request;
use App\Models\Traveler;
use App\Models\User;
use App\Http\Resources\HostingRequestResource;

class TravelerController extends Controller
{
    public function index()
    {
        $usersInHostListing = HostingListing::pluck('user_id');
        $userId = auth()->guard('api')->id();
        $traveler = Traveler::whereNotIn("user_id", $usersInHostListing)->where('user_id','!=', $userId)->get();
            foreach($traveler as $t) {
                $user = User::where("id",$t->user_id)->first();

                $t->email = $user->email;
            }

        return $traveler;

    }

    public function show($id)
    {
        $traveler = Traveler::where('user_id', $id)->first();

        $user = User::where("id",$traveler->id)->first();

        $traveler->email = $user->email;

        return $traveler;
    }

//     public function show($id)
// {
//     // $id here is a USER ID
//     $traveler = Traveler::where('user_id', $id)->first();

//     if (!$traveler) {
//         return response()->json(['message' => 'Traveler not found'], 404);
//     }

//     // FIX: use $traveler->user_id (not $traveler->id)
//     $user = User::where("id", $traveler->user_id)->first();

//     // In case user could not be found (unlikely if FK ok)
//     if ($user) {
//         $traveler->email = $user->email;
//     }

//     return $traveler;
// }


    public function store(Request $request)
    {
        $user = auth()->guard('api')->user();

        $traveler = Traveler::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'location' => $request->location ?? '',
            'avatar' => $request->avatar ?? '',
            'bio' => $request->bio ?? '',
            'trip_count' => 0,
            'is_verified' => false,
        ]);

        return response()->json($traveler, 201);
    }

    // public function getTravelerByUserId($id)
    // {
    //     $traveler = Traveler::where('user_id', $id)->first();

    //     $hostingRequest = HostingRequest::where('traveler_id', $traveler->id)->get();

    //     return HostingRequestResource::collection($hostingRequest);
    // }

//     public function getTravelerByUserId($id)
// {
//     $traveler = Traveler::where('user_id', $id)->first();

//     if (!$traveler) {
//         return response()->json([
//             'success' => 0,
//             'data' => [],
//             'message' => 'No traveler found for this user.'
//         ]);
//     }

//     $hostingRequest = HostingRequest::with('traveler')
//         ->where('traveler_id', $traveler->id)
//         ->get();

//     $result = [];
//         foreach($hostingRequest as $request) {
//             $hostData = HostingListing::where('user_id',$request->host_id)->first();
//             $user = User::find($request->host_id)->first();
//             // dd($user->name);
//             $request['name'] = $user->name;
//             $result[] = $hostData;
//         }


//     return response()->json([
//         'success' => 1,
//         'data' => $hostingRequest
//     ]);
// }

// public function getTravelerByUserId($id)
// {
//     // 1) Find the traveler by user_id
//     $traveler = Traveler::where('user_id', $id)->first();

//     if (!$traveler) {
//         return response()->json([
//             'success' => 0,
//             'data'    => [],
//             'message' => 'No traveler found for this user.',
//         ]);
//     }

//     // 2) Get the most recent hosting request for this traveler
//     $request = HostingRequest::where('traveler_id', $traveler->id)
//         ->orderByDesc('created_at')
//         ->first();

//     if (!$request) {
//         return response()->json([
//             'success' => 0,
//             'data'    => [],
//             'message' => 'No hosting requests found for this traveler.',
//         ]);
//     }

//     // 3) Load the host (User) and their listing
//     $host    = User::find($request->host_id);              // no ->first()
//     $listing = HostingListing::where('user_id', $request->host_id)->first();

//     if (!$listing) {
//         return response()->json([
//             'success' => 0,
//             'data'    => [],
//             'message' => 'Host listing not found.',
//         ]);
//     }

//     // 4) Shape the payload EXACTLY like your example + host "name"
//     $data = [
//         'id'                 => $listing->id,
//         'user_id'            => $listing->user_id,
//         'address'            => $listing->address,
//         'home_description'   => $listing->home_description,
//         'max_guests'         => (int) $listing->max_guests,
//         'amenities'          => is_array($listing->amenities)
//                                 ? implode(',', $listing->amenities)
//                                 : (string) $listing->amenities,
//         'additional_details' => $listing->additional_details,
//         'is_available'       => (bool) $listing->is_available,
//         'created_at'         => $listing->created_at,
//         'updated_at'         => $listing->updated_at,
//         'name'               => $host?->name,   // host’s name
//     ];

//     return response()->json([
//         'success' => 1,
//         'data'    => $data,
//     ]);
// }

public function getTravelerByUserId($id)
{
    // 1) Find traveler by user_id
    $traveler = Traveler::where('user_id', $id)->first();

    if (!$traveler) {
        return response()->json([
            'success' => 0,
            'data'    => [],
            'message' => 'No traveler found for this user.',
        ]);
    }

    // 2) Get ALL hosting requests for this traveler (newest first)
    $requests = HostingRequest::where('traveler_id', $traveler->id)
        ->orderByDesc('created_at')
        ->get();

    if ($requests->isEmpty()) {
        return response()->json([
            'success' => 1,
            'data'    => [],
            'message' => 'No hosting requests found for this traveler.',
        ]);
    }

    // 3) Bulk-load hosts and their listings (avoid N+1)
    $hostIds = $requests->pluck('host_id')->unique()->values();

    $hostsById = User::whereIn('id', $hostIds)->get()->keyBy('id');

    $listingsByUserId = HostingListing::whereIn('user_id', $hostIds)
        ->get()
        ->keyBy('user_id');

    // 4) Build payload: one entry per request, shaped like your example
    $data = $requests->map(function ($req) use ($hostsById, $listingsByUserId) {
        $host    = $hostsById->get($req->host_id);
        $listing = $listingsByUserId->get($req->host_id);

        if (!$listing) {
            // If you prefer to SKIP requests without a listing, return null
            // and filter below. Otherwise, you could return a minimal stub.
            return null;
        }

        // amenities → ensure CSV string like "wifi,pool"
        $amenities = is_array($listing->amenities)
            ? implode(',', $listing->amenities)
            : (string) $listing->amenities;

        return [
            'id'                 => $listing->id,
            'user_id'            => $listing->user_id,
            'address'            => $listing->address,
            'home_description'   => $listing->home_description,
            'max_guests'         => (int) $listing->max_guests,
            'amenities'          => $amenities,
            'additional_details' => $listing->additional_details,
            'is_available'       => (bool) $listing->is_available,
            'created_at'         => $listing->created_at,
            'updated_at'         => $listing->updated_at,
            'name'               => $host?->name, // host name

            // (Optional, handy for UI)
            'request_id'         => $req->id,
            'request_status'     => $req->status,
            'request_message'    => $req->message,
            'requested_at'       => $req->created_at,
        ];
    })
    ->filter() // remove nulls if any listing missing
    ->values();

    return response()->json([
        'success' => 1,
        'data'    => $data,
        'count'   => $data->count(),
    ]);
}



public function getTravelerByUid($id)
{
    return Traveler::where('user_id', $id)->first();
}

}



