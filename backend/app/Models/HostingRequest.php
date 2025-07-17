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
        'location',
        'message',
        'date',
        'status',
        'is_suspicious',
    ];

    protected $casts = [
        'date' => 'date',
        'is_suspicious' => 'boolean',
    ];

    public function traveler()
    {
        return $this->belongsTo(User::class, 'traveler_id');
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }
}
