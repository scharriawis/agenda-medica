import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User } from './index';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    role: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Paciente {
    id: number;
    nombre: string;
    // agrega otros campos si los tienes
}

export interface Professional {
    id: number;
    name: string;
    email: string;
    // agrega otros campos si deseas
}

export interface Cita {
    id: number;
    paciente_id: number;
    professional_id: number;
    fecha: string;
    hora: string;
    tipo_cita?: string;

    paciente?: Paciente;
    professional?: Professional;
}



// 👇 Aquí le decimos a TS que además de auth, puede tener otras props dinámicas
export interface PageProps extends InertiaPageProps {
  auth: {
    user: User;
  };
  [key: string]: unknown;
}

export interface BasePageProps {
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown;
}

export type GenericPageProps<T = Record<string, unknown>> = InertiaPageProps & BasePageProps & T;