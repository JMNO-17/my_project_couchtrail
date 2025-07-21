<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    public $timestamps = false;

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
        'rating' => 'integer',
        'is_flagged' => 'boolean',
        'date' => 'datetime',
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
