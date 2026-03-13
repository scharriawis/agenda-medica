import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import eps from '@/routes/eps';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CrudDialog from './CrudDialog';


interface eps {
  id: number;
  nombre: string;
}

interface EpsIndexProps {
  epss: eps[];
}

export default function EpsIndex({ epss }: EpsIndexProps) {
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit' | 'delete';
    eps: eps | null;
  }>({
    open: false,
    mode: 'create',
    eps: null,
  });

  const openDialog = (mode: 'create' | 'edit' | 'delete', eps: eps | null = null) =>
    setDialog({ open: true, mode, eps });

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
      title: 'eps',
      href: eps.index().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Eps" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <FlashMessage messages={messages} />

          <Button
            onClick={() => openDialog('create')}
            className="mt-5 ml-5 bg-[var(--azul)] text-white"
            variant="outline"
          >
            Crear eps
          </Button>

          {epss.length <= 0 && (
            <p className="my-5 text-center text-primary">No hay epss para mostrar...</p>
          )}

          {epss.length > 0 && (
            <div className="mx-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>eps</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {epss.map((eps) => {
                    return (
                      <TableRow key={eps.id}>
                        <TableCell>{eps.nombre}</TableCell>

                        <TableCell className="flex justify-end gap-2 text-right">
                          <Button
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                            variant="outline"
                            onClick={() => openDialog('edit', eps)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openDialog('delete', eps)}
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
            eps={dialog.eps}
            onClose={closeDialog}
          />
        </div>
      </div>
    </AppLayout>
  );
}
