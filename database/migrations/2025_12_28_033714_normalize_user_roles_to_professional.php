<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->whereIn('role', ['doctor', 'odontologo'])
            ->update([
                'role' => 'professional',
            ]);
    }

    public function down(): void
    {
        // Rollback seguro: no intentamos adivinar especialidades
        // Dejamos todos como 'professional'
    }
};
