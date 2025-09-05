<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained('messages')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('path');
            $table->string('mime', 100)->nullable();
            $table->integer('size')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('message_attachments');
    }
};
