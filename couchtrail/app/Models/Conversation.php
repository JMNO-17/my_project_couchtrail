<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['user1_id', 'user2_id', 'created_at'];

    // User1 relation
    public function user1()
    {
        return $this->belongsTo(User::class, 'user1_id');
    }

    // User2 relation
    public function user2()
    {
        return $this->belongsTo(User::class, 'user2_id');
    }

    // Messages in this conversation
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

