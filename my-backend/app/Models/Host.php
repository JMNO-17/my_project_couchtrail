<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'location',
        'avatar',
        'rating',
        'review_count',
        'description',
        'home_description',
        'additional_details',
        'max_guests',
        'amenities',
        'is_verified',
        'response_time',
        'is_available'
    ];

    protected $casts = [
        'amenities' => 'array',
        'is_verified' => 'boolean',
        'is_available' => 'boolean'
    ];

    public function user()
{
    return $this->belongsTo(\App\Models\User::class);
}


    public function listings()
{
    return $this->hasMany(HostingListing::class, 'host_id');
}



    public function hostingRequests()
    {
        return $this->hasMany(\App\Models\HostingRequest::class, 'host_entry_id');
    }
}
