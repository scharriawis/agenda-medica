import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import profesionalesURL from '@/routes/profesionales';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface Consultorio {
    id: number;
    nombre: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    consultorio: Consultorio | null;
}

interface Profesional {
    id: number;
    type: string;
    is_active: boolean;
    user: User;
}

interface ProfesionalesIndexProps {
    profesionales: Profesional[];
    types: string[];
    filtroActivo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profesionales',
        href: profesionalesURL.index().url,
    },
];

export default function Profesionales({ profesionales, types, filtroActivo }: ProfesionalesIndexProps) {
    const { props } = usePage();
    const flash = props.flash as {
        success?: string;
        error?: string;
        info?: string;
    };

    const [selectedType, setSelectedType] = useState<string>(filtroActivo || 'todos');

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setSelectedType(type);

        router.get(
            profesionalesURL.index().url,
            { type },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // ✅ Mostrar toasts
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.info) toast(flash.info);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profesionales de la salud" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* Botón crear */}
                    <Link href={profesionalesURL.create()}>
                        <Button className="mt-5 ml-5 bg-[var(--azul)] text-white" variant="outline">
                            Crear profesional
                        </Button>
                    </Link>

                    {/*Filtro de roles */}
                    <div className="mx-5 mt-5 flex items-center gap-4">
                        <label htmlFor="type" className="text-sm font-medium">
                            Filtrar por tipo:
                        </label>
                        <select id="type" className="rounded-md border px-3 py-2 text-sm" value={selectedType} onChange={handleTypeChange}>
                            <option value="todos">Todos</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tabla de usuarios */}
                    {profesionales.length <= 0 && <p className="my-5 text-center text-primary">No hay profesionales para mostrar...</p>}

                    {profesionales.length > 0 && (
                        <div className="mx-5">
                            <Table>
                                <TableCaption>P: piso # C: consultorio #</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Consultorio</TableHead>
                                        <TableHead>Profesión</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profesionales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-4 text-center text-muted-foreground">
                                                No hay profesionales que coincidan con el filtro seleccionado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        profesionales.map((profesional) => (
                                            <TableRow key={profesional.id}>
                                                {/* Consultorio */}
                                                <TableCell>
                                                    {profesional.user.consultorio ? profesional.user.consultorio.nombre : 'No tiene consultorio'}
                                                </TableCell>

                                                {/* Tipo */}
                                                <TableCell>{profesional.type}</TableCell>

                                                {/* Nombre */}
                                                <TableCell>{profesional.user.name}</TableCell>

                                                {/* Acciones */}
                                                <TableCell className="flex justify-end gap-2">
                                                    <Button asChild className="bg-yellow-500 text-white hover:bg-yellow-600" variant="outline">
                                                        <Link href={profesionalesURL.edit(profesional.user.id)}>
                                                            <Pencil />
                                                        </Link>
                                                    </Button>

                                                    <Button asChild variant="destructive">
                                                        <Link href={profesionalesURL.destroy(profesional.user.id)}>
                                                            <Trash2 />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <Toaster position="top-right" richColors closeButton />
                </div>
            </div>
        </AppLayout>
    );
}
