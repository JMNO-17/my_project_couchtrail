<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory; // ✅ Add this
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory; // ✅ Enable factory support
    use Notifiable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Hide these fields in JSON output.
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'email_verified_at',

        'password',
        'remember_token',
    ];

    /**
     * JWT - Return identifier.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT - Return custom claims.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function listings()
{
    return $this->hasMany(HostingListing::class, 'host_id');
}

}
