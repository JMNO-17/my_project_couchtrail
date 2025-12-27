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
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->string('reviewer_name');
        $table->string('reviewed_name');
        $table->enum('type', ['host', 'traveler']);
        $table->tinyInteger('rating');
        $table->boolean('is_flagged')->default(false);
        $table->text('comment');
        $table->timestamps();
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
