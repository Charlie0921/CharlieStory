"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  PortfolioProjectRow,
  PortfolioProjectUpsert,
} from "@/lib/supabase/projects";
import type { Project, ProjectImage, ProjectLinks } from "@/lib/types";

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: PortfolioProjectRow;
  onSubmit: (project: PortfolioProjectUpsert) => Promise<void>;
};

type FormState = {
  file_no: string;
  title: string;
  impact: string;
  org: string;
  status: string;
  domain: Project["domain"];
  category: string;
  problem: string;
  solution: string;
  role: string;
  result: string;
  stack: string;
  images: string;
  links: string;
  technical_details: string;
  challenges: string;
  display_order: string;
  is_published: boolean;
};

const DOMAINS: Project["domain"][] = ["enterprise", "research", "product"];

function formatJson(value: unknown, fallback: unknown) {
  return JSON.stringify(value ?? fallback, null, 2);
}

function initialState(project?: PortfolioProjectRow): FormState {
  return {
    file_no: project?.file_no ?? "",
    title: project?.title ?? "",
    impact: project?.impact ?? "",
    org: project?.org ?? "",
    status: project?.status ?? "",
    domain: project?.domain ?? "product",
    category: project?.category ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    role: project?.role ?? "",
    result: project?.result ?? "",
    stack: formatJson(project?.stack, []),
    images: formatJson(project?.images, []),
    links: formatJson(project?.links, {
      github: "",
      demo: "",
      caseStudy: "",
    }),
    technical_details: formatJson(project?.technical_details, []),
    challenges: formatJson(project?.challenges, []),
    display_order:
      project?.display_order === null || project?.display_order === undefined
        ? ""
        : String(project.display_order),
    is_published: project?.is_published ?? false,
  };
}

function parseJsonField<T>(
  label: string,
  value: string,
  validate: (parsed: unknown) => parsed is T
): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${label} must be valid JSON.`);
  }

  if (!validate(parsed)) {
    throw new Error(`${label} has the wrong JSON shape.`);
  }

  return parsed;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isImageArray(value: unknown): value is ProjectImage[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const image = item as Record<string, unknown>;
      return (
        typeof image.src === "string" &&
        typeof image.alt === "string" &&
        typeof image.caption === "string"
      );
    })
  );
}

function isLinks(value: unknown): value is Partial<ProjectLinks> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return ["github", "demo", "caseStudy"].every((key) => {
    const item = (value as Record<string, unknown>)[key];
    return item === undefined || typeof item === "string";
  });
}

export default function ProjectForm({
  mode,
  project,
  onSubmit,
}: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initialState(project));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submitLabel = useMemo(
    () => (mode === "create" ? "Create Project" : "Save Project"),
    [mode]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const stack = parseJsonField("Stack", form.stack, isStringArray);
      const images = parseJsonField("Images", form.images, isImageArray);
      const links = parseJsonField("Links", form.links, isLinks);
      const technicalDetails = parseJsonField(
        "Technical details",
        form.technical_details,
        isStringArray
      );
      const challenges = parseJsonField(
        "Challenges",
        form.challenges,
        isStringArray
      );
      const displayOrder =
        form.display_order.trim() === ""
          ? null
          : Number.parseInt(form.display_order, 10);

      if (Number.isNaN(displayOrder)) {
        throw new Error("Display order must be a valid number.");
      }

      await onSubmit({
        file_no: form.file_no.trim(),
        title: form.title.trim(),
        impact: form.impact.trim() || null,
        org: form.org.trim() || null,
        status: form.status.trim() || null,
        domain: form.domain,
        category: form.category.trim() || null,
        problem: form.problem.trim() || null,
        solution: form.solution.trim() || null,
        role: form.role.trim() || null,
        result: form.result.trim() || null,
        stack,
        images,
        links,
        technical_details: technicalDetails,
        challenges,
        display_order: displayOrder,
        is_published: form.is_published,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
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
        <TextField label="File no" value={form.file_no} onChange={(value) => update("file_no", value)} required />
        <TextField label="Title" value={form.title} onChange={(value) => update("title", value)} required />
        <TextField label="Impact" value={form.impact} onChange={(value) => update("impact", value)} />
        <TextField label="Org" value={form.org} onChange={(value) => update("org", value)} />
        <TextField label="Status" value={form.status} onChange={(value) => update("status", value)} />
        <label className="grid gap-1 text-sm text-ink-soft">
          Domain
          <select
            value={form.domain}
            onChange={(event) =>
              update("domain", event.target.value as Project["domain"])
            }
            className="rounded-md border border-line bg-white px-3 py-2 text-ink"
          >
            {DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </label>
        <TextField label="Category" value={form.category} onChange={(value) => update("category", value)} />
        <TextField label="Display order" type="number" value={form.display_order} onChange={(value) => update("display_order", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextareaField label="Problem" value={form.problem} onChange={(value) => update("problem", value)} />
        <TextareaField label="Solution" value={form.solution} onChange={(value) => update("solution", value)} />
        <TextareaField label="Role" value={form.role} onChange={(value) => update("role", value)} />
        <TextareaField label="Result" value={form.result} onChange={(value) => update("result", value)} />
      </div>

      <div className="grid gap-4">
        <JsonField label="Stack JSON" value={form.stack} onChange={(value) => update("stack", value)} />
        <JsonField label="Images JSON" value={form.images} onChange={(value) => update("images", value)} rows={10} />
        <JsonField label="Links JSON" value={form.links} onChange={(value) => update("links", value)} />
        <JsonField label="Technical details JSON" value={form.technical_details} onChange={(value) => update("technical_details", value)} />
        <JsonField label="Challenges JSON" value={form.challenges} onChange={(value) => update("challenges", value)} />
      </div>

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
          onClick={() => router.push("/admin/projects")}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm text-ink-soft">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-md border border-line bg-white px-3 py-2 text-ink"
      />
    </label>
  );
}

function JsonField({
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
        spellCheck={false}
        className="rounded-md border border-line bg-white px-3 py-2 font-mono text-sm text-ink"
      />
    </label>
  );
}
