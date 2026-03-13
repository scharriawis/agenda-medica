<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->string('documento', 20)
                ->nullable()
                ->after('id')
                ->index();
        });
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropIndex(['documento']);
            $table->dropColumn('documento');
        });
    }
};

