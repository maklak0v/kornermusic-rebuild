import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, ArrowRight, Ban } from 'lucide-react';
import { videos, type VideoItem } from '@/data/videos';
import { SectionLabel, FadeIn } from '@/components/SectionLabel';
import { useCursor } from '@/components/CustomCursor';
import { useReducedMotion } from '@/hooks/useUi';

function openYoutube(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursor = useCursor();
  const reduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const active = videos[activeIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const titleX = useTransform(scrollYProgress, [0, 1], ['10%', '-25%']);

  const onVideoEnter = () => {
    cursor?.setLabel('PLAY');
    cursor?.setVariant('play');
  };
  const onVideoLeave = () => {
    cursor?.setLabel(null);
    cursor?.setVariant('default');
  };

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-thumb]');
    const amount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const selectIndex = (i: number) => {
    setActiveIndex(i);
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>('[data-thumb]')[i];
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="video"
      className="relative overflow-hidden bg-ink-950 py-28 sm:py-36"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8">
        <SectionLabel index="05" title="TRANSMISSIONS" />
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FadeIn>
            <motion.h2
              style={reduced ? {} : { x: titleX }}
              className="font-nemoy-thin text-5xl uppercase leading-none tracking-tight text-bone sm:text-8xl"
            >
              FILM
            </motion.h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="max-w-xs font-nemoy-thin text-sm leading-relaxed text-ash">
              every version is part of the story.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Featured video */}
      <div className="relative mt-14 px-5 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.button
            key={active.id}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={active.unavailable ? undefined : () => openYoutube(active.youtubeUrl)}
            onMouseEnter={active.unavailable ? undefined : onVideoEnter}
            onMouseLeave={active.unavailable ? undefined : onVideoLeave}
            className="group relative block w-full overflow-hidden"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-800 sm:aspect-[21/9]">
              <img
                src={active.featuredImage}
                alt={active.title}
                className={`h-full w-full object-cover grayscale-[40%] transition-all duration-[1.2s] ${active.unavailable ? 'grayscale' : 'group-hover:grayscale-0 group-hover:scale-105'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500 sm:h-20 sm:w-20 ${active.unavailable ? 'border-bone/15 opacity-50' : 'border-bone/30 group-hover:scale-110 group-hover:border-bone/60'}`}>
                  {active.unavailable ? (
                    <span className="font-nemoy-thin text-[7px] uppercase tracking-ultra text-bone/40">UNAVAILABLE</span>
                  ) : (
                    <Play size={20} className="ml-1 text-bone" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 flex w-full flex-col gap-2 p-5 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className={`border px-2 py-0.5 font-nemoy-thin text-[8px] uppercase tracking-ultra ${active.unavailable ? 'border-ember/40 text-ember/80' : 'border-bone/30 text-bone'}`}>
                    {active.unavailable ? (active.statusText ?? 'UNAVAILABLE') : active.category}
                  </span>
                  <span className="font-nemoy-thin text-[9px] uppercase tracking-ultra text-bone/60">
                    {active.beta} · {active.duration}
                  </span>
                </div>
                <h3 className="font-nemoy-black text-3xl uppercase leading-none tracking-tight text-bone sm:text-5xl">
                  {active.title}
                </h3>
                <p className="font-nemoy-thin text-xs italic leading-relaxed text-bone/60 sm:text-sm">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <p className="max-w-lg font-nemoy-thin text-xs leading-relaxed text-bone/50 sm:text-sm">
                  {active.description}
                </p>
              </div>
            </div>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Thumbnail carousel */}
      <div className="relative mt-8 px-5 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <CarouselArrow
            dir="left"
            disabled={!canLeft}
            onClick={() => scrollByCards(-1)}
          />

          <div
            ref={trackRef}
            className="flex flex-1 gap-4 overflow-x-auto pb-4 [scrollbar-width:none] snap-x snap-mandatory sm:gap-6 [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: 'pan-x' }}
          >
            {videos.map((video, i) => (
              <ThumbnailCard
                key={video.id}
                video={video}
                index={i}
                active={i === activeIndex}
                onClick={() => selectIndex(i)}
                onEnter={onVideoEnter}
                onLeave={onVideoLeave}
                reduced={reduced}
              />
            ))}
          </div>

          <CarouselArrow
            dir="right"
            disabled={!canRight}
            onClick={() => scrollByCards(1)}
          />
        </div>
      </div>
    </section>
  );
}

interface CarouselArrowProps {
  dir: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}

function CarouselArrow({ dir, disabled, onClick }: CarouselArrowProps) {
  const Icon = dir === 'left' ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Previous films' : 'Next films'}
      className="group/arrow hidden shrink-0 items-center justify-center transition-opacity duration-300 sm:flex"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
          disabled
            ? 'border-bone/10 text-bone/20'
            : 'border-bone/25 text-bone/70 hover:border-bone/60 hover:text-bone'
        }`}
      >
        <Icon size={16} strokeWidth={1.5} />
      </span>
    </button>
  );
}

interface ThumbnailCardProps {
  video: VideoItem;
  index: number;
  active: boolean;
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
  reduced: boolean;
}

function ThumbnailCard({
  video,
  index,
  active,
  onClick,
  onEnter,
  onLeave,
  reduced,
}: ThumbnailCardProps) {
  return (
    <motion.button
      data-thumb
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative shrink-0 snap-start"
      style={{ width: 'min(78vw, 320px)' }}
    >
      <div
        className={`relative aspect-video w-full overflow-hidden bg-ink-800 transition-all duration-500 ${
          active
            ? 'ring-1 ring-bone/60 ring-offset-2 ring-offset-ink-950'
            : 'opacity-70 hover:opacity-100'
        }`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-70" />

        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/25 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
              <Play size={14} className="ml-0.5 text-bone" strokeWidth={1.5} />
            </div>
          </div>
        )}

        {active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-sm ${video.unavailable ? 'border-bone/15' : 'border-bone/50'}`}>
              {video.unavailable ? (
                <Ban size={16} className="text-bone/40" strokeWidth={1.5} />
              ) : (
                <Play size={16} className="ml-0.5 text-bone" strokeWidth={1.5} />
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-3">
          <p className="font-nemoy-thin text-[8px] uppercase tracking-ultra text-bone/60">
            {video.category}
          </p>
          <h4 className="mt-0.5 font-nemoy-med text-sm uppercase tracking-wide text-bone">
            {video.title}
          </h4>
        </div>
        <div className="absolute right-3 top-3">
          <span className="font-nemoy-thin text-[8px] uppercase tracking-ultra text-bone/50">
            {video.duration}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`font-nemoy-thin text-[9px] uppercase tracking-ultra transition-colors ${
            active ? 'text-bone' : 'text-ash'
          }`}
        >
          {video.beta}
        </span>
        <span
          className={`flex items-center gap-1 font-nemoy-thin text-[9px] uppercase tracking-ultra transition-colors ${
            active ? 'text-bone' : 'text-bone/40 group-hover:text-bone'
          }`}
        >
          {active ? 'NOW PLAYING' : 'SELECT'}
          <ArrowRight size={10} strokeWidth={1.5} />
        </span>
      </div>
    </motion.button>
  );
}
