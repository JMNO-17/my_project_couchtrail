<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['sender_id', 'receiver_id', 'conversation_id', 'message', 'sent_at'];

    // Sender user
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Receiver user
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    // Conversation
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // Attachments
    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
