<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'reviewer_id',
        'reviewed_id',
        'type',
        'rating',
        'comment',
        'date',
        'is_flagged',
    ];

    protected $casts = [
        'date' => 'datetime',
        'is_flagged' => 'boolean',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewed()
    {
        return $this->belongsTo(User::class, 'reviewed_id');
    }
}
