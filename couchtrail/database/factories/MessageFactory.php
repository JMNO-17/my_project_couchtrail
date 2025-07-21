<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = \App\Models\Message::class;

    public function definition()
    {
        return [
            'sender_id' => \App\Models\User::factory(),
            'receiver_id' => \App\Models\User::factory(),
            'conversation_id' => \App\Models\Conversation::factory(),
            'message' => $this->faker->paragraph(),
            'sent_at' => now(),
        ];
    }
}
