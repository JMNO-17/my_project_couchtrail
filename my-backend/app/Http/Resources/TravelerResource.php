<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // dd($this->user_id);
       $user = User::where('id', $this->user_id)->first();
        return [
            'user_id' => $this->user_id,
            'name' => $this->name,
            'location' => $this->location,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'trip_count' => $this->trip_count,
            'is_verified' => $this->is_verified,
            'id' => $this->id,
            'name' => $this->name,
            'email' => $user->email,
        ];
    }
}
