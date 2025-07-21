<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hostings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('home_description')->nullable();
            $table->string('address')->nullable();
            $table->text('preferences')->nullable();
            $table->text('details')->nullable();
            $table->text('additional_info')->nullable();
            $table->text('availability_calendar')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hostings');
    }
};
