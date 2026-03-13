<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultorio extends Model
{
    /** @use HasFactory<\Database\Factories\ConsultorioFactory> */
    use HasFactory;

    protected $table = 'consultorios';

    protected $fillable = [
        'nombre'
    ];

    public $timestamps = true;

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }
}
