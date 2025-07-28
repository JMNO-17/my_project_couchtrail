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
        Schema::table('hosting_requests', function (Blueprint $table) {
            $table->foreignId('host_entry_id')->after('host_id')->constrained('hosts')->onDelete('cascade');
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosting_requests', function (Blueprint $table) {
            //
        });
    }
};
