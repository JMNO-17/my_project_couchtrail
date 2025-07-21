<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HostingRequest extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'traveler_id',
        'host_id',
        'location',
        'message',
        'date',
        'status',
        'is_suspicious',
        'created_at',
    ];

    protected $casts = [
        'date' => 'date',
        'is_suspicious' => 'boolean',
        'created_at' => 'datetime',
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
