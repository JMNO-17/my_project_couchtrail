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
        'rating',
        'comment',
        'is_flagged',
    ];

    protected $appends = ['date'];

    // Reviewer relationship
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    // Reviewed relationship
    public function reviewed()
    {
        return $this->belongsTo(User::class, 'reviewed_id');
    }

    // Accessor for date
    public function getDateAttribute()
    {
        return $this->created_at;
    }
}
