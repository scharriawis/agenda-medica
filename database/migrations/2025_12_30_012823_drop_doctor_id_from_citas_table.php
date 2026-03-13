<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            // Si existe FK, primero la eliminamos
            if (Schema::hasColumn('citas', 'professional_id')) {
                $table->dropForeign(['professional_id']);
                $table->dropColumn('professional_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->foreignId('professional_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });
    }
};
