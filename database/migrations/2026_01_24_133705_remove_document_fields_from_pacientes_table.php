<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_documento',
                'numero_documento',
                'fecha_nacimiento',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->string('tipo_documento')->nullable();
            $table->string('numero_documento')->nullable();
            $table->date('fecha_nacimiento')->nullable();
        });
    }
};

