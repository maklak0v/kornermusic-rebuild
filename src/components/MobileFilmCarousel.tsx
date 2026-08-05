import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, ArrowRight, Ban, X } from 'lucide-react';
import { videos, type VideoItem } from '@/data/videos';
import { useReducedMotion } from '@/hooks/useUi';

function youtubeEmbedUrl(url: string): string {
  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (idMatch) return `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0`;
  return url;
}

export function MobileFilmCarousel() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);

  const active = videos[activeIndex];

  const openModal = useCallback((video: VideoItem) => {
    if (video.unavailable) return;
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen, closeModal]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(videos.length - 1, i));
      setActiveIndex(clamped);
      const el = trackRef.current;
      if (el) {
        el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
      }
    },
    [],
  );

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || isDragging.current) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIndex && idx >= 0 && idx < videos.length) {
      setActiveIndex(idx);
    }
  }, [activeIndex]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = trackRef.current;
    if (!el) return;
    const threshold = el.clientWidth * 0.2;
    if (dragDelta.current < -threshold) {
      goTo(activeIndex + 1);
    } else if (dragDelta.current > threshold) {
      goTo(activeIndex - 1);
    } else {
      goTo(activeIndex);
    }
    dragDelta.current = 0;
  };

  return (
    <div className="px-4">
      {/* Single-slide carousel */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: 'pan-x' }}
      >
        {videos.map((video, i) => (
          <div
            key={video.id}
            className="w-full shrink-0 snap-center"
          >
            <FilmSlide
              video={video}
              active={i === activeIndex}
              reduced={reduced}
              onOpen={() => openModal(video)}
            />
          </div>
        ))}
      </div>

      {/* Compact counter + arrows */}
      <div className="mt-5 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous film"
          className="flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 disabled:border-bone/10 disabled:text-bone/20 border-bone/25 text-bone/70 active:border-bone/60 active:text-bone"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>

        <span className="font-nemoy-thin text-[11px] uppercase tracking-ultra text-bone/60 tabular-nums">
          {String(activeIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === videos.length - 1}
          aria-label="Next film"
          className="flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 disabled:border-bone/10 disabled:text-bone/20 border-bone/25 text-bone/70 active:border-bone/60 active:text-bone"
        >
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 px-4"
            onClick={closeModal}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close video"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone/70 transition-colors hover:border-bone/60 hover:text-bone"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div
              className="relative w-[calc(100vw-32px)] max-w-[900px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full overflow-hidden bg-ink-800" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  src={youtubeEmbedUrl(active.youtubeUrl)}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <p className="mt-3 font-nemoy-thin text-[11px] uppercase tracking-ultra text-bone/50">
                {active.title} — {active.duration}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilmSlideProps {
  video: VideoItem;
  active: boolean;
  reduced: boolean;
  onOpen: () => void;
}

function FilmSlide({ video, active, reduced, onOpen }: FilmSlideProps) {
  return (
    <div className="px-1">
      <motion.button
        type="button"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={onOpen}
        aria-label={video.unavailable ? `${video.title} — unavailable` : `Play ${video.title}`}
        className="group relative block w-full overflow-hidden bg-ink-800"
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
          <img
            src={video.featuredImage}
            alt={video.title}
            className="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-active:scale-105"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/25" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500 group-active:scale-110 ${
                video.unavailable
                  ? 'border-bone/15 opacity-50'
                  : 'border-bone/40 group-active:border-bone/70'
              }`}
              style={{ zIndex: 10 }}
            >
              {video.unavailable ? (
                <Ban size={24} className="text-bone/40" strokeWidth={1.5} />
              ) : (
                <Play size={26} className="ml-1 text-bone" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Metadata overlay — minimal */}
          <div className="absolute bottom-0 left-0 flex w-full flex-col gap-1.5 p-4">
            <div className="flex items-center gap-2">
              <span
                className={`border px-2 py-0.5 font-nemoy-thin text-[8px] uppercase tracking-ultra ${
                  video.unavailable ? 'border-ember/40 text-ember/80' : 'border-bone/30 text-bone'
                }`}
              >
                {video.unavailable ? (video.statusText ?? 'UNAVAILABLE') : video.category}
              </span>
              <span className="font-nemoy-thin text-[9px] uppercase tracking-ultra text-bone/60">
                {video.beta} · {video.duration}
              </span>
            </div>
            <h3 className="font-nemoy-black text-2xl uppercase leading-none tracking-tight text-bone">
              {video.title}
            </h3>
            <p className="font-nemoy-thin text-[11px] italic leading-relaxed text-bone/60">
              {video.description}
            </p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
