<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeImages extends Model
{
     use HasFactory;

    protected $fillable = [
        'image_path',
        'hosting_listing_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hostingListing()
    {
        return $this->belongsTo(HostingListing::class);
    }
}
