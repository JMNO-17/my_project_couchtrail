<?php

namespace App\Http\Resources;

use App\Models\Traveler;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostingRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $traveler = Traveler::find($this->traveler_id);
        return [
            'id' => $this->id,
            'traveler_id' => $this->traveler_id,
            'host_id' => $this->host_id,
            'user_id' => $this->user_id,
            'name' => $traveler->name,
            'location' => $this->location,
            'date' => $this->date,
            'message' => $this->message,
            'number_of_guests' => $this->number_of_guests,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
