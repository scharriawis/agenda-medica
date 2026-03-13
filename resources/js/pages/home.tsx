import { Link, usePage } from "@inertiajs/react";
import { User, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

type Role = "paciente" | "profesional";

interface AuthProps {
  auth?: {
    user?: {
      role?: Role;
    };
  };
}

export default function HomeAgendaMedica() {
  
const { auth } = usePage().props as AuthProps;

  // Redirección automática si el usuario ya está autenticado
  if (auth?.user?.role === "paciente") {
    window.location.href = "/citas";
    return null;
  }

  if (auth?.user?.role === "profesional") {
    window.location.href = "/dashboard/profesional";
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-amber-50 dark:from-emerald-950 dark:via-background dark:to-amber-950 flex flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />

      {/* Header institucional */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-6 mb-4">
          <img
            src="/images/acaldia.png"
            alt="Alcaldía Municipal"
            className="h-16"
          />
          <img
            src="/images/logoHospital.png"
            alt="Hospital San Antonio"
            className="h-20"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Sistema de Agenda Médica
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Plataforma oficial para la gestión de citas médicas del E.S.E. Hospital
          San Antonio
        </p>
      </motion.div>

      {/* Selector de rol */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full"
      >
        {/* Paciente */}
        <Link
          href="/citas"
          className="group relative flex flex-col items-center justify-center rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60 bg-card shadow-md p-12 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-t-2xl" />
          <div className="mb-8 flex items-center justify-center w-28 h-28 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110">
            <User className="w-14 h-14" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            Soy paciente
          </h2>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">
            Agenda y gestiona tus citas médicas de forma rápida y segura
          </p>
        </Link>

        {/* Profesional de la salud */}
        <Link
          href="/login"
          className="group relative flex flex-col items-center justify-center rounded-2xl border border-amber-200/60 dark:border-amber-800/60 bg-card shadow-md p-12 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-red-500 rounded-t-2xl" />
          <div className="mb-8 flex items-center justify-center w-28 h-28 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
            <Stethoscope className="w-14 h-14" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            Soy un profesional de la salud
          </h2>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">
            Administra tu agenda, pacientes y disponibilidad médica
          </p>
        </Link>
      </motion.div>

      {/* Footer institucional */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-14 text-sm text-muted-foreground text-center"
      >
        © {new Date().getFullYear()} E.S.E. Hospital San Antonio · Todos los
        derechos reservados
      </motion.footer>
    </div>
  );
}
