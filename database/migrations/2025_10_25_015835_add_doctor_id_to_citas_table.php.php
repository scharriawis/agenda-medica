<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_add_professional_id_to_citas_table.php
    public function up()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->foreignId('professional_id')->nullable()->after('paciente_id')->constrained('users');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
