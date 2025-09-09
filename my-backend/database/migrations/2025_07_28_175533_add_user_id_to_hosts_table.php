<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hosts', function (Blueprint $table) {
            // Add user_id only if it doesn't exist
            if (!Schema::hasColumn('hosts', 'user_id')) {
                $table->foreignId('user_id')
                      ->constrained('users')
                      ->onDelete('cascade')
                      ->after('id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('hosts', function (Blueprint $table) {
            if (Schema::hasColumn('hosts', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });
    }
};
