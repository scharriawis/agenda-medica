<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DisponibilidadProfesional extends Model
{
    use HasFactory;

    protected $table = 'disponibilidades_profesionales';

    protected $fillable = [
        'professional_id',
        'fecha',
        'hora',
        'created_by',
    ];

    // 🔗 Relaciones
    public function professional()
    {
        return $this->belongsTo(Profesional::class);
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
