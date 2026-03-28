/* ======================================================
| Imports
====================================================== */
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAgendaSlots } from '@/hooks/useAgendaSlots';
import AppLayout from '@/layouts/app-layout';
//import { echo } from '@/lib/echo';
import Agenda from '@/routes/citas';
import { type BreadcrumbItem } from '@/types';

import { EventInput } from '@fullcalendar/core';

/* ======================================================
| Types
====================================================== */

type UserRole = 'admin' | 'professional' | 'patient';
type CitaStatus = 'confirmada' | 'cancelada' | 'pendiente';

interface CitaEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    status: CitaStatus;
    profesional?: string;
    profesional_id?: number;
    paciente?: string;
    paciente_id?: number;
}

interface Profesional {
    id: number;
    type: string;
    user: { name: string };
}

interface DisponibilidadItem {
    fecha: string;
    professional_id: number;
    professional: string;
    horas: string[];
}

interface Props {
    citas: CitaEvent[];
    user: {
        id: number;
        role: UserRole;
    };
}

interface ProfesionalesParams {
    date: string;
    exclude_cita_id?: number;
}
/*
    type BroadcastCita = {
        cita: {
            id: number;
            professional: string;
            paciente: string;
            professional_id: number;
            paciente_id: number;
            fecha: string;
            hora: string;
            status: string;
        };
    };
*/

/* ======================================================
| Constants
====================================================== */

/* ======================================================
| Helpers
====================================================== */

const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const triggerHaptic = () => {
    if (isTouchDevice) {
        navigator.vibrate?.(15);
    }
};

const formatProfessionalLabel = (p: Profesional) => {
    const map: Record<string, string> = {
        doctor: 'Doctor',
        odontologo: 'Odontólogo',
    };

    return `${map[p.type] ?? p.type} — ${p.user.name}`;
};

/* ======================================================
| Component
====================================================== */

export default function Index({ citas, user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Agenda', href: Agenda.index().url }];

    const calendarRef = useRef<FullCalendar | null>(null);

    /* ================= Rango calendario ================= */

    const [calendarRange, setCalendarRange] = useState<{
        start: string;
        end: string | null;
        viewType: string;
    } | null>(null);

    /* ================= Client ================= */

    const [isClient, setIsClient] = useState(false);

    /* ================= Disponibilidad ================= */

    const [availabilityOpen, setAvailabilityOpen] = useState(false);
    const [availabilityProfessionalId, setAvailabilityProfessionalId] = useState<number | null>(null);
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [availabilityHours, setAvailabilityHours] = useState<string[]>([]);

    const toggleHour = (hour: string) => {
        setAvailabilityHours((prev) => (prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]));
    };

    const selectAllHours = () => {
        const available = slots.filter((slot) => slot.status !== 'booked').map((slot) => slot.hora);

        setAvailabilityHours(available);
    };

    const clearHours = () => {
        setAvailabilityHours([]);
    };

    const { slots } = useAgendaSlots(availabilityProfessionalId, availabilityDate);

    /* ================= Eventos disponibilidad ================= */

    const [disponibilidadEvents, setDisponibilidadEvents] = useState<EventInput[]>([]);

    const loadDisponibilidades = useCallback(
        async (start: string, end: string | null, viewType: string) => {
            try {
                const params = viewType === 'dayGridMonth' ? { start: start.slice(0, 10), end: end?.slice(0, 10) } : { fecha: start.slice(0, 10) };

                const { data } = await axios.get<DisponibilidadItem[]>('/api/disponibilidades', { params });

                let events: EventInput[] = [];

                if (viewType === 'dayGridMonth') {
                    const citasMap = new Map<string, { count: number; profesional: string }>();
                    type ExtendedCitaEvent = CitaEvent & {
                        professional_id?: number; // 👈 agregamos esto
                        extendedProps?: {
                            profesional_id?: number;
                            professional_id?: number;
                            profesional?: string;
                        };
                    };

                    citas.forEach((c: ExtendedCitaEvent) => {
                        const professionalId =
                            c.profesional_id ?? c.professional_id ?? c.extendedProps?.profesional_id ?? c.extendedProps?.professional_id;

                        if (!professionalId || !c.start) return;

                        const fecha = c.start.slice(0, 10);
                        const key = `${Number(professionalId)}-${fecha}`;

                        if (!citasMap.has(key)) {
                            citasMap.set(key, {
                                count: 1,
                                profesional: c.profesional ?? c.extendedProps?.profesional ?? c.title,
                            });
                        } else {
                            citasMap.get(key)!.count++;
                        }
                    });

                    const citasEvents: EventInput[] = Array.from(citasMap.entries()).map(([key, value]) => {
                        const [professional_id, ...fechaParts] = key.split('-');
                        const fecha = fechaParts.join('-');

                        return {
                            id: `cita-month-${professional_id}-${fecha}`,
                            title: `${value.profesional} (${value.count})`,
                            start: fecha,
                            allDay: true,
                            backgroundColor: '#3b82f6',
                            borderColor: '#2563eb',
                            textColor: '#ffffff',
                            editable: false,
                        };
                    });

                    const disponibilidadEventsFiltered: EventInput[] = data
                        .filter((item) => {
                            const key = `${Number(item.professional_id)}-${item.fecha.slice(0, 10)}`;
                            return !citasMap.has(key);
                        })
                        .map((item) => ({
                            id: `disp-month-${item.professional_id}-${item.fecha}`,
                            title: `${item.professional} (Disponible)`,
                            start: item.fecha,
                            allDay: true,
                            display: 'block',
                            backgroundColor: '#86efac',
                            borderColor: '#22c55e',
                            textColor: '#065f46',
                            editable: false,
                        }));

                    events = [...citasEvents, ...disponibilidadEventsFiltered];
                } else {
                    events = data.flatMap((item) =>
                        item.horas.map((hora) => {
                            const startDate = new Date(`${item.fecha}T${hora}`);
                            const endDate = new Date(startDate);
                            endDate.setMinutes(endDate.getMinutes() + 30);

                            return {
                                id: `disp-${item.professional_id}-${hora}`,
                                title: item.professional,
                                start: startDate.toISOString(),
                                end: endDate.toISOString(),
                                backgroundColor: '#bbf7d0',
                                borderColor: '#22c55e',
                                editable: false,
                            };
                        }),
                    );
                }

                setDisponibilidadEvents(events);
            } catch (error) {
                console.error(error);
            }
        },
        [citas],
    );

    /* ================= Profesionales ================= */

    const [professionals, setProfessionals] = useState<Profesional[]>([]);

    /* ================= Reprogramación ================= */

    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CitaEvent | null>(null);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
    const [selectedDateB, setSelectedDateB] = useState('');
    const [newTime, setNewTime] = useState('');
    const [availableSlotsB] = useState<string[]>([]);

    /* ======================================================
    | Effects
    ====================================================== */

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!availabilityOpen) return;

        axios
            .get('/api/profesionales/listar')
            .then((res) => setProfessionals(res.data))
            .catch(() => toast.error('No se pudieron cargar los profesionales'));
    }, [availabilityOpen]);

    useEffect(() => {
        if (!calendarRange) return;
        if (!citas || citas.length === 0) return; // 👈 CLAVE

        loadDisponibilidades(calendarRange.start, calendarRange.end, calendarRange.viewType);
    }, [calendarRange, citas, loadDisponibilidades]);

    /* ======================================================
    | Effects limpiar slots cargados por hook
    ====================================================== */
    useEffect(() => {
        setAvailabilityHours([]);
    }, [slots]);

    /* ======================================================
    | Effects webSocket
    ====================================================== */
    /*
        useEffect(() => {
            const channel = echo.channel('agenda');

            channel.listen('.cita.actualizada', (e: BroadcastCita) => {
                const calendarApi = calendarRef.current?.getApi();

                if (!calendarApi) return;

                const start = `${e.cita.fecha}T${e.cita.hora}`;

                const endDate = new Date(start);
                endDate.setMinutes(endDate.getMinutes() + 30);

                calendarApi.addEvent({
                    id: String(e.cita.id),
                    title: e.cita.professional,
                    start,
                    end: endDate.toISOString(),
                    extendedProps: {
                        profesional: e.cita.professional,
                        profesional_id: e.cita.professional_id,
                        paciente: e.cita.paciente,
                        paciente_id: e.cita.paciente_id,
                        status: e.cita.status,
                    },
                });

                toast.success('Nueva cita agendada');
            });

            return () => {
                echo.leave('agenda');
            };
        }, []);
    */

    /* ======================================================
    | Handlers
    ====================================================== */

    const handleDateClick = (info: DateClickArg) => {
        if (user.role !== 'admin') return;

        triggerHaptic();

        const [date, time] = info.dateStr.split('T');

        setAvailabilityDate(date);
        setAvailabilityProfessionalId(null);

        if (time) {
            // ESCENARIO 2 → vista día hora exacta
            setAvailabilityHours([time.substring(0, 5)]);
        } else {
            // ESCENARIO 1 → vista mes o día sin hora
            setAvailabilityHours([]);
        }

        setAvailabilityOpen(true);
    };

    const openEditModal = async (event: CitaEvent) => {
        setEditingEvent(event);
        setNewTime(event.start.split('T')[1].substring(0, 5));
        setSelectedDateB(event.start.split('T')[0]);
        setSelectedProfessionalId(event.profesional_id ?? null);
        setModalOpen(true);

        try {
            const citaId = Number(event.id);

            const params: ProfesionalesParams = {
                date: event.start.split('T')[0],
            };

            if (!Number.isNaN(citaId)) {
                params.exclude_cita_id = citaId;
            }

            const { data } = await axios.get('/api/profesionales', { params });
            setProfessionals(data);
        } catch {
            toast.error('No se pudieron cargar los profesionales');
        }
    };

    const saveChanges = () => {
        if (!editingEvent || !newTime || !selectedProfessionalId) return;

        router.put(
            `/agenda/${editingEvent.id}/drag`,
            {
                fecha: selectedDateB,
                hora: newTime,
                professional_id: selectedProfessionalId,
                paciente_id: editingEvent.paciente_id,
            },
            {
                onSuccess: () => {
                    toast.success('Cita reprogramada con éxito');
                    setModalOpen(false);
                    setEditingEvent(null);
                },
                onError: () => toast.error('Error al reprogramar la cita'),
            },
        );
    };

    /* ======================================================
    | API Guardar disponibilidad
    ====================================================== */

    const saveDisponibilidad = async () => {
        try {
            await axios.post('/api/disponibilidades', {
                professional_id: availabilityProfessionalId,
                fecha: availabilityDate,
                horas: availabilityHours,
            });

            toast.success('Disponibilidad guardada');

            setAvailabilityOpen(false);

            if (calendarRange) {
                await loadDisponibilidades(calendarRange.start, calendarRange.end, calendarRange.viewType);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar disponibilidad');
        }
    };

    /* ======================================================
    | Render
    ====================================================== */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda" />

            <div className="space-y-6 rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>

                {/* ================= Calendario ================= */}

                {isClient && (
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        locales={[esLocale]}
                        locale="es"
                        initialView="timeGridDay"
                        editable={user.role === 'admin'}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="17:00:00"
                        slotDuration="00:30:00"
                        scrollTime="08:00:00"
                        height="auto"
                        dateClick={handleDateClick}
                        eventSources={[
                            ...(calendarRange?.viewType === 'dayGridMonth'
                                ? [
                                      {
                                          events: disponibilidadEvents,
                                      },
                                  ]
                                : [{ events: citas }, { events: disponibilidadEvents }]),
                        ]}
                        datesSet={(info) => {
                            const viewType = info.view.type;

                            const newRange = {
                                start: info.startStr,
                                end: viewType === 'dayGridMonth' ? info.endStr : null,
                                viewType,
                            };

                            setCalendarRange((prev) => {
                                if (prev && prev.start === newRange.start && prev.end === newRange.end && prev.viewType === newRange.viewType) {
                                    return prev;
                                }

                                return newRange;
                            });
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridDay',
                        }}
                        eventClick={(info) => {
                            const start = info.event.start;
                            if (!start) return;

                            if (user.role === 'admin') {
                                openEditModal({
                                    id: info.event.id,
                                    title: info.event.title,
                                    start: start.toISOString(),
                                    end: info.event.end?.toISOString() ?? '',
                                    ...info.event.extendedProps,
                                } as CitaEvent);
                            } else {
                                info.view.calendar.changeView('timeGridDay', start);
                            }
                        }}
                    />
                )}
            </div>
            {/* ================= Modal Disponibilidad ================= */}

            {availabilityOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAvailabilityOpen(false)}>
                    <div className="w-11/12 max-w-3xl rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-xl font-bold">Crear disponibilidad</h2>

                        {/* Profesional */}

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium">Profesional</label>

                            <select
                                value={availabilityProfessionalId ?? ''}
                                onChange={(e) => {
                                    setAvailabilityProfessionalId(Number(e.target.value));
                                    setAvailabilityHours([]); // limpiar selección
                                }}
                                className="w-full rounded border px-3 py-2"
                            >
                                <option value="">Seleccione profesional</option>

                                {professionals.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {formatProfessionalLabel(p)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha */}

                        <div className="mb-4">
                            <label className="text-sm font-medium">Fecha</label>

                            <input
                                type="date"
                                value={availabilityDate}
                                onChange={(e) => {
                                    setAvailabilityDate(e.target.value);
                                    setAvailabilityHours([]); // limpiar selección
                                }}
                                className="mt-1 w-full rounded border px-3 py-2"
                            />
                        </div>

                        {/* Horarios */}

                        <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium">Horarios disponibles</label>

                                {slots.length > 0 && (
                                    <div className="flex gap-2">
                                        <button type="button" onClick={selectAllHours} className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                            {availabilityHours.length ? 'Todos / Ninguno' : 'Todos'}
                                        </button>

                                        <button type="button" onClick={clearHours} className="rounded bg-gray-400 px-2 py-1 text-xs text-white">
                                            Limpiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {slots.map((slot) => {
                                    const isSelected = availabilityHours.includes(slot.hora);

                                    let color = '';
                                    let clickable = false;

                                    if (slot.status === 'booked') {
                                        color = 'bg-red-500 text-white cursor-not-allowed';
                                    } else if (slot.status === 'disabled') {
                                        color = 'bg-gray-300 text-gray-600 cursor-not-allowed';
                                    } else {
                                        clickable = true;

                                        color = isSelected ? 'bg-blue-600 text-white' : 'bg-green-500 text-white';
                                    }

                                    return (
                                        <div
                                            key={slot.hora}
                                            onClick={() => clickable && toggleHour(slot.hora)}
                                            className={`cursor-pointer rounded px-3 py-2 text-center text-sm transition ${color}`}
                                        >
                                            {slot.hora}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botones */}

                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setAvailabilityOpen(false)} className="rounded border px-4 py-2">
                                Cancelar
                            </button>

                            <button
                                onClick={saveDisponibilidad}
                                disabled={!availabilityProfessionalId || availabilityHours.length === 0}
                                className={`rounded px-4 py-2 text-white ${
                                    !availabilityProfessionalId || availabilityHours.length === 0
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                Guardar disponibilidad
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div>
                {/* ================= Modal Reprogramar ================= */}
                {modalOpen && editingEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
                        <div className="w-11/12 max-w-5xl rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h2 className="mb-4 text-xl font-bold">Reprogramar cita</h2>

                            <div className="grid grid-cols-3 gap-4">
                                {/* Día A */}
                                <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                                    <strong>Día A</strong>

                                    <div>
                                        <strong>Fecha:</strong> {new Date(editingEvent.start).toLocaleDateString('es-ES')}
                                    </div>

                                    <div className="rounded border bg-white p-2">
                                        <strong>Paciente:</strong> {editingEvent.paciente}
                                    </div>

                                    <select
                                        value={selectedProfessionalId ?? ''}
                                        onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
                                        className="w-full rounded border px-2 py-1 text-sm"
                                    >
                                        {professionals.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {formatProfessionalLabel(p)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Día B */}
                                <div className="col-span-2 space-y-3 rounded-lg border bg-green-50 p-4">
                                    <strong className="text-green-700">Día B</strong>

                                    <select
                                        value={selectedProfessionalId ?? ''}
                                        onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
                                        className="w-full rounded border px-2 py-3 text-sm"
                                    >
                                        {professionals.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {formatProfessionalLabel(p)}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="date"
                                        value={selectedDateB}
                                        onChange={(e) => setSelectedDateB(e.target.value)}
                                        className="rounded border px-2 py-1 text-sm"
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                        {availableSlotsB.length === 0 && (
                                            <div className="col-span-2 text-center text-sm text-gray-500">No hay horarios disponibles</div>
                                        )}

                                        {availableSlotsB.map((time) => (
                                            <div
                                                key={time}
                                                onClick={() => setNewTime(time)}
                                                className={`cursor-pointer rounded bg-green-200 px-2 py-1 text-center text-sm ${
                                                    newTime === time ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={() => setModalOpen(false)} className="rounded border px-4 py-2">
                                    Cancelar
                                </button>

                                <button
                                    onClick={saveChanges}
                                    disabled={!selectedProfessionalId || !newTime}
                                    className={`rounded px-4 py-2 text-white ${
                                        !selectedProfessionalId || !newTime ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
