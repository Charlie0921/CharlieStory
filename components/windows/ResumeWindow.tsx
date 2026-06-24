"use client";

import { useEffect, useState } from "react";
import { PROFILE, SKILLS } from "@/lib/data";
import {
  getProfile,
  getPublishedSkills,
  mapPortfolioSkillToSkillGroup,
} from "@/lib/supabase/resume";
import type { SkillGroup } from "@/lib/types";

type ResumeProfile = {
  name: string;
  role: string;
  education: string;
  grad: string;
  resume: string;
};

const fallbackProfile: ResumeProfile = {
  name: PROFILE.name,
  role: PROFILE.role,
  education: PROFILE.education,
  grad: PROFILE.grad,
  resume: PROFILE.resume,
};

export default function ResumeWindow() {
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [skills, setSkills] = useState<SkillGroup[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadResume() {
      setLoading(true);

      try {
        const [profileData, skillData] = await Promise.all([
          getProfile(),
          getPublishedSkills(),
        ]);

        if (!active) return;

        if (!profileData) {
          throw new Error("No profile data found.");
        }

        setProfile({
          name: profileData.name,
          role: profileData.role,
          education: profileData.education ?? "",
          grad: profileData.grad ?? "",
          resume: profileData.resume_url ?? PROFILE.resume,
        });

        setSkills(skillData.map(mapPortfolioSkillToSkillGroup));
      } catch (error) {
        console.error("Failed to fetch resume content:", error);

        if (active) {
          setProfile(fallbackProfile);
          setSkills(SKILLS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      active = false;
    };
  }, []);

  if (loading || !profile || !skills) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-line bg-white p-5 text-sm text-ink-soft sm:p-7">
          Loading resume...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative rounded-xl border border-line bg-white p-5 sm:p-7">
        <div className="absolute right-5 top-5 rotate-3 border-2 border-lilac-deep px-2 py-1 font-accent text-base uppercase tracking-[0.08em] text-lilac-deep">
          Current
        </div>

        <p className="eyebrow">Candidate record</p>

        <h3 className="font-display text-2xl font-semibold text-ink">
          {profile.name}
        </h3>

        <p className="mt-1 text-sm text-ink-soft">{profile.role}</p>

        <div className="my-5 border-t border-dashed border-line" />

        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.group}>
              <p className="eyebrow text-coral-deep">{skill.group}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                {skill.items}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-ice-wash p-3 text-sm text-ice-deep">
          {profile.education}
          <br />
          <span className="text-xs">{profile.grad}</span>
        </div>
      </div>

      <a
        href={profile.resume}
        target="_blank"
        rel="noreferrer"
        className="primary-button mt-4 flex w-full"
      >
        View Resume <span aria-hidden className="ml-2">↗</span>
      </a>
    </div>
  );
}