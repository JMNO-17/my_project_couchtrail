<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// Import related models for relationships
use App\Models\Hosting;
use App\Models\HostingRequest;
use App\Models\Message;
use App\Models\Place;
use App\Models\Review;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Mass assignable fields
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image',
        'region',
        'is_verified',
        'role',
    ];

    // Hidden fields for serialization
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Cast fields to native types
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_verified' => 'boolean',
    ];

    // Relationships

    public function hostings()
    {
        return $this->hasOne(Hosting::class);
    }

    public function hostingRequestsSent()
    {
        return $this->hasMany(HostingRequest::class, 'traveler_id');
    }

    public function hostingRequestsReceived()
    {
        return $this->hasMany(HostingRequest::class, 'host_id');
    }

    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function places()
    {
        return $this->hasMany(Place::class);
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'reviewed_id');
    }
}
