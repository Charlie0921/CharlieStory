"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { TRACKS } from "@/lib/data";

type BgmPlayerValue = {
  track: (typeof TRACKS)[number];
  trackIndex: number;
  playing: boolean;
  progress: number;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
};

const BgmPlayerContext = createContext<BgmPlayerValue | null>(null);

export function BgmPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = TRACKS[trackIndex];

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  const next = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextIndex = (trackIndex + 1) % TRACKS.length;
    audio.pause();
    audio.src = TRACKS[nextIndex].src;
    audio.load();
    setTrackIndex(nextIndex);
    setProgress(0);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  const updateProgress = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  return (
    <BgmPlayerContext.Provider value={{ track, trackIndex, playing, progress, togglePlay, next }}>
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={updateProgress}
        onEnded={() => void next()}
      />
      {children}
    </BgmPlayerContext.Provider>
  );
}

export function useBgmPlayer() {
  const context = useContext(BgmPlayerContext);
  if (!context) throw new Error("useBgmPlayer must be used inside BgmPlayerProvider");
  return context;
}
