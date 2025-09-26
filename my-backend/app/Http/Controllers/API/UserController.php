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
        // $user = User::select('id', 'name', 'email', 'avatar', 'role', 'created_at')->find($id);
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $hostlistings = HostingListing::where('user_id',$user->id)->first();

        $hostimage = HostingImage::where('hosting_listing_id',$hostlistings->id)->first();

        $user->image = $hostimage
            ? asset('storage/' . $hostimage->image_path)
            : null;;

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
