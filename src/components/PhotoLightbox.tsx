import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '@/data/photos';
import { DownloadButton } from '@/components/DownloadButton';

interface PhotoLightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PhotoLightbox({ photo, onClose, onPrev, onNext }: PhotoLightboxProps) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/95 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-bone/60 transition-colors hover:text-bone sm:right-5 sm:top-5 sm:h-auto sm:w-auto"
            aria-label="Close"
          >
            <X size={24} strokeWidth={1.5} className="sm:h-[22px] sm:w-[22px]" />
          </button>

          {/* Prev / Next */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-bone/40 transition-colors hover:text-bone sm:left-6 sm:h-auto sm:w-auto"
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} strokeWidth={1} className="sm:h-[32px] sm:w-[32px]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-bone/40 transition-colors hover:text-bone sm:right-6 sm:h-auto sm:w-auto"
            aria-label="Next photo"
          >
            <ChevronRight size={28} strokeWidth={1} className="sm:h-[32px] sm:w-[32px]" />
          </button>

          {/* Image + metadata */}
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] max-w-[90vw] flex-col items-center"
          >
            <div className="relative max-h-[60vh] overflow-hidden sm:max-h-[75vh]">
              <img
                src={photo.src}
                alt={photo.caption}
                className={`max-h-[60vh] w-auto object-contain sm:max-h-[75vh] ${photo.rotate90 ? 'rotate-90 scale-[1.34]' : ''} ${photo.orientation === 'portrait' ? 'max-w-[85vw]' : 'max-w-[90vw]'}`}
              />
            </div>

            {/* Metadata bar */}
            <div className="mt-4 flex w-full flex-col items-start gap-3 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="flex flex-col gap-1 text-left">
                <span className="font-nemoy-thin text-[14px] uppercase tracking-[0.2em] text-ash sm:text-[17px] sm:tracking-ultra">
                  {photo.title} · {photo.date}
                </span>
                <span className="font-nemoy-thin text-[15px] text-bone/70 sm:text-[19px]">
                  {photo.caption}
                </span>
                <span className="font-nemoy-thin text-[12px] uppercase tracking-[0.2em] text-ash sm:text-[15px] sm:tracking-ultra">
                  {photo.location} · {photo.photographer} · {photo.resolution}
                </span>
              </div>
              {photo.downloadable && <DownloadButton photo={photo} variant="standalone" />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
