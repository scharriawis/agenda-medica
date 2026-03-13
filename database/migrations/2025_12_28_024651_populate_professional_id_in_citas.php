<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $doctorIds = DB::table('citas')
            ->whereNotNull('professional_id')
            ->distinct()
            ->pluck('professional_id');

        DB::table('users')
            ->whereIn('id', $doctorIds)
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
    public function down(): void
    {
        DB::table('citas')->update([
            'professional_id' => null,
        ]);
    }
};
