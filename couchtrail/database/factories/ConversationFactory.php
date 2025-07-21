<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = \App\Models\Conversation::class;

    public function definition()
    {
        return [
            'user1_id' => \App\Models\User::factory(),
            'user2_id' => \App\Models\User::factory(),
            'created_at' => now(),
        ];
    }
}
