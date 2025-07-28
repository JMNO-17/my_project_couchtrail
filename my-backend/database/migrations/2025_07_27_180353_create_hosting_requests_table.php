<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hosting_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('traveler_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('host_entry_id')->constrained('hosts')->onDelete('cascade'); // ✅ New
            $table->string('location');
            $table->date('date');
            $table->text('message');
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->boolean('is_suspicious')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hosting_requests');
    }
};
