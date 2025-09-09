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

            // Relation with users (hosts)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Listing details
            $table->string('address');
            $table->text('home_description');
            $table->integer('max_guests')->default(1);
            $table->text('amenities')->nullable();
            $table->text('additional_details')->nullable();
            $table->boolean('is_available')->default(true);

            $table->timestamps();
        });

        // Hosting images table for multiple pictures per listing
        Schema::create('hosting_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hosting_listing_id')->constrained('hosting_listings')->onDelete('cascade');
            $table->string('image_path'); // store image path (storage/app/public/...)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hosting_images');
        Schema::dropIfExists('hosting_listings');
    }
};
