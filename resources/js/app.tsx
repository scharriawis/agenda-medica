import { Toaster } from "@/components/ui/sonner";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../css/app.css";
import LoadingScreen from "./components/LoadingScreen";
import { initializeTheme } from "./hooks/use-appearance";
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

function AppWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);

    const shouldShowLoader = true;

    /**
     * 🔹 Loader inicial (refresh / URL directa)
     */
    useEffect(() => {
        if (!shouldShowLoader) return;

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    },);

    /**
     * 🔹 Loader en navegación REAL (Inertia)
     */
    useEffect(() => {
        if (!shouldShowLoader) return;

        let active = true;

        const handleStart = () => {
            if (!active) return;
            setLoading(true);
        };

        const handleFinish = () => {
            if (!active) return;

            setTimeout(() => {
                if (active) setLoading(false);
            }, 1200);
        };

        document.addEventListener("inertia:start", handleStart);
        document.addEventListener("inertia:finish", handleFinish);

        return () => {
            active = false;
            document.removeEventListener("inertia:start", handleStart);
            document.removeEventListener("inertia:finish", handleFinish);
        };
    }, );

    return (
        <>
            {shouldShowLoader && loading && <LoadingScreen />}
            {children}
        </>
    );
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx")
        ),

    setup({ el, App, props }) {
        createRoot(el).render(
            <AppWrapper>
                <App {...props} />
                <Toaster position="top-right" richColors closeButton />
            </AppWrapper>
        );
    },

    progress: {
        showSpinner: false,
    },
});

initializeTheme();
