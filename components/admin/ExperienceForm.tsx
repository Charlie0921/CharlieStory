"use client";

import { useMemo, useState } from "react";
import type {
  PortfolioExperience,
  PortfolioExperienceUpsert,
} from "@/lib/supabase/experience";

type ExperienceFormProps = {
  experience?: PortfolioExperience | null;
  onSubmit: (experience: PortfolioExperienceUpsert) => Promise<void>;
  onCancel: () => void;
};

type FormState = {
  org: string;
  title: string;
  slug: string;
  type: string;
  start_date: string;
  end_date: string;
  date_label: string;
  place: string;
  logs: string;
  skills: string;
  impact: string;
  company_url: string;
  order_index: string;
  is_published: boolean;
};

function initialState(experience?: PortfolioExperience | null): FormState {
  return {
    org: experience?.org ?? "",
    title: experience?.title ?? "",
    slug: experience?.slug ?? "",
    type: experience?.type ?? "",
    start_date: experience?.start_date ?? "",
    end_date: experience?.end_date ?? "",
    date_label: experience?.date_label ?? "",
    place: experience?.place ?? "",
    logs: experience?.logs.join("\n") ?? "",
    skills: experience?.skills.join(", ") ?? "",
    impact: experience?.impact ?? "",
    company_url: experience?.company_url ?? "",
    order_index:
      experience?.order_index === null || experience?.order_index === undefined
        ? ""
        : String(experience.order_index),
    is_published: experience?.is_published ?? false,
  };
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [form, setForm] = useState<FormState>(() => initialState(experience));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submitLabel = useMemo(
    () => (experience ? "Save Experience" : "Create Experience"),
    [experience]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const orderIndex =
        form.order_index.trim() === ""
          ? null
          : Number.parseInt(form.order_index, 10);

      if (Number.isNaN(orderIndex)) {
        throw new Error("Order index must be a valid number.");
      }

      await onSubmit({
        org: form.org.trim(),
        title: form.title.trim(),
        slug: form.slug.trim() || null,
        type: form.type.trim() || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        date_label: form.date_label.trim() || null,
        place: form.place.trim() || null,
        logs: parseLines(form.logs),
        skills: parseCommaList(form.skills),
        impact: form.impact.trim() || null,
        company_url: form.company_url.trim() || null,
        order_index: orderIndex,
        is_published: form.is_published,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save experience."
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Org" value={form.org} onChange={(value) => update("org", value)} required />
        <TextField label="Title" value={form.title} onChange={(value) => update("title", value)} required />
        <TextField label="Slug" value={form.slug} onChange={(value) => update("slug", value)} />
        <TextField label="Type" value={form.type} onChange={(value) => update("type", value)} />
        <TextField label="Start date" type="date" value={form.start_date} onChange={(value) => update("start_date", value)} />
        <TextField label="End date" type="date" value={form.end_date} onChange={(value) => update("end_date", value)} />
        <TextField label="Date label" value={form.date_label} onChange={(value) => update("date_label", value)} />
        <TextField label="Place" value={form.place} onChange={(value) => update("place", value)} />
        <TextField label="Company URL" type="url" value={form.company_url} onChange={(value) => update("company_url", value)} />
        <TextField label="Order index" type="number" value={form.order_index} onChange={(value) => update("order_index", value)} />
      </div>

      <TextareaField
        label="Logs, one bullet per line"
        value={form.logs}
        onChange={(value) => update("logs", value)}
      />

      <TextareaField
        label="Impact"
        value={form.impact}
        onChange={(value) => update("impact", value)}
        rows={3}
      />

      <TextField
        label="Skills, comma-separated"
        value={form.skills}
        onChange={(value) => update("skills", value)}
      />

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) => update("is_published", event.target.checked)}
        />
        Published
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md border border-coral-deep bg-coral px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-line bg-mist px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </form>
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
    <label className="grid gap-1 text-sm text-ink-soft">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm text-ink-soft">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}
