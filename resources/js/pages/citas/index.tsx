import UserDropdown from '@/components/UserDropdown';
import agenda from '@/routes/agenda';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

// ---------- Tipos ----------
interface Slot {
    hora: string;
    professional_id: number;
    professional_nombre: string;
}

interface Eps {
    id: number;
    nombre: string;
}

interface AvailableSlotsResponse {
    date: string;
    slots: Slot[];
}

interface ValidationErrors {
    [key: string]: string[];
}

interface ErrorResponse {
    message?: string;
    errors?: ValidationErrors;
    error?: string;
}

// ---------- Componente principal ----------
export default function Citas() {
    const { auth } = usePage<SharedData>().props;

    // Campos del formulario
    const [fecha, setFecha] = useState('');
    const [tipo, setTipo] = useState<'general' | 'odontologia'>('general');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [cel, setCel] = useState('');
    const [regimen, setRegimen] = useState<'Contributivo' | 'Subsidiado' | 'Otro'>('Otro');

    const [epsList, setEpsList] = useState<Eps[]>([]);
    const [epsId, setEpsId] = useState<number | ''>('');

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Reinicia horarios al cambiar fecha o tipo
    useEffect(() => {
        setSlots([]);
        setSelectedSlot(null);
    }, [fecha, tipo]);

    // ---------- Cargar EPS ----------
    useEffect(() => {
        const fetchEps = async () => {
            try {
                const { data } = await axios.get<Eps[]>('/eps/list');
                setEpsList(data);
            } catch {
                toast.error('Error cargando EPS.');
            }
        };
        fetchEps();
    }, []);

    // ---------- Obtener horarios ----------
    const fetchSlots = async () => {
        if (!fecha) {
            toast.error('Selecciona una fecha.');
            return;
        }

        setLoadingSlots(true);
        try {
            const resp = await axios.get<AvailableSlotsResponse>('/citas/available-slots', {
                params: { fecha, tipo },
            });

            setSlots(resp.data.slots || []);
            if ((resp.data.slots || []).length === 0) toast.error('No hay horarios disponibles.');
        } catch (error: unknown) {
            const err = error as AxiosError<ErrorResponse>;
            toast.error(err.response?.data?.error ?? 'Error obteniendo horarios.');
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    // ---------- Enviar cita ----------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSlot) {
            toast.error('Selecciona una hora disponible.');
            return;
        }
        if (!epsId) {
            toast.error('Debes seleccionar una EPS.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(route('citas.store'), {
                fecha,
                hora: selectedSlot.hora,
                tipo,
                nombre,
                correo,
                cel,
                regimen,
                eps_id: epsId,
            });

            toast.success('Cita agendada con éxito 🎉');
            setNombre('');
            setCorreo('');
            setCel('');
            setSelectedSlot(null);
            setSlots([]);
            setEpsId('');
        } catch (error: unknown) {
            const err = error as AxiosError<ErrorResponse>;
            if (err.response?.data?.errors) {
                const msgs = Object.values(err.response.data.errors).flat().join(' ');
                toast.error(msgs || 'Error guardando cita.');
            } else {
                toast.error(err.response?.data?.error || 'Error guardando cita.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ---------- Validación local ----------
    const validateLocalDate = (d: string): string => {
        if (!d) return '';
        const [y, m, day] = d.split('-');
        const dt = new Date(Number(y), Number(m) - 1, Number(day));

        const dow = dt.getDay();
        if (dow === 0 || dow === 6) return ' (sáb/dom no permitido)';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dt.getTime() === today.getTime()) return ' (no se permite hoy)';

        return '';
    };

    // ---------- Render ----------
    return (
        <>
            <Head title="Agendar cita" />

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {!auth.user && (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {auth?.user?.role === 'paciente' && <UserDropdown user={auth.user} />}

                        {auth?.user && auth.user.role === 'admin' && (
                            <Link
                                href={agenda.index()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Agenda
                            </Link>
                        )}

                        {auth.user && (
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Log out
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Contenido principal */}
                <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                    <div className="flex-1 rounded-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0_0_0_1px_rgba(26,26,0,0.16)] lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0_0_0_1px_#fffaed2d]">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f53003] text-white dark:bg-[#FF4433]">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold">Agendar cita médica</h1>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Agenda tu cita médica de manera rápida y sencilla.</p>
                            </div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Fecha, tipo y botón */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm">Fecha</label>
                                    <input
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        type="date"
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{validateLocalDate(fecha)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm">Tipo de cita</label>
                                    <select
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value as 'general' | 'odontologia')}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                    >
                                        <option value="general">Médico general</option>
                                        <option value="odontologia">Odontología</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={fetchSlots}
                                        className="rounded bg-[#f53003] px-4 py-2 text-white hover:bg-[#d72900]"
                                        disabled={loadingSlots}
                                    >
                                        {loadingSlots ? 'Buscando…' : 'Buscar horarios'}
                                    </button>
                                </div>
                            </div>

                            {/* Horarios */}
                            <div>
                                <label className="mb-2 block text-sm">Horarios disponibles</label>
                                {loadingSlots && <div>Cargando horarios…</div>}
                                {!loadingSlots && slots.length === 0 && <div className="text-sm text-gray-500">No hay horarios disponibles.</div>}
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {slots.map((s) => (
                                        <button
                                            type="button"
                                            key={s.hora}
                                            onClick={() => setSelectedSlot(s)}
                                            className={`rounded border p-2 ${
                                                selectedSlot?.hora === s.hora ? 'border-green-400 bg-green-100' : 'bg-white dark:bg-[#0a0a0a]'
                                            }`}
                                        >
                                            <div className="text-sm font-medium">{s.hora}</div>
                                            <div className="text-xs text-gray-500">{s.professional_nombre}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Datos paciente */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm">Nombre completo</label>
                                    <input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm">Régimen</label>
                                    <select
                                        value={regimen}
                                        onChange={(e) => setRegimen(e.target.value as 'Contributivo' | 'Subsidiado' | 'Otro')}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                    >
                                        <option value="Contributivo">Contributivo</option>
                                        <option value="Subsidiado">Subsidiado</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm">EPS</label>
                                    <select
                                        value={epsId}
                                        onChange={(e) => setEpsId(Number(e.target.value))}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                        required
                                    >
                                        <option value="">Seleccione EPS</option>
                                        {epsList.map((e) => (
                                            <option key={e.id} value={e.id}>
                                                {e.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm">Correo (opcional)</label>
                                    <input
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm">Teléfono / WhatsApp (opcional)</label>
                                    <input
                                        value={cel}
                                        onChange={(e) => setCel(e.target.value)}
                                        className="mt-1 w-full rounded border p-2 dark:bg-[#0a0a0a]"
                                    />
                                </div>
                            </div>

                            {/* Botón */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="rounded bg-[var(--azul)] px-4 px-5 py-2 font-medium text-white hover:bg-[var(--azul-hover)] dark:bg-[var(--azul)] dark:hover:bg-[var(--azul-hover)]"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Enviando…' : 'Confirmar cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
