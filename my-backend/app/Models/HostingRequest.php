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


    public function traveler()
    {
        return $this->belongsTo(User::class, 'traveler_id');
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function hostEntry()
    {
        return $this->belongsTo(\App\Models\Host::class, 'host_entry_id');
    }
}
