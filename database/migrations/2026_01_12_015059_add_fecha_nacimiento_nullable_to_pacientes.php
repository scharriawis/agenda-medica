<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {

            if (!Schema::hasColumn('pacientes', 'fecha_nacimiento')) {
                $table->date('fecha_nacimiento')
                      ->nullable()
                      ->after('numero_documento');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            if (Schema::hasColumn('pacientes', 'fecha_nacimiento')) {
                $table->dropColumn('fecha_nacimiento');
            }
        });
    }
};
