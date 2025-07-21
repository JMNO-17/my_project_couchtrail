<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = \App\Models\Review::class;

    public function definition()
    {
        return [
            'reviewer_id' => \App\Models\User::factory(),
            'reviewed_id' => \App\Models\User::factory(),
            'type' => $this->faker->randomElement(['host', 'traveler']),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'date' => now(),
            'is_flagged' => false,
        ];
    }
}
