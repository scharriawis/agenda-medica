<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    /** @use HasFactory<\Database\Factories\CitaFactory> */
    use HasFactory;

    protected $table = 'citas';

    protected $fillable = [
        'paciente_id',
        'professional_id',
        'fecha',
        'hora',
        'status',
        'created_by',
        'updated_by',
        'ip_address',
    ];

    public function scopeForUser($query, $user)
    {
        if ($user->role === 'admin') {
            return $query;
        }

        if ($user->role === 'professional') {
            return $query->where('professional_id', $user->professional->id);
        }

        // paciente
        return $query->where('paciente_id', $user->paciente->id);
    }

    // Relaciones
    public function professional()
    {
        return $this->belongsTo(Profesional::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function actualizador()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
