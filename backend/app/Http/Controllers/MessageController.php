<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        // Show messages involving the user (sent or received)
        $userId = Auth::id();
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            ...$validated,
            'sent_at' => now(),
        ]);

        return response()->json(['message' => 'Message sent', 'data' => $message], 201);
    }

    public function show($id)
    {
        $message = Message::with(['sender', 'receiver'])->find($id);
        if (!$message) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        $userId = Auth::id();
        if ($message->sender_id !== $userId && $message->receiver_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($message);
    }

    public function update(Request $request, $id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        if ($message->sender_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message->update($validated);

        return response()->json(['message' => 'Message updated', 'data' => $message]);
    }

    public function destroy($id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        if ($message->sender_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}
