import type { Metadata } from "next";
import { isAuthenticated, isConfigured } from "@/lib/studio/auth";
import { loginAction, logoutAction } from "./actions";
import { Logo } from "@/components/ui/Logo";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Gate for the owner dashboard. Renders the passcode form when signed out. */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  return (
    <div className="min-h-dvh bg-ivory text-ink">
      <header className="border-b border-border bg-bone">
        <div className="container-editorial flex h-[68px] items-center justify-between">
          <Logo tone="dark" size="sm" href="/studio" />
          <div className="flex items-center gap-6">
            <span className="t-label text-clay">Studio</span>
            {authed && (
              <form action={logoutAction}><button type="submit" className="t-small underline underline-offset-4">Sign out</button></form>
            )}
          </div>
        </div>
      </header>
      <main id="main" className="container-editorial py-10 lg:py-14">
        {authed ? children : <Login />}
      </main>
    </div>
  );
}

function Login() {
  return (
    <div className="mx-auto max-w-[420px]">
      <h1 className="font-display text-[40px] leading-[1] text-ink">Studio sign-in</h1>
      <p className="t-body mt-3 text-taupe">Private dashboard for hpearl_beauty.</p>
      {!isConfigured() ? (
        <Placeholder label="STUDIO_PASSCODE is not set" className="mt-6">Add STUDIO_PASSCODE (and STUDIO_SESSION_SECRET) to the environment to enable sign-in.</Placeholder>
      ) : (
        <form action={loginAction} className="mt-8 space-y-4">
          <label className="t-small block">Passcode
            <input name="passcode" type="password" required autoComplete="current-password" className="mt-1.5 h-12 w-full rounded-control border border-border bg-bone px-4 t-body focus:border-clay focus:outline-none" />
          </label>
          <button type="submit" className="inline-flex h-12 items-center justify-center rounded-button bg-ink px-6 text-[15px] font-semibold text-ivory hover:bg-espresso">Enter</button>
        </form>
      )}
    </div>
  );
}
