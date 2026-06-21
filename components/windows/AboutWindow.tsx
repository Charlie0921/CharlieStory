import { PROFILE } from "@/lib/data";

export default function AboutWindow() {
  return <div className="mx-auto max-w-2xl">
    <div className="mb-6 grid gap-5 sm:grid-cols-[150px_1fr]">
      <div className="min-h-36 overflow-hidden rounded-xl border border-line bg-ice-wash">
        <img src="/images/profile.png" alt="Kunjoong Charlie Kim" className="profile-photo h-full min-h-36 w-full" />
      </div>
      <div><p className="eyebrow">Developer profile</p><h3 className="font-display text-3xl font-semibold text-ink">{PROFILE.name}</h3><p className="mt-1 text-sm font-medium text-ice-deep">{PROFILE.role}</p><p className="mt-3 text-sm leading-relaxed text-ink-soft">{PROFILE.bio}</p></div>
    </div>
    <p className="rounded-xl border-l-4 border-lilac-deep bg-white p-4 text-[0.94rem] leading-relaxed text-ink">{PROFILE.bio2}</p>
    <dl className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {[["Based", PROFILE.location], ["Languages", PROFILE.languages], ["Education", PROFILE.education], ["Graduation", PROFILE.grad]].map(([key, value]) => <div key={key} className="bg-white p-4"><dt className="eyebrow">{key}</dt><dd className="mt-1 text-sm text-ink">{value}</dd></div>)}
    </dl>
    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sage bg-[#edf3e9] px-3 py-2 text-xs text-[#4d7154]"><span className="h-2 w-2 rounded-full bg-[#66866c]" />{PROFILE.open}</div>
  </div>;
}
