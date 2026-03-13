<?php

namespace App\Helpers;

use Carbon\Carbon;

class FestivosColombia
{
    public static function esFestivo(Carbon $date): bool
    {
        $year = $date->year;

        $festivos = [
            // Fijos
            "$year-01-01", // Año nuevo
            "$year-05-01", // Día del trabajo
            "$year-07-20", // Independencia
            "$year-08-07", // Batalla de Boyacá
            "$year-12-08", // Inmaculada Concepción
            "$year-12-25", // Navidad
        ];

        // Móviles
        $easter = self::fechaPascua($year);

        $movibles = [
            $easter->copy()->subDays(3)->format('Y-m-d'), // Jueves santo
            $easter->copy()->subDays(2)->format('Y-m-d'), // Viernes santo

            // Ley Emiliani
            self::moverALunes("$year-01-06"), // Reyes Magos
            self::moverALunes("$year-03-19"), // San José
            self::moverALunes("$year-06-29"), // San Pedro y San Pablo
            self::moverALunes("$year-08-15"), // Asunción
            self::moverALunes("$year-10-12"), // Día de la Raza
            self::moverALunes("$year-11-01"), // Todos los santos
            self::moverALunes("$year-11-11"), // Independencia de Cartagena
        ];

        return in_array($date->format('Y-m-d'), $festivos)
            || in_array($date->format('Y-m-d'), $movibles);
    }

    private static function moverALunes(string $date)
    {
        $d = Carbon::parse($date);
        return $d->dayOfWeek === 0 ? $d->addDay()->format('Y-m-d') : 
               ($d->dayOfWeek > 1 ? $d->next(Carbon::MONDAY)->format('Y-m-d') :
                                    $d->format('Y-m-d'));
    }

    private static function fechaPascua(int $year): Carbon
    {
        $a = $year % 19;
        $b = intdiv($year, 100);
        $c = $year % 100;
        $d = intdiv($b, 4);
        $e = $b % 4;
        $f = intdiv($b + 8, 25);
        $g = intdiv($b - $f + 1, 3);
        $h = (19 * $a + $b - $d - $g + 15) % 30;
        $i = intdiv($c, 4);
        $k = $c % 4;
        $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
        $m = intdiv($a + 11 * $h + 22 * $l, 451);
        $month = intdiv($h + $l - 7 * $m + 114, 31);
        $day = ($h + $l - 7 * $m + 114) % 31 + 1;

        return Carbon::createFromDate($year, $month, $day);
    }
}
