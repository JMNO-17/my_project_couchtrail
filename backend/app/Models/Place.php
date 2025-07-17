<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'location',
        'description',
        'images',
        'popular',
    ];

    protected $casts = [
        'popular' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
