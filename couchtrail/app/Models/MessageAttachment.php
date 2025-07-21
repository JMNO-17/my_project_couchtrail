<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MessageAttachment extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['message_id', 'name', 'path', 'mime', 'size'];

    // Related message
    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
