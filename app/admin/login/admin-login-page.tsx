"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function redirectIfLoggedIn() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/admin/projects");
      }
    }

    redirectIfLoggedIn();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      return;
    }

    if (!data.session) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        setError("Login succeeded, but no auth session was stored. Check Supabase Auth settings and browser storage.");
        return;
      }
    }

    router.replace("/admin/projects");
    router.refresh();
  }

  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home p-6">
        <div className="mx-auto grid h-full w-full max-w-md place-items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-xl border border-line bg-paper-bright p-6 shadow-soft"
          >
            <p className="eyebrow">Admin</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
              Project Login
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Sign in to edit portfolio projects.
            </p>

            {error ? (
              <p className="mt-4 rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
                {error}
              </p>
            ) : null}

            <div className="mt-5 grid gap-4">
              <label className="grid gap-1 text-sm text-ink-soft">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="rounded-md border border-line bg-white px-3 py-2 text-ink"
                />
              </label>

              <label className="grid gap-1 text-sm text-ink-soft">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="rounded-md border border-line bg-white px-3 py-2 text-ink"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-md border border-coral-deep bg-coral px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
