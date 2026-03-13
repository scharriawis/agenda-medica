import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Consultorio from '@/routes/consultorio';
import Eps from '@/routes/eps';
import Profesionales from '@/routes/profesionales';
import Agenda from '@/routes/agenda';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck2, HousePlus, ShieldPlus, Stethoscope } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    let mainNavItems: NavItem[] = [];

    if (auth.user.role !== 'paciente') {
        if (auth.user.role === 'admin') {
            mainNavItems = [
                {
                    title: 'Agenda',
                    href: Agenda.index(),
                    icon: CalendarCheck2,
                },
                {
                    title: 'Consultorio',
                    href: Consultorio.index(),
                    icon: HousePlus,
                },
                {
                    title: 'Profesionales',
                    href: Profesionales.index(),
                    icon: Stethoscope,
                },
                {
                    title: 'EPS',
                    href: Eps.index(),
                    icon: ShieldPlus,
                },
            ];
        }
    }
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={Agenda.index().url} prefetch={false}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
