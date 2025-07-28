<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
       Schema::create('travelers', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id')->unique();
    $table->string('name');
    $table->string('location')->nullable();
    $table->string('avatar')->nullable();
    $table->text('bio')->nullable();
    $table->integer('trip_count')->default(0);
    $table->boolean('is_verified')->default(false);
    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('travelers');
    }
};
