"use client";

import { useBgmPlayer } from "@/components/BgmPlayerContext";

export default function BgmWidget({ mini = false }: { mini?: boolean }) {
  const { track, trackIndex, playing, progress, togglePlay, next } = useBgmPlayer();

  return (
    <section className={`bgm-widget ${mini ? "bgm-widget--mini" : ""}`} aria-label="BGM player">
      {mini ? (
        <>
          <div className="bgm-mini__full">
            <div className="bgm-mini__row">
              <span className="bgm-mini__label">BGM</span>
              <strong title={track.title}>{track.title}</strong>
            </div>
            <div className="bgm-widget__progress" aria-label="Track progress"><i style={{ width: `${progress}%` }} /></div>
            <div className="bgm-widget__controls">
              <button type="button" onClick={() => void togglePlay()} aria-pressed={playing}>{playing ? "PAUSE" : "PLAY"}</button>
              <button type="button" onClick={() => void next()}>NEXT</button>
            </div>
          </div>
          <button className="bgm-tablet-chip" type="button" onClick={() => void togglePlay()} aria-pressed={playing}>
            <span>BGM</span><strong>{track.title}</strong><i aria-hidden>{playing ? "Ⅱ" : "▷"}</i>
          </button>
        </>
      ) : (
        <>
          <div className="bgm-widget__topline"><span>BGM PLAYER</span><span className={`bgm-widget__light ${playing ? "is-playing" : ""}`} aria-hidden /></div>
          <div className="bgm-widget__display">
            <div className="bgm-widget__disc" aria-hidden><i /></div>
            <div className="bgm-widget__track"><span>Now Playing</span><strong>{track.title}</strong><small>{track.artist}</small></div>
            <span className="bgm-widget__number">{String(trackIndex + 1).padStart(2, "0")}</span>
          </div>
          <div className="bgm-widget__progress" aria-label="Track progress"><i style={{ width: `${progress}%` }} /></div>
          <div className="bgm-widget__controls">
            <button type="button" onClick={() => void togglePlay()} aria-pressed={playing}>{playing ? "PAUSE" : "PLAY"}</button>
            <button type="button" onClick={() => void next()}>NEXT</button>
            <span>AUDIO ON</span>
          </div>
        </>
      )}
    </section>
  );
}
