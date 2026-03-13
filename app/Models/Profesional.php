<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesional extends Model
{
    use HasFactory;

    protected $table = 'professionals';

    /**
     * Campos asignables en masa
     */
    protected $fillable = [
        'user_id',
        'type',
        'last_login_at',
        'license_number',
        'phone',
        'is_active',
    ];

    protected $appends = [
        'last_active',
    ];

    public function getLastActiveAttribute()
    {
        return $this->last_login_at
            ? $this->last_login_at->diffForHumans()
            : 'Nunca ha iniciado sesión';
    }

    /**
     * Casts
     */
    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * Un profesional pertenece a un usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un profesional puede tener muchas citas
     * (NO se usa aún, solo se deja preparado)
     */
    public function citas()
    {
        return $this->hasMany(Cita::class, 'professional_id');
    }
}
