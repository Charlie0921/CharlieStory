import type { Role } from "@/lib/types";

type ExperienceWindowProps = {
  experiences: Role[];
};

export default function ExperienceWindow({
  experiences,
}: ExperienceWindowProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 text-sm text-ink-soft">
        Selected work and research experiences that shaped how I build software.
      </p>

      <div className="space-y-3">
        {experiences.map((r, i) => (
          <article
            key={r.org + r.title}
            className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[92px_1fr] sm:p-5"
          >
            <div>
              <span className="font-accent text-base tracking-[0.08em] text-coral-deep">
                LOG-{String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 font-accent text-base text-ink-soft">
                {r.dates}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {r.title}
                </h3>
                <span className="text-xs text-ink-soft">{r.place}</span>
              </div>
              <p className="text-sm font-medium text-coral-deep">{r.org}</p>

              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink">
                {r.logs.map((log) => (
                  <li key={log} className="flex gap-2">
                    <span className="text-coral">&mdash;</span>
                    <span>{log}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 rounded-md bg-[#f4f0e8] px-3 py-2 text-xs leading-relaxed text-ink-soft">
                <strong className="text-ink">Impact:</strong> {r.impact}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[0.58rem] text-ink-soft"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
