<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eps extends Model
{
    /** @use HasFactory<\Database\Factories\EpsFactory> */
    use HasFactory;

    protected $table = 'eps';

    protected $fillable = ['nombre'];

    //Relacion de uno a muchos
    public function pacientes()
    {
        return $this->hasMany('App\Models\Paciente');
    }
}
