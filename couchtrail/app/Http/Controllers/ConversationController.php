<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index()
    {
        return Conversation::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user1_id' => 'required|exists:users,id',
            'user2_id' => 'required|exists:users,id|different:user1_id',
        ]);

        $conversation = Conversation::create($data);

        return response()->json($conversation, 201);
    }

    public function show($id)
    {
        return Conversation::with('messages')->findOrFail($id);
    }

    public function destroy($id)
    {
        Conversation::destroy($id);

        return response()->json(null, 204);
    }
}
