<?php

namespace App\Http\Controllers;

use App\Models\Hosting;
use Illuminate\Http\Request;

class HostingController extends Controller
{
    public function index()
    {
        return Hosting::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'home_description' => 'nullable|string',
            'address' => 'nullable|string',
            'preferences' => 'nullable|string',
            'details' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'availability_calendar' => 'nullable|string',
        ]);

        $hosting = Hosting::create($data);

        return response()->json($hosting, 201);
    }

    public function show($id)
    {
        return Hosting::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $hosting = Hosting::findOrFail($id);

        $data = $request->validate([
            'home_description' => 'nullable|string',
            'address' => 'nullable|string',
            'preferences' => 'nullable|string',
            'details' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'availability_calendar' => 'nullable|string',
        ]);

        $hosting->update($data);

        return response()->json($hosting);
    }

    public function destroy($id)
    {
        Hosting::destroy($id);

        return response()->json(null, 204);
    }
}
