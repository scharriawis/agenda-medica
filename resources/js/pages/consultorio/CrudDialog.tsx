import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import type { FormEvent, MouseEvent } from 'react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface Consultorio {
    id?: number;
    nombre?: string;
}

interface CrudDialogProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'delete';
    consultorio?: Consultorio | null;
}

export default function CrudDialog({ open, onClose, mode, consultorio }: CrudDialogProps) {
    // <-- Tipamos el useForm para evitar any implícito
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm<{ nombre: string }>({
        nombre: consultorio?.nombre ?? '',
    });

    useEffect(() => {
        if (mode === 'edit' && consultorio) {
            setData('nombre', consultorio.nombre ?? '');
        } else if (mode === 'create') {
            setData('nombre', '');
        }
    }, [mode, consultorio, setData]);

    const closeDialog = () => {
        reset();
        onClose();
    };

    // Handler para create / edit (form submit)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('consultorio.store'), { onSuccess: closeDialog });
            return;
        }

        if (mode === 'edit' && consultorio?.id) {
            put(route('consultorio.update', consultorio.id), { onSuccess: closeDialog });
            return;
        }

        if (mode === 'delete' && consultorio?.id) {
            put(route('consultorio.delete', consultorio.id), { onSuccess: closeDialog });
            return;
        }
    };

    // Handler específico para delete (evita usar `any`)
    const handleDelete = (e?: MouseEvent) => {
        e?.preventDefault();
        if (consultorio?.id) {
            destroy(route('consultorio.destroy', consultorio.id), {
                onSuccess: closeDialog,
            });
        }
    };

    const titles: Record<CrudDialogProps['mode'], string> = {
        create: 'Crear consultorio',
        edit: 'Editar consultorio',
        delete: 'Eliminar consultorio',
    };

    const descriptions: Record<CrudDialogProps['mode'], string> = {
        create: 'Agrega un nuevo consultorio al sistema.',
        edit: 'Modifica los datos del consultorio seleccionado.',
        delete: 'Esta acción eliminará el consultorio de forma permanente.',
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{titles[mode]}</DialogTitle>
                    <DialogDescription>{descriptions[mode]}</DialogDescription>
                </DialogHeader>

                {mode !== 'delete' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="nombre">Consultorio</Label>
                            <Input
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder="Nombre del consultorio"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <Button variant="outline" type="button" onClick={closeDialog}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-(--azul) text-white hover:opacity-90">
                                {mode === 'create' ? 'Crear' : 'Guardar cambios'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4 py-4 text-center">
                        <p className="text-sm text-muted-foreground">¿Estás seguro de que deseas eliminar este consultorio?</p>
                        <div className="flex justify-center gap-3">
                            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                                Sí, eliminar
                            </Button>
                            <Button variant="outline" onClick={closeDialog}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
