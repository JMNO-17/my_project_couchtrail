<?php

namespace App\Http\Controllers\API;

use App\Models\HostingImage;
use Illuminate\Http\Request;
use App\Models\HostingListing;
use App\Http\Controllers\Controller;
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

        // Add full URL for profile image
        $listings->each(function($listing) {
            $listing->hostImage_url = $listing->hostImage
                ? asset('storage/' . $listing->hostImage->image_path)
                : null;
        });

        return response()->json($listings);
    }

    public function store(StoreHostingListingRequest $request)
    {
        $userId = auth()->guard('api')->id();
        $validatedData = $request->validated();

        $listing = $this->repository->create($validatedData, $userId);

        if ($request->hasFile('profile_image')) {
            $imageName = time() . '.' . $request->profile_image->extension();
            $request->profile_image->storeAs('public/hostImage', $imageName);

            HostingImage::create([
                'hosting_listing_id' => $listing->id,
                'image_path' => 'hostImage/' . $imageName
            ]);
        }

        $listing->load('hostImage');
        $listing->hostImage_url = $listing->hostImage
            ? asset('storage/' . $listing->hostImage->image_path)
            : null;

        return response()->json($listing, 201);
    }

    public function getHostingByUserId($id)
    {
        $host = HostingListing::with(['hostImage', 'homeImages'])->where('user_id', $id)->first();

        if (!$host) {
            return response()->json(['error' => 'Hosting listing not found'], 404);
        }

        $host->hostImage_url = $host->hostImage
            ? asset('storage/' . $host->hostImage->image_path)
            : null;

        $host->homeImages_urls = $host->homeImages->map(fn($img) => asset('storage/' . $img->image_path))->toArray();

        return response()->json($host);
    }
}
