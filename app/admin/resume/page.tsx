"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  createSkill,
  deleteSkill,
  getAdminSkills,
  getProfile,
  toggleSkillPublished,
  updateProfile,
  updateSkill,
} from "@/lib/supabase/resume";
import type {
  PortfolioProfile,
  PortfolioProfileUpdate,
  PortfolioSkill,
  PortfolioSkillUpsert,
} from "@/lib/types";

type ProfileFormState = {
  name: string;
  role: string;
  education: string;
  grad: string;
  resume_url: string;
};

type SkillFormState = {
  skill_group: string;
  items: string;
  order_index: string;
  is_published: boolean;
};

function profileState(profile: PortfolioProfile | null): ProfileFormState {
  return {
    name: profile?.name ?? "",
    role: profile?.role ?? "",
    education: profile?.education ?? "",
    grad: profile?.grad ?? "",
    resume_url: profile?.resume_url ?? "",
  };
}

function skillState(skill?: PortfolioSkill | null): SkillFormState {
  return {
    skill_group: skill?.skill_group ?? "",
    items: skill?.items ?? "",
    order_index:
      skill?.order_index === null || skill?.order_index === undefined
        ? ""
        : String(skill.order_index),
    is_published: skill?.is_published ?? true,
  };
}

function parseOrderIndex(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error("Order index must be a valid number.");
  }

  return parsed;
}

export default function AdminResumePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() =>
    profileState(null)
  );
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [skillForm, setSkillForm] = useState<SkillFormState>(() =>
    skillState(null)
  );
  const [editingSkill, setEditingSkill] = useState<PortfolioSkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const skillSubmitLabel = useMemo(
    () => (editingSkill ? "Save Skill" : "Create Skill"),
    [editingSkill]
  );

  const loadResume = useCallback(async () => {
    setError("");

    try {
      const [profileData, skillRows] = await Promise.all([
        getProfile(),
        getAdminSkills(),
      ]);
      setProfile(profileData);
      setProfileForm(profileState(profileData));
      setSkills(skillRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resume.");
    }
  }, []);

  useEffect(() => {
    async function checkUserAndLoadResume() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      await loadResume();
      setLoading(false);
    }

    checkUserAndLoadResume();
  }, [loadResume, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function updateProfileField<K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K]
  ) {
    setProfileForm((current) => ({ ...current, [key]: value }));
  }

  function updateSkillField<K extends keyof SkillFormState>(
    key: K,
    value: SkillFormState[K]
  ) {
    setSkillForm((current) => ({ ...current, [key]: value }));
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setProfileMessage("");
    setSavingProfile(true);

    try {
      if (!profile) {
        throw new Error(
          "No portfolio_profile row found. Create the initial row in Supabase before editing."
        );
      }

      const payload: PortfolioProfileUpdate = {
        name: profileForm.name.trim(),
        role: profileForm.role.trim(),
        education: profileForm.education.trim() || null,
        grad: profileForm.grad.trim() || null,
        resume_url: profileForm.resume_url.trim() || null,
      };

      await updateProfile(profile.id, payload);
      await loadResume();
      setProfileMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSkillSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSavingSkill(true);

    try {
      const payload: PortfolioSkillUpsert = {
        skill_group: skillForm.skill_group.trim(),
        items: skillForm.items.trim(),
        order_index: parseOrderIndex(skillForm.order_index),
        is_published: skillForm.is_published,
      };

      if (editingSkill) {
        await updateSkill(editingSkill.id, payload);
      } else {
        await createSkill(payload);
      }

      setEditingSkill(null);
      setSkillForm(skillState(null));
      await loadResume();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save skill.");
    } finally {
      setSavingSkill(false);
    }
  }

  function startEditSkill(skill: PortfolioSkill) {
    setEditingSkill(skill);
    setSkillForm(skillState(skill));
  }

  function cancelEditSkill() {
    setEditingSkill(null);
    setSkillForm(skillState(null));
  }

  async function handleToggleSkill(skill: PortfolioSkill) {
    setBusyId(skill.id);
    setError("");

    try {
      await toggleSkillPublished(skill.id, !skill.is_published);
      await loadResume();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update skill.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteSkill(skill: PortfolioSkill) {
    if (!window.confirm(`Delete "${skill.skill_group}"? This cannot be undone.`)) {
      return;
    }

    setBusyId(skill.id);
    setError("");

    try {
      await deleteSkill(skill.id);
      if (editingSkill?.id === skill.id) {
        cancelEditSkill();
      }
      await loadResume();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <main className="site-shell">
        <section className="mini-home-shell is-room-home admin-page-shell p-8">
          <p className="text-sm text-ink-soft">Loading admin skills...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home admin-page-shell p-3 sm:p-6">
        <div className="mx-auto w-full max-w-6xl rounded-xl border border-line bg-paper-bright p-4 shadow-soft sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                Skills Editor
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Manage the skills summary, education, and resume link shown on the Skills page.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/profile"
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Profile
              </Link>
              <Link
                href="/admin/resume#skills-management"
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Skills
              </Link>
              <Link
                href="/admin/projects"
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Projects
              </Link>
              <Link
                href="/admin/experience"
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Experience
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Logout
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
              {error}
            </p>
          ) : null}

          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <section id="page-summary" className="min-w-0 rounded-lg border border-line bg-mist p-4">
              <h2 className="font-display text-lg font-semibold text-ink">
                Page Summary
              </h2>
              <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
                {profileMessage ? (
                  <p className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ice-deep">
                    {profileMessage}
                  </p>
                ) : null}
                <TextField label="Display Name" value={profileForm.name} onChange={(value) => updateProfileField("name", value)} required />
                <TextField label="Headline" value={profileForm.role} onChange={(value) => updateProfileField("role", value)} required />
                <TextField label="Education" value={profileForm.education} onChange={(value) => updateProfileField("education", value)} />
                <TextField label="Graduation" value={profileForm.grad} onChange={(value) => updateProfileField("grad", value)} />
                <TextField label="Resume URL" type="url" value={profileForm.resume_url} onChange={(value) => updateProfileField("resume_url", value)} />

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-md border border-coral-deep bg-coral px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-white disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </section>

            <section id="skills-management" className="min-w-0 rounded-lg border border-line bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-ink">
                Skills Management
              </h2>

              <form onSubmit={handleSkillSubmit} className="mt-4 space-y-4">
                <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_7.5rem]">
                  <TextField label="Skill group" value={skillForm.skill_group} onChange={(value) => updateSkillField("skill_group", value)} required />
                  <TextField label="Order" type="number" value={skillForm.order_index} onChange={(value) => updateSkillField("order_index", value)} />
                </div>
                <TextareaField label="Items, comma-separated" value={skillForm.items} onChange={(value) => updateSkillField("items", value)} required />
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={skillForm.is_published}
                    onChange={(event) =>
                      updateSkillField("is_published", event.target.checked)
                    }
                  />
                  Published
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={savingSkill}
                    className="rounded-md border border-coral-deep bg-coral px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-white disabled:opacity-50"
                  >
                    {savingSkill ? "Saving..." : skillSubmitLabel}
                  </button>
                  {editingSkill ? (
                    <button
                      type="button"
                      onClick={cancelEditSkill}
                      className="rounded-md border border-line bg-mist px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="mt-6 grid gap-3 sm:hidden">
                {skills.length ? (
                  skills.map((skill) => {
                    const disabled = busyId === skill.id;

                    return (
                      <article
                        key={skill.id}
                        className="min-w-0 rounded-lg border border-line bg-mist p-3"
                      >
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="eyebrow text-coral-deep">
                              {skill.order_index ?? "No order"}
                            </p>
                            <h3 className="mt-1 break-words font-display text-base font-semibold text-ink">
                              {skill.skill_group}
                            </h3>
                          </div>
                          <span className="shrink-0 rounded border border-line bg-white px-2 py-1 text-xs text-ink-soft">
                            {skill.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-2 break-words text-sm leading-relaxed text-ink">
                          {skill.items}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEditSkill(skill)}
                            className="rounded border border-line bg-white px-2 py-1 text-xs text-ink"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleToggleSkill(skill)}
                            className="rounded border border-line bg-white px-2 py-1 text-xs text-ink disabled:opacity-50"
                          >
                            {skill.is_published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDeleteSkill(skill)}
                            className="rounded border border-coral bg-white px-2 py-1 text-xs text-coral-deep disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="rounded-lg border border-line bg-mist p-4 text-sm text-ink-soft">
                    No skill groups found.
                  </p>
                )}
              </div>

              <div className="mt-6 hidden overflow-x-auto rounded-lg border border-line sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="bg-mist">
                    <tr>
                      <th className="border-b border-line px-3 py-2">Order</th>
                      <th className="border-b border-line px-3 py-2">Group</th>
                      <th className="border-b border-line px-3 py-2">Items</th>
                      <th className="border-b border-line px-3 py-2">Published</th>
                      <th className="border-b border-line px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.length ? (
                      skills.map((skill) => {
                        const disabled = busyId === skill.id;

                        return (
                          <tr key={skill.id}>
                            <td className="border-b border-line px-3 py-2">
                              {skill.order_index ?? ""}
                            </td>
                            <td className="border-b border-line px-3 py-2">
                              {skill.skill_group}
                            </td>
                            <td className="border-b border-line px-3 py-2">
                              {skill.items}
                            </td>
                            <td className="border-b border-line px-3 py-2">
                              {skill.is_published ? "Yes" : "No"}
                            </td>
                            <td className="border-b border-line px-3 py-2">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditSkill(skill)}
                                  className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => handleToggleSkill(skill)}
                                  className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink disabled:opacity-50"
                                >
                                  {skill.is_published ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => handleDeleteSkill(skill)}
                                  className="rounded border border-coral bg-white px-2 py-1 text-xs text-coral-deep disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="border-b border-line px-3 py-4 text-ink-soft"
                        >
                          No skill groups found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
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
        rows={3}
        className="min-w-0 rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}
