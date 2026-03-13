<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('citas', function (Blueprint $table) {

            // Eliminar tipo_cita
            if (Schema::hasColumn('citas', 'tipo_cita')) {
                $table->dropColumn('tipo_cita');
            }

            // Nuevos campos
            $table->string('status')->default('pendiente')->after('hora');

            $table->foreignId('created_by')
                ->nullable()
                ->after('status')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->after('created_by')
                ->constrained('users')
                ->nullOnDelete();

            $table->ipAddress('ip_address')
                ->nullable()
                ->after('updated_by');
        });
    }

    public function down(): void
    {
        Schema::table('citas', function (Blueprint $table) {

            // Restaurar tipo_cita
            $table->string('tipo_cita')->nullable()->after('hora');

            // Eliminar campos nuevos
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);

            $table->dropColumn([
                'status',
                'created_by',
                'updated_by',
                'ip_address',
            ]);
        });
    }
};

