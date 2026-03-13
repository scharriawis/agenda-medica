<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'consultorio_id',
        'role',
        'name',
        'email',
        'tipo_documento',
        'numero_documento',
        'fecha_nacimiento',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Relacion de uno a muchos
    public function consulta()
    {
        return $this->belongsTo('App\Models\Consulta', 'consulta_id');
    }

    //Relacion de uno a muchos
    public function consultorio()
    {
        return $this->belongsTo('App\Models\Consultorio', 'consultorio_id');
    }

    //Relacion de uno a muchos
    public function professional()
    {
        return $this->hasOne(Profesional::class);
    }
    public function paciente()
    {
        return $this->hasOne(Paciente::class);
    }
}
