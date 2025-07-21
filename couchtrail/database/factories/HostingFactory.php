<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HostingFactory extends Factory
{
    protected $model = \App\Models\Hosting::class;

    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'home_description' => $this->faker->sentence(),
            'address' => $this->faker->address(),
            'preferences' => $this->faker->paragraph(),
            'details' => $this->faker->paragraph(),
            'additional_info' => $this->faker->paragraph(),
            'availability_calendar' => json_encode([]),
        ];
    }
}
