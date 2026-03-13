<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('disponibilidades_profesionales', function (Blueprint $table) {
            $table->id();

            $table->foreignId('professional_id')
                ->constrained('professionals')
                ->cascadeOnDelete();

            $table->date('fecha');
            $table->time('hora');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            // 🔒 Evita duplicados exactos
            $table->unique(['professional_id', 'fecha', 'hora']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disponibilidades_profesionales');
    }
};
