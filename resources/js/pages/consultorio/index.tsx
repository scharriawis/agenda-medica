import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import consultorio from '@/routes/consultorio';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CrudDialog from './CrudDialog';

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface Consultorio {
  id: number;
  nombre: string;
  users: User[];
}

interface ConsultoriosIndexProps {
  consultorios: Consultorio[];
}

export default function ConsultoriosIndex({ consultorios }: ConsultoriosIndexProps) {
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit' | 'delete';
    consultorio: Consultorio | null;
  }>({
    open: false,
    mode: 'create',
    consultorio: null,
  });

  const openDialog = (mode: 'create' | 'edit' | 'delete', consultorio: Consultorio | null = null) =>
    setDialog({ open: true, mode, consultorio });

  const closeDialog = () => setDialog({ ...dialog, open: false });

  const { props } = usePage();
  const flash = props.flash as {
    success?: string;
    error?: string;
    info?: string;
  };

  const messages = [
    flash?.success && { type: 'success', message: flash.success },
    flash?.error && { type: 'error', message: flash.error },
    flash?.info && { type: 'info', message: flash.info },
  ].filter(Boolean) as { type: 'success' | 'error' | 'info'; message: string }[];

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Consultorio',
      href: consultorio.index().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Consulting room" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <FlashMessage messages={messages} />

          <Button
            onClick={() => openDialog('create')}
            className="mt-5 ml-5 bg-[var(--azul)] text-white"
            variant="outline"
          >
            Crear consultorio
          </Button>

          {consultorios.length <= 0 && (
            <p className="my-5 text-center text-primary">No hay consultorios para mostrar...</p>
          )}

          {consultorios.length > 0 && (
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
                  {consultorios.map((consultorio) => {
                    const tieneUsuarios =
                      consultorio.users && consultorio.users.length > 0;

                    return (
                      <TableRow key={consultorio.id}>
                        <TableCell>{consultorio.nombre}</TableCell>

                        {/* Profesión */}
                        <TableCell>
                          {tieneUsuarios
                            ? consultorio.users.map((u) => u.role).join(', ')
                            : (
                              <span className="text-gray-400 italic">
                                Sin rol asignado
                              </span>
                            )}
                        </TableCell>

                        {/* Nombre */}
                        <TableCell>
                          {tieneUsuarios
                            ? consultorio.users.map((u) => u.name).join(', ')
                            : (
                              <span className="text-gray-400 italic">
                                Sin usuario asignado
                              </span>
                            )}
                        </TableCell>

                        <TableCell className="flex justify-end gap-2 text-right">
                          <Button
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                            variant="outline"
                            onClick={() => openDialog('edit', consultorio)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openDialog('delete', consultorio)}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Modal dinámico */}
          <CrudDialog
            open={dialog.open}
            mode={dialog.mode}
            consultorio={dialog.consultorio}
            onClose={closeDialog}
          />
        </div>
      </div>
    </AppLayout>
  );
}
