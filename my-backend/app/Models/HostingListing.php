<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostingListing extends Model
{
    use HasFactory;

    protected $table = 'hosting_listings';

    // ✅ Corrected: replaced 'host_name' with 'host_id'
    protected $fillable = [
        'host_id',
        'address',
        'home_description',
        'max_guests',
        'amenities',
        'additional_details',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function host()
{
    return $this->belongsTo(Host::class, 'host_id');
}

}
