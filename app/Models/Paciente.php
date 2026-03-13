<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';

    /**
     * Campos asignables en masa
     */
    protected $fillable = [
        'user_id',
        'eps_id',
        'cel',
        'regimen',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    // 🔹 Relación 1 a 1 con User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 EPS del paciente
    public function eps()
    {
        return $this->belongsTo(Eps::class);
    }

    // 🔹 Citas del paciente
    public function citas()
    {
        return $this->hasMany(Cita::class);
    }
}
