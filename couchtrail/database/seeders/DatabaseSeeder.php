<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\Hosting;
use App\Models\HostingRequest;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(10)->create()->each(function ($user) {
            Hosting::factory()->create(['user_id' => $user->id]);
        });

        Conversation::factory(5)->create()->each(function ($conversation) {
            Message::factory(3)->create(['conversation_id' => $conversation->id]);
        });

        MessageAttachment::factory(10)->create();

        HostingRequest::factory(10)->create();

        Review::factory(10)->create();
    }
}
