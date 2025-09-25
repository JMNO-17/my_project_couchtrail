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

    public function getTravelerByUserId($id)
{
    $traveler = Traveler::where('user_id', $id)->first();

    if (!$traveler) {
        return response()->json([
            'success' => 0,
            'data' => [],
            'message' => 'No traveler found for this user.'
        ]);
    }

    $hostingRequest = HostingRequest::with('traveler')
        ->where('traveler_id', $traveler->id)
        ->get();
    $result = [];
        foreach($hostingRequest as $request) {
            $hostData = HostingListing::where('user_id',$request->host_id)->first();
            $result[] = $hostData;
        }


    return response()->json([
        'success' => 1,
        'data' => $hostingRequest
    ]);
}


public function getTravelerByUid($id)
{
    return Traveler::where('user_id', $id)->first();
}

}



