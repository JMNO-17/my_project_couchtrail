<?php

namespace App\Http\Controllers\API;

use App\Models\HostingImage;
use Illuminate\Http\Request;
use App\Models\HostingListing;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Support\ValidatedData;
use App\Http\Requests\StoreHostingListingRequest;
use App\Http\Requests\UpdateHostingListingRequest;
use App\Repositories\HostListings\HostingListingRepository;

class HostingListingController extends Controller
{
    protected $repository;

    public function __construct(HostingListingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        $userId = auth()->guard('api')->id();
        $listings = HostingListing::with('hostImage')->where('user_id', $userId)->get();
        return response()->json($listings);
    }

    public function show($id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::with('hostImage')->find($id);

        if (!$listing) {
            return response()->json(['error' => 'HostingListing Not Found'], 404);
        }

        // if ($listing->host_id !== $userId) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        return response()->json($listing);
    }


    public function store(StoreHostingListingRequest $request)
    {
        $userId = auth()->guard('api')->id();

        $validatedData = $request->validated();

        $listing = $this->repository->create($validatedData, $userId);

        if ($request->hasFile('profile_image')) {
            $imageName = time() . '.' . $request->profile_image->extension();
            $request->profile_image->move(public_path('userImage'), $imageName);
            $validatedData = array_merge($validatedData, ['profile_image' => $imageName]);
        }

        HostingImage::create([
            'hosting_listing_id' => $listing->id,
            'image_path' => $imageName
        ]);

        $listing->load('hostImage');

        return response()->json($listing->load('hostImage'), 201);
    }

    public function update(UpdateHostingListingRequest $request, $id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::findOrFail($id);

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $updated = $this->repository->update($listing, $request->all());

        return response()->json($updated);
    }

    public function destroy($id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::findOrFail($id);

        $listing->delete();
        
        return response()->json(['message' => 'Listing deleted']);
    }

public function getHostingByUserId($id) {
    $host = HostingListing::where('user_id', $id)
                ->first();

    if (!$host) {
        return response()->json(['error' => 'Hosting listing not found'], 404);
    }

    // Add full URL for host profile image
    $host->hostImage_url = $host->hostImage
        ? asset('storage/' . $host->hostImage->image_path)
        : null;

    // Add full URLs for home images
    $host->homeImages_urls = $host->homeImages->map(function($img) {
        return asset('storage/' . $img->image_path);
    })->toArray();

    return response()->json($host);
}

}
