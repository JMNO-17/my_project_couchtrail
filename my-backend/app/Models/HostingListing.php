<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostingListing extends Model
{
    use HasFactory;

    protected $table = 'hosting_listings';

    protected $fillable = [
        'user_id',
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

    // Relation with User
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    // Relation with HomeImages (multiple images of property)
    public function homeImages()
    {
        return $this->hasMany(HomeImages::class, 'hosting_listing_id');
    }


    public function hostImage()
{
    return $this->hasOne(HostingImage::class, 'hosting_listing_id');
}

}
