<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consulta extends Model
{
    /** @use HasFactory<\Database\Factories\ConsultaFactory> */
    use HasFactory;

    protected $table = 'consultas';

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }
}
