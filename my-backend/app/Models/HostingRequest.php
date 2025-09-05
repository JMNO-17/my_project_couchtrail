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
        'host_entry_id',
        'location',
        'date',
        'message',
        'status',
        'is_suspicious',
    ];

    /**
     * Get the traveler (user who made the request).
     */
    public function traveler()
    {
        return $this->belongsTo(User::class, 'traveler_id');
    }

    /**
     * Get the host (user receiving the request).
     */
    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    /**
     * Get the host entry details from hosts table.
     */
    public function hostEntry()
    {
        return $this->belongsTo(Host::class, 'host_entry_id');
    }
}
