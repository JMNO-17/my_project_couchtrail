<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return Message::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id|different:sender_id',
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string',
        ]);

        $msg = Message::create($data);

        return response()->json($msg, 201);
    }

    public function show($id)
    {
        return Message::findOrFail($id);
    }

    public function destroy($id)
    {
        Message::destroy($id);

        return response()->json(null, 204);
    }
}
