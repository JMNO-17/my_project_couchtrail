<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'traveler_id',
        'host_id',
        // 'host_entry_id',
        'user_id',
        'location',
        'date',
        'message',
        'number_of_guests',
        // 'status',
        // 'is_suspicious',
    ];

    protected $casts = [
        // 'is_suspicious' => 'boolean',
        'date' => 'date',
    ];

    /**
     * The traveler (user who made the request)
     */
    // public function traveler()
    // {
    //     return $this->belongsTo(\App\Models\User::class, 'traveler_id');
    // }

    // public function user()
    // {
    //     return $this->belongsTo(User::class,'user_id');
    // }

    /**
     * The host (user receiving the request)
     */
    public function host()
    {
        return $this->belongsTo(\App\Models\User::class, 'host_id');
    }

    /**
     * The host entry details from hosts table
     */
    public function hostEntry()
    {
        return $this->belongsTo(\App\Models\Host::class, 'traveler_id');
    }
}
