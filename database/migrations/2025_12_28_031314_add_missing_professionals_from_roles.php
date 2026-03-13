<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->whereIn('role', ['doctor', 'odontologo'])
            ->whereNotIn('id', function ($q) {
                $q->select('user_id')->from('professionals');
            })
            ->get()
            ->each(function ($user) {
                DB::table('professionals')->insert([
                    'user_id'        => $user->id,
                    'specialty'      => $user->role === 'odontologo'
                        ? 'Odontología'
                        : 'Medicina General',
                    'license_number' => null,
                    'phone'          => $user->phone ?? null,
                    'email'          => $user->email,
                    'is_active'      => true,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            });
    }

    public function down(): void
    {
        // Solo elimina los professionals que NO tienen citas asociadas
        DB::table('professionals')
            ->whereNotIn('id', function ($q) {
                $q->select('professional_id')
                  ->from('citas')
                  ->whereNotNull('professional_id');
            })
            ->delete();
    }
};
