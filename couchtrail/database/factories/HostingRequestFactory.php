<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HostingRequestFactory extends Factory
{
    protected $model = \App\Models\HostingRequest::class;

    public function definition()
    {
        return [
            'traveler_id' => \App\Models\User::factory(),
            'host_id' => \App\Models\User::factory(),
            'location' => $this->faker->city(),
            'message' => $this->faker->sentence(),
            'date' => $this->faker->date(),
            'status' => 'pending',
            'is_suspicious' => false,
            'created_at' => now(),
        ];
    }
}
