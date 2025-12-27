<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HostingImage;
use App\Models\HostingListing;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return response()->json(User::all());
    }

    // GET /api/users/{id}
  public function show($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Get the user's (first) hosting listing
    $listing = HostingListing::where('user_id', $user->id)->first();

    // Collect all images for that listing as full URLs
    $images = [];
    if ($listing) {
        $images = HostingImage::where('hosting_listing_id', $listing->id)
            ->get()
            ->map(fn ($img) => asset('storage/' . ltrim($img->image_path, '/')))
            ->values()
            ->all();
    }

    // Always return an array
    $user->images = $images;

    // (Optional) keep legacy single image for existing frontends
    $user->image = $images[0] ?? null;

    return response()->json($user);
}

    // PATCH /api/users/{id}/toggle-active
    public function toggleActive($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->isActive = !$user->isActive;
    $user->save();

    return response()->json($user);
}


    // DELETE /api/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
