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
        $listings = HostingListing::with('images')->where('host_id', $userId)->get();
        return response()->json($listings);
    }

    public function show($id)
    {
        $userId = auth()->guard('api')->id();
        $listing = HostingListing::with('images')->find($id);

        if (!$listing) {
            return response()->json(['error' => 'HostingListing Not Found'], 404);
        }

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($listing);
    }


    public function store(StoreHostingListingRequest $request)
    {
        $userId = auth()->guard('api')->id();

        $validatedData = $request->validated();

        $listing = $this->repository->create($validatedData, $userId);

        if ($request->hasFile('images')) {
            $imageName = time() . '.' . $request->images->extension();
            $request->images->move(public_path('userImage'), $imageName);
            $validatedData = array_merge($validatedData, ['image' => $imageName]);
        }
        
        HostingImage::create([
            'hosting_listing_id' => $listing->id,
            'path' => $imageName
        ]);

        $listing->load('images');

        return response()->json($listing->load('images'), 201);
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

        if ($listing->host_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted']);
    }
}
