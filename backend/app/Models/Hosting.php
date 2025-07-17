<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'home_description',
        'address',
        'preferences',
        'details',
        'additional_info',
        'availability_calendar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
