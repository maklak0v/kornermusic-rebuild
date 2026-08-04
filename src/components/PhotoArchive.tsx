import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { photos, type Photo } from '@/data/photos';
import { SectionLabel, FadeIn } from '@/components/SectionLabel';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { useCursor } from '@/components/CustomCursor';
import { useReducedMotion } from '@/hooks/useUi';

export function PhotoArchive() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cursor = useCursor();
  const reduced = useReducedMotion();

  const onPhotoEnter = () => { cursor?.setLabel('VIEW'); cursor?.setVariant('view'); };
  const onPhotoLeave = () => { cursor?.setLabel(null); cursor?.setVariant('default'); };

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const nextPhoto = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));
  const prevPhoto = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  const currentPhoto = lightboxIdx !== null ? photos[lightboxIdx] : null;

  return (
    <section ref={sectionRef} id="photos" className="relative overflow-hidden bg-ink py-20 sm:py-28 md:py-36">
      {/* Header */}
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8">
        <SectionLabel index="04" title="ART" />
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FadeIn delay={0.15}>
            <p className="font-nemoy-thin text-[16px] leading-relaxed text-ash sm:whitespace-nowrap sm:text-[29px] sm:leading-relaxed">
              moments that never asked to be remembered — but stayed anyway.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Mobile: single column grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 px-5 sm:hidden">
        {photos.map((photo, i) => (
          <PhotoCardMobile
            key={photo.id}
            photo={photo}
            onClick={() => openLightbox(i)}
            reduced={reduced}
          />
        ))}
      </div>

      {/* Desktop: asymmetrical 12-col grid */}
      <div className="relative mt-16 hidden grid-cols-12 gap-3 px-5 sm:grid sm:gap-4 sm:px-8 lg:gap-6">
        {/* Row 1: large featured portrait + overlapping landscape */}
        <PhotoTile
          photo={photos[0]}
          className="col-span-5 row-span-2"
          aspect="aspect-[3/4]"
          onClick={() => openLightbox(0)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
          offset={-40}
        />
        <PhotoTile
          photo={photos[1]}
          className="col-span-4 mt-24"
          aspect="aspect-[4/3]"
          onClick={() => openLightbox(1)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
        <PhotoTile
          photo={photos[2]}
          className="col-span-3"
          aspect="aspect-square"
          onClick={() => openLightbox(2)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />

        {/* Row 2: portrait + portrait beside it, offset */}
        <PhotoTile
          photo={photos[3]}
          className="col-span-3 mt-8"
          aspect="aspect-[3/4]"
          onClick={() => openLightbox(3)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
        <PhotoTile
          photo={photos[4]}
          className="col-span-4 mt-8"
          aspect="aspect-[3/4]"
          onClick={() => openLightbox(4)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
        {/* Row 3: full-width landscape */}
        <PhotoTile
          photo={photos[5]}
          className="col-span-12 mt-8"
          aspect="aspect-[21/9]"
          onClick={() => openLightbox(5)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />

        {/* Row 4 */}
        <PhotoTile
          photo={photos[6]}
          className="col-span-5 md:col-span-5 mt-6"
          aspect="aspect-[3/4]"
          onClick={() => openLightbox(6)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
        <PhotoTile
          photo={photos[7]}
          className="col-span-3 md:col-span-3 mt-6 md:mt-16"
          aspect="aspect-[3/4]"
          onClick={() => openLightbox(7)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
        <PhotoTile
          photo={photos[8]}
          className="col-span-4 md:col-span-4 mt-6 md:mt-16"
          aspect="aspect-[3/4]"
          rotate90
          onClick={() => openLightbox(8)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />

        {/* Row 5: full-width cinematic finale */}
        <PhotoTile
          photo={photos[9]}
          className="col-span-12 mt-16"
          aspect="aspect-[21/9]"
          onClick={() => openLightbox(9)}
          onEnter={onPhotoEnter}
          onLeave={onPhotoLeave}
          reduced={reduced}
        />
      </div>

      <PhotoLightbox
        photo={currentPhoto}
        onClose={closeLightbox}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />
    </section>
  );
}

/* ============================================================
   MOBILE PHOTO CARD — single column, full width, readable
   ============================================================ */
interface PhotoCardMobileProps {
  photo: Photo;
  onClick: () => void;
  reduced: boolean;
}

function PhotoCardMobile({ photo, onClick, reduced }: PhotoCardMobileProps) {
  return (
    <motion.button
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative w-full overflow-hidden bg-ink-800"
      aria-label={`Open photo: ${photo.caption}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <img
          src={photo.src}
          alt={photo.caption}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-left">
          <p className="font-nemoy-thin text-[18px] uppercase tracking-[0.15em] text-bone/95">
            {photo.title}
          </p>
          <p className="mt-1 font-nemoy-thin text-[14px] uppercase tracking-[0.1em] text-bone/70">
            {photo.location}{photo.location && photo.date ? ' · ' : ''}{photo.date}
          </p>
          <p className="mt-1.5 font-nemoy-thin text-[14px] leading-relaxed text-bone/65">
            {photo.caption}
          </p>
        </div>

        {photo.downloadable && (
          <div className="absolute right-3 top-3">
            <span className="border border-bone/30 bg-ink/50 px-2 py-1 font-nemoy-thin text-[10px] uppercase tracking-[0.15em] text-bone backdrop-blur-sm">
              FREE
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ============================================================
   DESKTOP PHOTO TILE — 12-col grid with parallax
   ============================================================ */
interface PhotoTileProps {
  photo: Photo;
  className: string;
  aspect: string;
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
  reduced: boolean;
  offset?: number;
  rotate90?: boolean;
}

function PhotoTile({ photo, className, aspect, onClick, onEnter, onLeave, reduced, offset = 0, rotate90 = false }: PhotoTileProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset * 0.5, -offset * 0.5]);

  return (
    <motion.button
      ref={ref}
      style={reduced ? {} : { y }}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      whileInView={reduced ? {} : { opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden bg-ink-800 ${className}`}
      aria-label={`Open photo: ${photo.caption}`}
    >
      <div className={`relative w-full ${aspect} h-full`}>
        <img
          src={photo.src}
          alt={photo.caption}
          loading="lazy"
          className={`h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:grayscale-0 ${rotate90 ? 'rotate-90 scale-150 group-hover:scale-[1.58]' : 'group-hover:scale-105'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

        {/* Metadata — bottom left, padded away from edges */}
        <div className="absolute bottom-0 left-0 p-4 sm:p-5 text-left">
          <p className="font-nemoy-thin text-[21px] uppercase tracking-ultra text-bone/90 sm:text-[23px]">
            {photo.title}
          </p>
          <p className="mt-1.5 font-nemoy-thin text-[19px] uppercase leading-relaxed tracking-wide text-bone/70 sm:text-[21px]">
            {photo.location}{photo.location && photo.date ? ' · ' : ''}{photo.date}
          </p>
          <p className="mt-1 font-nemoy-thin text-[19px] leading-relaxed text-bone/70 sm:text-[22px]">
            {photo.caption}
          </p>
        </div>

        {/* Download badge */}
        {photo.downloadable && (
          <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="border border-bone/30 bg-ink/50 px-2.5 py-1.5 font-nemoy-thin text-[19px] uppercase tracking-ultra text-bone backdrop-blur-sm sm:text-[20px]">
              FREE DOWNLOAD
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
