import { PROFILE, SKILLS } from "@/lib/data";

export default function ResumeWindow() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative rounded-xl border border-line bg-white p-5 sm:p-7">
        <div className="absolute right-5 top-5 rotate-3 border-2 border-lilac-deep px-2 py-1 font-accent text-base uppercase tracking-[0.08em] text-lilac-deep">Current</div>
        <p className="eyebrow">Candidate record</p>
        <h3 className="font-display text-2xl font-semibold text-ink">{PROFILE.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{PROFILE.role}</p>
        <div className="my-5 border-t border-dashed border-line" />
        <div className="grid gap-4 sm:grid-cols-2">
          {SKILLS.map((skill) => (
            <div key={skill.group}>
              <p className="eyebrow text-coral-deep">{skill.group}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{skill.items}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-ice-wash p-3 text-sm text-ice-deep">
          {PROFILE.education}<br /><span className="text-xs">{PROFILE.grad}</span>
        </div>
      </div>
      <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="primary-button mt-4 flex w-full">View Resume <span aria-hidden className="ml-2">↗</span></a>
    </div>
  );
}
