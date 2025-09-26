<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\HomeImages;
use Illuminate\Support\Str;
use App\Models\HostingImage;
use Illuminate\Http\Request;
use App\Models\HostingListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
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


    // public function store(StoreHostingListingRequest $request)
    // {
    //     $userId = auth()->guard('api')->id();

    //     $validatedData = $request->validated();

    //     $listing = $this->repository->create($validatedData, $userId);

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

// public function store(StoreHostingListingRequest $request)
// {
//     $userId = auth()->guard('api')->id();
//     $validatedData = $request->validated();

//     // Create the listing first
//     $listing = $this->repository->create($validatedData, $userId);

//     // Handle optional single profile image upload
//     if ($request->hasFile('profile_image')) {
//         $file = $request->file('profile_image');

//         // Put images in a per-listing folder
//         $folder   = "hosting_listings/{$listing->id}/profile";
//         $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();

//         // Save to the public disk so it’s web-accessible
//         // This creates: storage/app/public/hosting_listings/{id}/profile/{uuid}.ext
//         $path = $file->storeAs($folder, $filename, 'public');

//         // Persist the relative storage path in DB (NOT a full URL)
//         HostingImage::create([
//             'hosting_listing_id' => $listing->id,
//             'image_path'         => $path, // e.g. hosting_listings/12/profile/xxx.jpg
//         ]);

//         // (Optional) if your listings table has a profile_image column, store the same path:
//         // $listing->update(['profile_image' => $path]);
//     }

//     // Return with related images loaded
//     $listing->load('hostImage');

//     // (Optional) if you want to also include absolute URLs in the response:
//     // $listing->hostImage->each(function ($img) {
//     //     $img->image_url = Storage::url($img->image_path); // e.g. /storage/hosting_listings/...
//     // });

//     return response()->json($listing, 201);
// }
  // home images table

public function store(StoreHostingListingRequest $request)
{
    $userId = auth()->guard('api')->id();
    $user   = User::findOrFail($userId);

    if ($user->role !== 'host') {
        $user->role = 'host';
        $user->save();
    }

    return DB::transaction(function () use ($request, $userId) {
        $validatedData = $request->validated();

        // 1) create listing
        $listing = $this->repository->create($validatedData, $userId);

        // ---- de-dup guard within the same request
        $seen = [];

        // 2) HOST PROFILE IMAGE(S)  --> public/hostImage/{uuid}.ext
        $profileFiles = [];
        if ($request->hasFile('profile_images')) {
            $profileFiles = $request->file('profile_images');       // array
        } elseif ($request->hasFile('profile_image')) {
            $profileFiles = [$request->file('profile_image')];      // single -> array
        }

        foreach ($profileFiles as $file) {
            if (!$file || !$file->isValid()) continue;

            $hash = hash_file('sha256', $file->getRealPath());
            if (isset($seen[$hash])) continue;
            $seen[$hash] = true;

            $folder   = 'hostImage'; // << host profile image folder
            $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
            $path     = $file->storeAs($folder, $filename, 'public'); // storage/app/public/hostImage/...

            HostingImage::create([
                'hosting_listing_id' => $listing->id,
                'image_path'         => $path, // keep relative path like "hostImage/xxxx.jpg"
            ]);
        }

        // 3) HOME IMAGES (ARRAY) --> public/homeImages/{listing_id}/{uuid}.ext
        $homeFiles = $request->file('home_images', []); // must be array per your rules
        foreach ($homeFiles as $file) {
            if (!$file || !$file->isValid()) continue;

            $hash = hash_file('sha256', $file->getRealPath());
            if (isset($seen[$hash])) continue;
            $seen[$hash] = true;

            $folder   = "homeImages/{$listing->id}"; // << home images folder
            $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
            $path     = $file->storeAs($folder, $filename, 'public'); // storage/app/public/homeImages/{listing}/...

            HomeImages::create([
                'hosting_listing_id' => $listing->id,
                'image_path'         => $path,
            ]);
        }

        // 4) return with relations + absolute URLs
        $listing->load(['hostImage', 'homeImages']);

        $listing->host_profile_image_url = optional($listing->hostImage)->image_path
            ? asset('storage/'.ltrim($listing->hostImage->image_path, '/'))
            : null;

        $listing->home_images_urls = $listing->homeImages->map(
            fn ($img) => asset('storage/'.ltrim($img->image_path, '/'))
        )->values();

        return response()->json($listing, 201);
    });
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

        $user = User::find($userId);

        $user->role = 'user';

        $user->save();

        return response()->json(['message' => 'Listing deleted']);
    }

// public function getHostingByUserId($id) {
//     $host = HostingListing::where('user_id', $id)
//                 ->first();

//     if (!$host) {
//         return response()->json(['error' => 'Hosting listing not found'], 404);
//     }

//     // Add full URL for host profile image
//     $host->hostImage_url = $host->hostImage
//         ? asset('storage/' . $host->hostImage->image_path)
//         : null;

//     // Add full URLs for home images
//     $host->homeImages_urls = $host->homeImages->map(function($img) {
//         return asset('storage/' . $img->image_path);
//     })->toArray();

//     return response()->json($host);
// }


// public function getHostingByUserId($id)
// {
//     $host = HostingListing::with(['hostImage', 'homeImages'])
//         ->where('user_id', $id)
//         ->first();

//     if (!$host) {
//         return response()->json(['error' => 'Hosting listing not found'], 404);
//     }

//     // Build URLs safely
//     $hostProfileUrl = $host->hostImage
//         ? Storage::url(ltrim($host->hostImage->image_path, '/'))
//         : null;

//     $homeUrls = $host->homeImages
//         ? $host->homeImages
//             ->map(fn ($img) => Storage::url(ltrim($img->image_path, '/')))
//             ->values()
//             ->all()
//         : [];

//     // Return the listing plus computed URLs
//     $payload = $host->toArray();
//     $payload['host_profile_image_url'] = $hostProfileUrl;
//     $payload['home_image_urls'] = $homeUrls;

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

    // Single profile image (HostingImage)
    $hostProfileUrl = $host->hostImage
        ? Storage::url(ltrim($host->hostImage->image_path, '/'))
        : null;

    // Home images (HomeImage hasMany)
    $homeImages = $host->homeImages
        ->map(function ($img) {
            return [
                'id'         => $img->id,
                'image_path' => $img->image_path,                       // relative
                'image_url'  => Storage::url(ltrim($img->image_path, '/')), // public URL
            ];
        })
        ->values()
        ->all();

    $payload = $host->toArray();
    $payload['host_profile_image_url'] = $hostProfileUrl;
    $payload['home_images']            = $homeImages;
    $payload['home_image_urls']        = array_column($homeImages, 'image_url');

    return response()->json($payload);
}


// public function toggle($id)
// {
//     $hostinglisting = HostingListing::find($id);

//     if($hostinglisting->is_available == 1)
//     {
//         $hostinglisting->is_available = 0;
//     }
//     else
//     {
//          $hostinglisting->is_available = 1;
//     }

//     $hostinglisting->save();

//     return $hostinglisting;
// }

public function toggle($id): JsonResponse
    {
        $listing = HostingListing::find($id);
        if (!$listing) {
            return response()->json([
                'success' => 0,
                'message' => 'Listing not found',
            ], 404);
        }

        // flip
        $listing->is_available = $listing->is_available ? 0 : 1;
        $listing->save();

        // return normalized payload
        return response()->json([
            'success' => 1,
            'data'    => [
                'id'            => $listing->id,
                'is_available'  => (bool) $listing->is_available,
            ],
        ]);
    }

}
