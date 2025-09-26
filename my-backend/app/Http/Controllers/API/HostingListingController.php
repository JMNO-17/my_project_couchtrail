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

<<<<<<< Updated upstream

    public function store(StoreHostingListingRequest $request)
    {
        $userId = auth()->guard('api')->id();
=======
    // public function store(StoreHostingListingRequest $request)
    // {
    //     $userId = auth()->guard('api')->id();
>>>>>>> Stashed changes

        $validatedData = $request->validated();

        $listing = $this->repository->create($validatedData, $userId);

<<<<<<< Updated upstream
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
=======
    //     if ($request->hasFile('profile_image')) {
    //         $imageName = time() . '.' . $request->profile_image->extension();
    //         $request->profile_image->move(public_path('userImage'), $imageName);
    //         $validatedData = array_merge($validatedData, ['profile_image' => $imageName]);
    //     }

    //     HostingImage::create([
    //         'hosting_listing_id' => $listing->id,
    //         'image_path' => $imageName
    //     ]);

    //     $listing->load('hostImage');

    //     return response()->json($listing->load('hostImage'), 201);
    // }

public function store(StoreHostingListingRequest $request)
{
    $userId = auth()->guard('api')->id();
    $validatedData = $request->validated();

    // Create the listing first
    $listing = $this->repository->create($validatedData, $userId);

    $imageName = time(). '.' . $request->image->extension();
        $request->image->move(public_path('productImage'), $imageName);
        $validatedData = array_merge($validatedData, ['image'=>$imageName]);

    // Handle optional single profile image upload
    // if ($request->hasFile('profile_image')) {
    //     $file = $request->file('profile_image');

    //     // Put images in a per-listing folder
    //     $folder  = "hosting_listings/{$listing->id}/profile";
    //     $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();

    //     // Save to the public disk so it’s web-accessible
    //     // This creates: storage/app/public/hosting_listings/{id}/profile/{uuid}.ext
    //     $path = $file->storeAs($folder, $filename, 'public');

    //     // Persist the relative storage path in DB (NOT a full URL)
    //     HostingImage::create([
    //         'hosting_listing_id' => $listing->id,
    //         'image_path'         => $path, // e.g. hosting_listings/12/profile/xxx.jpg
    //     ]);

    //     // (Optional) if your listings table has a profile_image column, store the same path:
    //     // $listing->update(['profile_image' => $path]);
    // }

    $listing->load('hostImage');

    return response()->json($listing, 201);
}
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======


// public function getHostingByUserId($id)
// {
//     $host = HostingListing::with(['hostImage', 'homeImages'])
//         ->where('user_id', $id)
//         ->first();

//     if (!$host) {
//         return response()->json(['error' => 'Hosting listing not found'], 404);
//     }

//     // Single profile image (HostingImage)
//     $hostProfileUrl = $host->hostImage
//         ? Storage::url(ltrim($host->hostImage->image_path, '/'))
//         : null;

//     // Home images (HomeImage hasMany)
//     $homeImages = $host->homeImages
//         ->map(function ($img) {
//             return [
//                 'id'         => $img->id,
//                 'image_path' => $img->image_path,                       // relative
//                 'image_url'  => Storage::url(ltrim($img->image_path, '/')), // public URL
//             ];
//         })
//         ->values()
//         ->all();

//     $payload = $host->toArray();
//     $payload['host_profile_image_url'] = $hostProfileUrl;
//     $payload['home_images']            = $homeImages;
//     $payload['home_image_urls']        = array_column($homeImages, 'image_url');

//     return response()->json($payload);
// }
public function getHostingByUserId($id)
{
    $host = HostingListing::with(['hostImage', 'homeImages'])
        ->where('user_id', $id)
        ->first();

    if (!$host) {
        return response()->json(['error' => 'Hosting listing not found'], 404);
    }

    // Single profile image
    $hostProfileUrl = $host->hostImage
        ? Storage::url($host->hostImage->image_path)
        : null;

    // Home images
    $homeImages = $host->homeImages->map(function ($img) {
        return [
            'id'         => $img->id,
            'image_path' => $img->image_path,
            'image_url'  => Storage::url($img->image_path),
        ];
    })->values()->all();

    return response()->json([
        'id'                     => $host->id,
        'title'                  => $host->title, // or other listing fields
        'description'            => $host->description,
        'price'                  => $host->price,
        'host_profile_image_url' => $hostProfileUrl,
        'home_images'            => $homeImages,
    ]);
}



>>>>>>> Stashed changes
}
