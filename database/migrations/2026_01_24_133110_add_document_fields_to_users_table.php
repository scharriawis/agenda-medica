<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tipo_documento')->nullable()->after('email');
            $table->string('numero_documento')->nullable()->unique()->after('tipo_documento');
            $table->date('fecha_nacimiento')->nullable()->after('numero_documento');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_documento',
                'numero_documento',
                'fecha_nacimiento',
            ]);
        });
    }
};

