<?php

namespace App\Enums;

enum TipoDocumento: string
{
    case CC = 'CC';
    case TI = 'TI';
    case CE = 'CE';
    case PA = 'PA';
    case RC = 'RC';

    public static function options(): array
    {
        return array_map(
            fn (self $case) => $case->value,
            self::cases()
        );
    }

    public static function forSelect(): array
    {
        return [
            ['value' => self::CC->value, 'label' => 'Cédula de ciudadanía'],
            ['value' => self::TI->value, 'label' => 'Tarjeta de identidad'],
            ['value' => self::CE->value, 'label' => 'Cédula de extranjería'],
            ['value' => self::PA->value, 'label' => 'Pasaporte'],
            ['value' => self::RC->value, 'label' => 'Registro civil'],
        ];
    }
}
