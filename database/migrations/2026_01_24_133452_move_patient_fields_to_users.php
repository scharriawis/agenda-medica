<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('pacientes')
            ->join('users', 'pacientes.user_id', '=', 'users.id')
            ->update([
                'users.tipo_documento' => DB::raw('pacientes.tipo_documento'),
                'users.numero_documento' => DB::raw('pacientes.numero_documento'),
                'users.fecha_nacimiento' => DB::raw('pacientes.fecha_nacimiento'),
            ]);
    }

    public function down(): void
    {
        DB::table('pacientes')
            ->join('users', 'pacientes.user_id', '=', 'users.id')
            ->update([
                'pacientes.tipo_documento' => DB::raw('users.tipo_documento'),
                'pacientes.numero_documento' => DB::raw('users.numero_documento'),
                'pacientes.fecha_nacimiento' => DB::raw('users.fecha_nacimiento'),
            ]);
    }
};
