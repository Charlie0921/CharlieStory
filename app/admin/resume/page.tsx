"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"


export default function AdminResumePage() {
    const router = useRouter();
    const [resume, setResume]  = useState<PortfolioResume[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<PortfolioResume | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const loadExperiences = useCallback(async () => {
        setError("");

        try{
            const rows = await getAdminResume();
            setResume(rows);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load experiences."
            )
        }
    },[]);


    return (
        <main className = "site-shell">
            <section className="mini-home-shell is-room-home admin-page-shell p-6">
                <div className="mx-auto w-full max-w-6xl rounded-xl border border-line bg-paper-bright p-6 shadow-soft">
                    <div className = "mb-6 flex flex wrap items-start justify-between gap-4">
                        <div>
                            <p className="eyebrow">Admin</p>
                            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                                Resume Editor
                            </h1>
                            <p className="mt-2 text-sm text-ink-soft">
                                Manage the skills and attachments shown in the portfolio experience window.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/admin/projects"
                                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
                            >
                                Projects
                            </Link>
                            <button
                                type="button"
                                onClick={startCreate}
                                className="rounded-md border border-coral-deep bg-coral px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-white"
                            >
                                New Experience
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
                            >
                                Logout
                            </button>
                        </div>
                    </div>                    
                </div>

            </section>
        </main>
    )
}