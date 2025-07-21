<?php

namespace App\Http\Controllers;

use App\Models\MessageAttachment;
use Illuminate\Http\Request;

class MessageAttachmentController extends Controller
{
    public function index()
    {
        return MessageAttachment::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'message_id' => 'required|exists:messages,id',
            'name' => 'nullable|string',
            'path' => 'nullable|string',
            'mime' => 'nullable|string|max:100',
            'size' => 'nullable|integer',
        ]);

        $attachment = MessageAttachment::create($data);

        return response()->json($attachment, 201);
    }

    public function show($id)
    {
        return MessageAttachment::findOrFail($id);
    }

    public function destroy($id)
    {
        MessageAttachment::destroy($id);

        return response()->json(null, 204);
    }
}
