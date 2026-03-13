import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import type { FormEvent, MouseEvent } from 'react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface Eps {
    id?: number;
    nombre?: string;
}

interface CrudDialogProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'delete';
    eps?: Eps | null;
}

export default function CrudDialog({ open, onClose, mode, eps }: CrudDialogProps) {
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
        nombre: eps?.nombre ?? '',
    });

    useEffect(() => {
        if (mode === 'edit' && eps) {
            setData('nombre', eps.nombre ?? '');
        } else if (mode === 'create') {
            setData('nombre', '');
        }
    }, [mode, eps, setData]);

    const closeDialog = () => {
        reset();
        onClose();
    };

    // Handler para create / edit (form submit)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('eps.store'), { onSuccess: closeDialog });
            return;
        }

        if (mode === 'edit' && eps?.id) {
            put(route('eps.update', eps.id), { onSuccess: closeDialog });
            return;
        }

        if (mode === 'delete' && eps?.id) {
            destroy(route('eps.destroy', eps.id), { onSuccess: closeDialog });
            return;
        }
    };

    // Handler específico para delete (evita usar `any`)
    const handleDelete = (e?: MouseEvent) => {
        e?.preventDefault();
        if (eps?.id) {
            destroy(route('eps.destroy', eps.id), {
                onSuccess: closeDialog,
            });
        }
    };

    const titles: Record<CrudDialogProps['mode'], string> = {
        create: 'Crear eps',
        edit: 'Editar eps',
        delete: 'Eliminar eps',
    };

    const descriptions: Record<CrudDialogProps['mode'], string> = {
        create: 'Agrega una nueva eps al sistema.',
        edit: 'Modifica los datos de la eps seleccionado.',
        delete: 'Esta acción eliminará el eps de forma permanente.',
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
                            <Label htmlFor="nombre">Eps</Label>
                            <Input
                                id="nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder="Nombre de la eps"
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
                        <p className="text-sm text-muted-foreground">¿Estás seguro de que deseas eliminar esta eps?</p>
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
