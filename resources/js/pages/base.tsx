import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import healthProfessionals from '@/routes/healthProfessionals';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import FlashMessage from '@/components/FlashMessage';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Health professionals',
        href: healthProfessionals.index().url,
    },
];

export default function HealthProfessionals() {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Health professional" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <FlashMessage messages={messages} />
                </div>
            </div>
        </AppLayout>
    );
}
