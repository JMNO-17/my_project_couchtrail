<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hosting_listings', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('host_id');

            // Hosting info
            $table->string('address');
            $table->text('home_description');
            $table->integer('max_guests');
            $table->text('amenities');
            $table->text('additional_details')->nullable();
            $table->boolean('is_available')->default(true);

            $table->timestamps();
            // $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });



    }

    public function down(): void
    {
        Schema::dropIfExists('hosting_listings');
    }
};
