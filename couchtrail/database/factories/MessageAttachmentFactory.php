<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MessageAttachmentFactory extends Factory
{
    protected $model = \App\Models\MessageAttachment::class;

    public function definition()
    {
        return [
            'message_id' => \App\Models\Message::factory(),
            'name' => $this->faker->word() . '.jpg',
            'path' => $this->faker->imageUrl(),
            'mime' => 'image/jpeg',
            'size' => $this->faker->numberBetween(1000, 500000),
        ];
    }
}
