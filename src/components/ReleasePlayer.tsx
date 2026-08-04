import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { Release } from '@/data/releases';

interface ReleasePlayerProps {
  release: Release;
}

export function ReleasePlayer({ release }: ReleasePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const rafRef = useRef<number>(0);

  const playingRef = useRef(false);
  const seekingRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  const startRaf = useCallback(() => {
    const update = () => {
      const audio = audioRef.current;
      if (!audio || !playingRef.current || seekingRef.current) return;
      setCurrent(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
      rafRef.current = requestAnimationFrame(update);
    };
    cancelAnimationFrame(rafRef.current);
    update();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !release.previewAudio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      playingRef.current = false;
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
      cancelAnimationFrame(rafRef.current);
    };
    const onPause = () => {
      if (seekingRef.current) return;
      playingRef.current = false;
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };
    const onPlay = () => {
      if (seekingRef.current) return;
      playingRef.current = true;
      setPlaying(true);
      startRaf();
    };
    const onSeeked = () => {
      if (seekingRef.current) return;
      if (wasPlayingRef.current) {
        wasPlayingRef.current = false;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('seeked', onSeeked);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('seeked', onSeeked);
      cancelAnimationFrame(rafRef.current);
    };
  }, [release.previewAudio, startRaf]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const seekTo = useCallback((clientX: number) => {
    const audio = audioRef.current;
    const el = waveformRef.current;
    if (!audio || !el || !duration) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setProgress(pct * 100);
    setCurrent(pct * duration);
  }, [duration]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekingRef.current = true;
    wasPlayingRef.current = playingRef.current;
    audio.pause();
    seekTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!seekingRef.current) return;
    seekTo(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!seekingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    seekingRef.current = false;
    if (wasPlayingRef.current) {
      audioRef.current?.play().catch(() => {});
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      audio.currentTime = Math.min(duration, audio.currentTime + 5);
    }
  };

  const onVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pct;
    setVolume(pct);
    setMuted(pct === 0);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const bars = Array.from({ length: 48 }, (_, i) => {
    const seed = release.id.charCodeAt(0) + i;
    return 20 + ((seed * 37) % 60);
  });

  if (!release.previewAudio) return null;

  return (
    <div className="w-full">
      <audio ref={audioRef} src={release.previewAudio} preload="metadata" />

      {/* Waveform / progress */}
      <div className="group relative">
        <div
          ref={waveformRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(current)}
          className="flex h-12 cursor-pointer items-center gap-[2px] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-bone/30"
        >
          {bars.map((h, i) => {
            const active = (i / bars.length) * 100 <= progress;
            return (
              <div
                key={i}
                className="flex-1 transition-colors duration-150"
                style={{
                  height: `${h}%`,
                  backgroundColor: active ? 'rgba(232,228,220,0.7)' : 'rgba(232,228,220,0.15)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={14} strokeWidth={1.5} /> : <Play size={14} strokeWidth={1.5} className="ml-0.5" />}
          </button>
          <span className="timestamp font-nemoy-thin text-[20px] uppercase tracking-wide text-bone/50">
            {fmt(current)} / {fmt(duration)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="text-bone/40 transition-colors hover:text-bone"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
          </button>
          <div
            onClick={onVolume}
            className="hidden h-1 w-16 cursor-pointer bg-bone/15 sm:block"
          >
            <div className="h-full bg-bone/60" style={{ width: `${muted ? 0 : volume * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
