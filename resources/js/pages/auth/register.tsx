import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

/* =======================
   Tipos
======================= */
type TipoDocumentoOption = {
    value: string;
    label: string;
};

type PageProps = InertiaPageProps & {
    tiposDocumento: TipoDocumentoOption[];
};

export default function Register() {
    const { auth, tiposDocumento } = usePage<PageProps>().props;

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Campo visible solo si es admin */}
                        {auth?.user?.role === 'admin' && (
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    autoComplete="role"
                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <option value="">Selecciona un rol...</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="odontologo">Odontólogo</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>
                        )}

                        <div className="grid gap-6">
                            {/* Nombre */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Tipo documento */}
                            <div className="grid gap-2">
                                <Label htmlFor="tipo_documento">Tipo de documento</Label>
                                <select
                                    id="tipo_documento"
                                    name="tipo_documento"
                                    className="block w-full rounded-md border px-3 py-2"
                                    defaultValue=""
                                >
                                    <option value="">Seleccione tipo de documento</option>
                                    {tiposDocumento.map((doc) => (
                                        <option key={doc.value} value={doc.value}>
                                            {doc.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.tipo_documento} />
                            </div>

                            {/* Número documento */}
                            <div className="grid gap-2">
                                <Label htmlFor="numero_documento">Número de documento</Label>
                                <Input
                                    id="numero_documento"
                                    name="numero_documento"
                                    type="text"
                                />
                                <InputError message={errors.numero_documento} />
                            </div>

                            {/* Fecha nacimiento */}
                            <div className="grid gap-2">
                                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                                <Input
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    type="date"
                                />
                                <InputError message={errors.fecha_nacimiento} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
