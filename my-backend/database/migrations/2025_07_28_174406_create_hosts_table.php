<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('hosts', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->string('location');
        $table->string('avatar')->nullable();
        $table->float('rating')->default(0);
        $table->integer('review_count')->default(0);
        $table->text('description');
        $table->text('home_description');
        $table->text('additional_details')->nullable();
        $table->integer('max_guests')->default(1);
        $table->json('amenities')->nullable();
        $table->boolean('is_verified')->default(false);
        $table->string('response_time')->default('< 1 hour');
        $table->boolean('is_available')->default(true);
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
