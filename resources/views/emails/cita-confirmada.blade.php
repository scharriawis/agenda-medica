@component('mail::message')
# 🩺 Confirmación de cita médica

Hola **{{ $cita->paciente->nombre }}**,  
Tu cita ha sido programada exitosamente. Aquí tienes los detalles:

---

**📅 Fecha:** {{ \Carbon\Carbon::parse($cita->fecha)->format('d/m/Y') }}  
**🕒 Hora:** {{ $cita->hora }}  
**👨‍⚕️ Doctor:** {{ $doctor->name }}  
@if($consultorio)
**🏥 Consultorio:** {{ $consultorio->nombre }}
@endif  
**📋 Tipo:** {{ $cita->tipo_cita }}

---

Si tienes dudas o deseas reprogramarla, por favor contáctanos.

@component('mail::button', ['url' => config('app.url')])
Ir al sitio web
@endcomponent

Gracias por confiar en **{{ config('app.name') }}**  
Nos alegra poder atenderte.  
@endcomponent
