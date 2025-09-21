<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Hidden attributes for JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
        'email_verified_at',
    ];

    /**
     * JWT identifier
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT custom claims
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * User has many hosting listings (as host)
     */
    public function listings()
    {
        return $this->hasMany(HostingListing::class, 'host_id');
    }

    /**
     * User has one traveler profile
     */
    public function traveler()
    {
        return $this->hasOne(Traveler::class, 'user_id');
    }


    public function homeImages()
    {
        return $this->hasMany(HomeImages::class);
    }

    public function hostEntry()
    {
        return $this->hasOne(HostingRequest::class,'host_id');
    }
}
