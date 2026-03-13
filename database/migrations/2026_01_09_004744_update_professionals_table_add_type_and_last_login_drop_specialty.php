<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('professionals', function (Blueprint $table) {
            // Nuevo tipo de profesional
            $table->enum('type', ['doctor', 'odontologo'])
                  ->after('id');

            // Último acceso del usuario
            $table->timestamp('last_login_at')
                  ->nullable()
                  ->after('type');

            // Eliminar specialty
            $table->dropColumn('specialty');
        });
    }

    public function down(): void
    {
        Schema::table('professionals', function (Blueprint $table) {
            $table->dropColumn(['type', 'last_login_at']);

            // Restaurar specialty si se hace rollback
            $table->string('specialty')->nullable();
        });
    }
};
