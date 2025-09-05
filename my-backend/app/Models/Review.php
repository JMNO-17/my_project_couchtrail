<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reviewer_name',
        'reviewed_name',
        'type',
        'rating',
        'is_flagged',
        'comment',
        'reviewed_id'
    ];
}
