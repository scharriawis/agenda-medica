<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /**
         * Asumimos:
         * - users ya existen
         * - algunos users representan profesionales
         * - specialty se deja genérica por ahora
         */

        DB::table('users')
            ->where('role', 'professional') // ⚠️ ajustable si usas otro criterio
            ->get()
            ->each(function ($user) {
                DB::table('professionals')->insert([
                    'user_id'        => $user->id,
                    'specialty'      => 'General',
                    'license_number' => null,
                    'phone'          => $user->phone ?? null,
                    'email'          => $user->email,
                    'is_active'      => true,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /**
         * Eliminamos SOLO los profesionales creados desde users
         */
        DB::table('professionals')->truncate();
    }
};
