"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  fallbackSidebarProfile,
  getSidebarProfile,
  saveSidebarProfile,
} from "@/lib/supabase/sidebarProfile";
import type { SidebarProfile, SidebarProfileUpsert } from "@/lib/types";

type ProfileCardFormState = Record<keyof SidebarProfileUpsert, string>;

function formState(profile: SidebarProfile | null): ProfileCardFormState {
  return {
    profile_image_url:
      profile?.profile_image_url ?? fallbackSidebarProfile.profile_image_url ?? "",
    display_name: profile?.display_name ?? fallbackSidebarProfile.display_name,
    role_title: profile?.role_title ?? fallbackSidebarProfile.role_title,
    short_bio: profile?.short_bio ?? fallbackSidebarProfile.short_bio,
    status_text: profile?.status_text ?? fallbackSidebarProfile.status_text,
    footer_text: profile?.footer_text ?? fallbackSidebarProfile.footer_text ?? "",
    github_url: profile?.github_url ?? fallbackSidebarProfile.github_url ?? "",
    linkedin_url:
      profile?.linkedin_url ?? fallbackSidebarProfile.linkedin_url ?? "",
    bgm_title: profile?.bgm_title ?? fallbackSidebarProfile.bgm_title ?? "",
    bgm_artist: profile?.bgm_artist ?? fallbackSidebarProfile.bgm_artist ?? "",
    bgm_audio_url:
      profile?.bgm_audio_url ?? fallbackSidebarProfile.bgm_audio_url ?? "",
  };
}

function toPayload(form: ProfileCardFormState): SidebarProfileUpsert {
  return {
    profile_image_url: form.profile_image_url.trim() || null,
    display_name: form.display_name.trim(),
    role_title: form.role_title.trim(),
    short_bio: form.short_bio.trim(),
    status_text: form.status_text.trim(),
    footer_text: form.footer_text.trim() || null,
    github_url: form.github_url.trim() || null,
    linkedin_url: form.linkedin_url.trim() || null,
    bgm_title: form.bgm_title.trim() || null,
    bgm_artist: form.bgm_artist.trim() || null,
    bgm_audio_url: form.bgm_audio_url.trim() || null,
  };
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [form, setForm] = useState<ProfileCardFormState>(() =>
    formState(null)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setError("");

    try {
      const profileData = await getSidebarProfile();
      setProfile(profileData);
      setForm(formState(profileData));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile card."
      );
    }
  }, []);

  useEffect(() => {
    async function checkUserAndLoadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      await loadProfile();
      setLoading(false);
    }

    checkUserAndLoadProfile();
  }, [loadProfile, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function updateField<K extends keyof ProfileCardFormState>(
    key: K,
    value: ProfileCardFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const payload = toPayload(form);

      if (!payload.display_name || !payload.role_title || !payload.short_bio) {
        throw new Error("Display name, role / title, and short bio are required.");
      }

      const saved = await saveSidebarProfile(profile?.id ?? null, payload);
      setProfile(saved);
      setForm(formState(saved));
      setMessage("Profile card saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile card.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="site-shell">
        <section className="mini-home-shell is-room-home admin-page-shell p-8">
          <p className="text-sm text-ink-soft">Loading admin profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home admin-page-shell p-3 sm:p-6">
        <div className="mx-auto w-full max-w-5xl rounded-xl border border-line bg-paper-bright p-4 shadow-soft sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                Profile Editor
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Manage the left sidebar profile card shown on the public site.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/profile" className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft">
                Profile
              </Link>
              <Link href="/admin/resume#skills-management" className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft">
                Skills
              </Link>
              <Link href="/admin/projects" className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft">
                Projects
              </Link>
              <Link href="/admin/experience" className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft">
                Experience
              </Link>
              <button type="button" onClick={handleLogout} className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft">
                Logout
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
              {error}
            </p>
          ) : null}

          <section className="rounded-lg border border-line bg-mist p-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Sidebar Profile Card
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {message ? (
                <p className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ice-deep">
                  {message}
                </p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Profile image URL" value={form.profile_image_url} onChange={(value) => updateField("profile_image_url", value)} />
                <TextField label="Display name" value={form.display_name} onChange={(value) => updateField("display_name", value)} required />
                <TextField label="Role / title" value={form.role_title} onChange={(value) => updateField("role_title", value)} required />
                <TextField label="Status text" value={form.status_text} onChange={(value) => updateField("status_text", value)} required />
                <TextField label="Footer text" value={form.footer_text} onChange={(value) => updateField("footer_text", value)} />
                <TextField label="GitHub URL" type="url" value={form.github_url} onChange={(value) => updateField("github_url", value)} />
                <TextField label="LinkedIn URL" type="url" value={form.linkedin_url} onChange={(value) => updateField("linkedin_url", value)} />
                <TextField label="BGM title" value={form.bgm_title} onChange={(value) => updateField("bgm_title", value)} />
                <TextField label="BGM artist or label" value={form.bgm_artist} onChange={(value) => updateField("bgm_artist", value)} />
                <TextField label="BGM audio URL" value={form.bgm_audio_url} onChange={(value) => updateField("bgm_audio_url", value)} />
              </div>

              <TextareaField label="Short bio" value={form.short_bio} onChange={(value) => updateField("short_bio", value)} required />

              <button
                type="submit"
                disabled={saving}
                className="rounded-md border border-coral-deep bg-coral px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid min-w-0 gap-1 text-sm text-ink-soft">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="grid min-w-0 gap-1 text-sm text-ink-soft">
      {label}
      <textarea
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="min-w-0 rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}
