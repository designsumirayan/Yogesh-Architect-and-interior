import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { Toaster } from "../components/ui/sonner";
import { supabase } from "../integrations/supabase/client";

function NotFoundComponent() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-32 pb-20">
        <div className="max-w-md text-center">
          <p className="font-display text-[120px] leading-none gradient-text">404</p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-3 text-sm text-slate-soft">
            The page you’re looking for has moved or never existed. Let’s get you back on plan.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:-translate-y-0.5 transition-all"
            >
              Back home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Contact studio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn’t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yogesh Architects & Interiors — Architecture & Interior Design, Lucknow" },
      { name: "description", content: "Premium architecture and interior design studio in Lucknow, led by Yogesh Shukla. Residential, commercial, and turnkey projects across Uttar Pradesh." },
      { name: "author", content: "Yogesh Architects & Interiors" },
      { name: "theme-color", content: "#0B3A8D" },
      { property: "og:site_name", content: "Yogesh Architects & Interiors" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Yogesh Architects & Interiors",
        description: "Architecture and interior design studio in Lucknow, Uttar Pradesh.",
        areaServed: "Uttar Pradesh, India",
        address: { "@type": "PostalAddress", addressLocality: "Lucknow", addressRegion: "UP", addressCountry: "IN" },
        telephone: "+91-98765-43210",
      }),
    }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = pathname.startsWith("/admin") || pathname === "/auth";

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {!hideChrome && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
