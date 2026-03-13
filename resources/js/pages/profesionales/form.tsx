import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import profesionales from '@/routes/profesionales';
import type { BreadcrumbItem } from '@/types';
import type { Consultorio, User } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profesionales de la salud',
        href: profesionales.index().url,
    },
];

interface FormProps {
    consultorios: Consultorio[];
    usuariosAll: User[];
    user?: User;
}

type ProfessionalType = 'doctor' | 'odontologo';

export default function Form({ consultorios, usuariosAll, user }: FormProps) {
    const isEdit = Boolean(user);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        // User
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? '',
        consultorio_id: user?.consultorio_id ?? '',

        // Auth
        password: '',
        password_confirmation: '',

        // Professional
        type: '' as ProfessionalType | '',
        license_number: '',
        phone: '',
        is_active: true,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && user) {
            put(route('profesionales.update', user.id));
        } else {
            post(route('profesionales.store'), {
                onSuccess: () => reset('password', 'password_confirmation'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={isEdit ? 'Editar Usuario' : 'Crear Usuario'}>
            <Head title={isEdit ? 'Editar Usuario' : 'Crear Usuario'} />

            <div className="mx-auto w-xl p-6">
                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Consultorio */}
                    <div>
                        <Label htmlFor="consultorio_id">Consultorio</Label>
                        <select
                            id="consultorio_id"
                            value={data.consultorio_id}
                            onChange={(e) => setData('consultorio_id', e.target.value)}
                            className="block w-full rounded border px-2 py-1"
                            required
                        >
                            <option value="">Selecciona un consultorio</option>
                            {consultorios
                                .filter(
                                    (c) =>
                                        !usuariosAll.some(
                                            (u) => u.consultorio_id !== null && Number(u.consultorio_id) === Number(c.id) && u.id !== user?.id,
                                        ),
                                )
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                        </select>
                        <InputError message={errors.consultorio_id} />
                    </div>

                    {/* Role */}
                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <option value="">Selecciona un rol...</option>
                            <option value="professional">Profesional</option>
                            <option value="paciente">Paciente</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    {/* User */}
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="email">Correo</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="type">Tipo de profesional</Label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value as ProfessionalType)}
                            required
                            className="block w-full rounded border px-2 py-1"
                        >
                            <option value="">Selecciona una especialidad</option>
                            <option value="doctor">Doctor</option>
                            <option value="odontologo">Odontólogo</option>
                        </select>
                        <InputError message={errors.type} />
                    </div>

                    <div>
                        <Label htmlFor="license_number">Número de licencia</Label>
                        <Input id="license_number" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                        <InputError message={errors.license_number} />
                    </div>

                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        <InputError message={errors.phone} />
                    </div>

                    {isEdit && (
                        <div className="flex items-center gap-2">
                            <input id="is_active" type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <Label htmlFor="is_active">Profesional activo</Label>
                        </div>
                    )}

                    {/* Password */}
                    {!isEdit && (
                        <>
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </>
                    )}

                    <Button type="submit" disabled={processing} className="flex items-center gap-2">
                        <LoaderCircle className={`h-4 w-4 animate-spin ${processing ? 'opacity-100' : 'opacity-0'}`} />
                        <span>{isEdit ? 'Actualizar' : 'Crear'}</span>
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
