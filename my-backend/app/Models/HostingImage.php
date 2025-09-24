<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostingImage extends Model
{
    use HasFactory;

    // host_listing->hostingImage

    // select * from hosting_image where 'hosting_listing_id '= 1
    protected $fillable = [
        'hosting_listing_id',
        'image_path',
    ];

    /**
     * Relation to HostingListing
     */
    public function listing()
    {
        return $this->belongsTo(HostingListing::class, 'hosting_listing_id');
    }
}
