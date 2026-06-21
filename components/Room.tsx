"use client";
import * as React from "react";
import RoomObject from "./RoomObject";
import {
  AvatarArt,
  DeskArt,
  CabinetArt,
  FrameArt,
  PhoneArt,
  CdPlayerArt,
  PlantArt,
  WindowArt,
} from "./objects";
import type { WindowId } from "@/lib/types";

export default function Room({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div className="relative mx-auto h-full min-h-[460px] w-full max-w-[960px] select-none">
      {/* Wall */}
      <div className="absolute inset-0 rounded-3xl border border-line bg-wall shadow-room overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#DEDBD2 1px,transparent 1px),linear-gradient(90deg,#DEDBD2 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(70% 60% at 50% 35%,#000,transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(70% 60% at 50% 35%,#000,transparent 80%)",
          }}
        />
        {/* Floor */}
        <div className="absolute inset-x-0 bottom-0 h-[34%] bg-floor border-t border-line" />
        {/* Soft window light wash */}
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-[60%] w-[55%] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#FBFAF6,transparent 70%)" }}
        />
        {/* Rug */}
        <div className="absolute bottom-[6%] left-1/2 h-[14%] w-[46%] -translate-x-1/2 rounded-[50%] bg-ice-wash/70 border border-ice/50" />
      </div>

      {/* --- Decorative (non-interactive) --- */}
      <RoomObject label="PROFILE" ariaLabel="Open profile" onClick={() => onOpen("about")} className="left-[5%] top-[8%] h-[20%] w-[18%]" bob={1}><WindowArt /></RoomObject>
      <div className="absolute left-[28%] top-[10%] rotate-[-4deg] bg-sticky px-3 py-2 font-mono text-[0.55rem] leading-relaxed text-ink-soft shadow-soft" aria-hidden>SHIP SMALL.<br/>LEARN FAST.</div>
      <div className="absolute right-[7%] top-[7%] rotate-3 rounded-sm border border-line bg-white px-3 py-2 font-display text-xs text-ink-soft shadow-soft" aria-hidden>Work notes<br/><span className="font-mono text-[0.52rem]">JUN · 2026</span></div>
      <div className="absolute bottom-[20%] right-[7%] h-[20%] w-[9%]" aria-hidden>
        <PlantArt />
      </div>

      {/* --- Interactive objects --- */}

      {/* Poster / Frame -> Resume */}
      <RoomObject
        label="RESUME"
        ariaLabel="Open resume"
        onClick={() => onOpen("resume")}
        className="right-[26%] top-[9%] h-[18%] w-[18%]"
        bob={1.5}
      >
        <FrameArt />
      </RoomObject>

      {/* File cabinet -> Experience */}
      <RoomObject
        label="EXPERIENCE"
        ariaLabel="Open experience"
        onClick={() => onOpen("experience")}
        className="right-[15%] bottom-[26%] h-[34%] w-[12%]"
      >
        <CabinetArt />
      </RoomObject>

      {/* Desk + computer -> Projects */}
      <RoomObject
        label="PROJECTS"
        ariaLabel="Open projects"
        onClick={() => onOpen("projects")}
        className="left-[30%] bottom-[20%] h-[34%] w-[30%]"
      >
        <DeskArt />
      </RoomObject>

      {/* Phone -> Contact */}
      <RoomObject
        label="MAILBOX"
        ariaLabel="Open mailbox"
        onClick={() => onOpen("contact")}
        className="left-[20%] bottom-[50%] h-[13%] w-[11%]"
        bob={1}
      >
        <PhoneArt />
      </RoomObject>

      {/* CD player -> Playlist */}
      <RoomObject
        label="BGM"
        ariaLabel="Open background music"
        onClick={() => onOpen("playlist")}
        className="left-[7%] bottom-[24%] h-[16%] w-[18%]"
        bob={1.5}
      >
        <CdPlayerArt />
      </RoomObject>

      <div className="pointer-events-none absolute bottom-[11%] left-[62%] h-[33%] w-[12%]" aria-hidden>
        <div className="avatar-speech absolute -left-[118%] -top-[18%] w-[150px] rounded-xl border border-[#aaa397] bg-[#fffdf8] px-3 py-2 font-accent text-base leading-[1.05] tracking-[0.03em] text-ink shadow-soft">
          Click around.<br />The room keeps my work.
        </div>
        <AvatarArt />
      </div>
    </div>
  );
}
