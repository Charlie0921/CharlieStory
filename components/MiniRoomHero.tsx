"use client";

import { useBgmPlayer } from "@/components/BgmPlayerContext";
import type { WindowId } from "@/lib/types";

type HotspotKind = "window" | "action";

type MiniRoomHotspot = {
  id: string;
  label: string;
  href: string;
  top: string;
  left: string;
  width: string;
  height: string;
  kind: HotspotKind;
  windowId?: WindowId;
  action?: "bgm";
};

type MiniRoomHeroProps = {
  onOpen: (id: WindowId) => void;
  debugHotspots?: boolean;
};

export const MINIROOM_HOTSPOTS: MiniRoomHotspot[] = [
  { id: "profile", label: "Profile", href: "#about", top: "38.6%", left: "20.1%", width: "10.7%", height: "12.4%", kind: "window", windowId: "about" },
  { id: "contact", label: "Contact / Mailbox", href: "#contact", top: "40.7%", left: "31.2%", width: "7.3%", height: "15%", kind: "window", windowId: "contact" },
  { id: "projects", label: "Projects", href: "#projects", top: "33.1%", left: "50.7%", width: "15.8%", height: "14.6%", kind: "window", windowId: "projects" },
  { id: "resume", label: "Resume", href: "#resume", top: "48.1%", left: "54.2%", width: "12.6%", height: "12.8%", kind: "window", windowId: "resume" },
  { id: "bgm", label: "BGM Player", href: "#bgm", top: "21.3%", left: "50.8%", width: "20.6%", height: "10.6%", kind: "action", action: "bgm" },
  { id: "experience", label: "Experience", href: "#experience", top: "40.2%", left: "75.2%", width: "10.7%", height: "22.4%", kind: "window", windowId: "experience" },
];

const MOBILE_NAV_ITEMS = [
  { id: "about", label: "Profile", kind: "window" as const, windowId: "about" as const },
  { id: "contact", label: "Contact", kind: "window" as const, windowId: "contact" as const },
  { id: "projects", label: "Projects", kind: "window" as const, windowId: "projects" as const },
  { id: "resume", label: "Resume", kind: "window" as const, windowId: "resume" as const },
  { id: "experience", label: "Experience", kind: "window" as const, windowId: "experience" as const },
  { id: "bgm", label: "BGM Player", kind: "action" as const, action: "bgm" as const },
];

export default function MiniRoomHero({ onOpen, debugHotspots = false }: MiniRoomHeroProps) {
  const { playing, togglePlay } = useBgmPlayer();

  const handleAction = async (hotspot: MiniRoomHotspot | { action?: "bgm" }) => {
    if (hotspot.action === "bgm") {
      await togglePlay();
    }
  };

  return (
    <section className="miniroom-hero" aria-label="Interactive mini room navigation">
      <div className="miniroom-hero__desktop">
        <div className={`miniroom-hero__frame ${debugHotspots ? "miniroom-hero--debug" : ""}`}>
          <img
            src="/images/home/home.png"
            alt="Illustrated mini room with clickable objects for portfolio sections"
            className="miniroom-hero__image"
          />

          <div className="miniroom-hero__overlay" aria-hidden={false}>
            {MINIROOM_HOTSPOTS.map((hotspot) => {
              const style = {
                top: hotspot.top,
                left: hotspot.left,
                width: hotspot.width,
                height: hotspot.height,
              };

              if (hotspot.kind === "window" && hotspot.windowId) {
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    aria-label={hotspot.label}
                    className="miniroom-hotspot"
                    data-label={hotspot.label}
                    style={style}
                    onClick={() => onOpen(hotspot.windowId!)}
                  />
                );
              }

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  aria-label={playing ? "Pause background music" : "Play background music"}
                  className={`miniroom-hotspot ${playing ? "is-active" : ""}`}
                  data-label={hotspot.label}
                  style={style}
                  onClick={() => void handleAction(hotspot)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="miniroom-hero__mobile" aria-label="Mobile portfolio navigation">
        {MOBILE_NAV_ITEMS.map((item) => {
          if (item.kind === "window") {
            return (
              <button
                key={item.id}
                type="button"
                className="miniroom-mobile-card"
                aria-label={item.label}
                onClick={() => onOpen(item.windowId)}
              >
                <span>{item.label}</span>
                <small>Open</small>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`miniroom-mobile-card ${playing ? "is-active" : ""}`}
              aria-label={playing ? "Pause background music" : "Play background music"}
              onClick={() => void handleAction(item)}
            >
              <span>{item.label}</span>
              <small>{playing ? "Pause" : "Play"}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
