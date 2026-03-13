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
    Schema::table('professionals', function (Blueprint $table) {
        // Auditoría
        $table->foreignId('created_by')->nullable()->after('is_active')->constrained('users');
        $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users');
        $table->ipAddress('ip_address')->nullable()->after('updated_by');

        // Relación 1 a 1
        $table->unique('user_id');
    });

    Schema::table('professionals', function (Blueprint $table) {
        $table->dropColumn('email');
    });
}

public function down(): void
{
    Schema::table('professionals', function (Blueprint $table) {
        $table->string('email')->nullable();

        $table->dropUnique(['user_id']);
        $table->dropForeign(['created_by']);
        $table->dropForeign(['updated_by']);
        $table->dropColumn(['created_by', 'updated_by', 'ip_address']);
    });
}

};
