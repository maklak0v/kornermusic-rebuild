import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { musicLinks, socialMediaLinks } from '@/data/social';

export function HeaderLinksDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 font-nemoy-thin text-[16px] uppercase tracking-[0.22em] text-bone/80 transition-colors duration-300 hover:text-bone xl:text-[17px]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        LINKS
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-4 w-[480px] max-w-[calc(100vw-2rem)] z-[300]"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-bone/10 bg-ink/95 backdrop-blur-xl shadow-2xl">
              <LinkColumn title="MUSIC" links={musicLinks} />
              <LinkColumn title="MEDIA" links={socialMediaLinks} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: typeof musicLinks;
}) {
  return (
    <div className="bg-ink/95 p-5">
      <p className="mb-3 font-nemoy-thin text-[11px] uppercase tracking-[0.3em] text-ash">
        {title}
      </p>
      <div className="flex flex-col gap-1">
        {links.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 font-nemoy-thin text-sm uppercase tracking-wide text-bone/70 transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <BrandIcon
              name={s.icon}
              size={18}
              className="shrink-0 text-bone/40 transition-colors group-hover:text-bone"
            />
            <span className="flex-1">{s.label}</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="text-bone/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export function MobileLinksAccordion() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between font-nemoy-thin text-[24px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-ember"
        aria-expanded={expanded}
      >
        LINKS
        <ChevronDown
          size={22}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 gap-6 pl-1 sm:grid-cols-2 sm:gap-8">
              <MobileLinkColumn title="MUSIC" links={musicLinks} />
              <MobileLinkColumn title="MEDIA" links={socialMediaLinks} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLinkColumn({
  title,
  links,
}: {
  title: string;
  links: typeof musicLinks;
}) {
  return (
    <div>
      <p className="mb-2 font-nemoy-thin text-[11px] uppercase tracking-[0.3em] text-ash">
        {title}
      </p>
      <div className="flex flex-col gap-1">
        {links.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg px-2 py-3 font-nemoy-thin text-sm uppercase tracking-wide text-bone/70 transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <BrandIcon
              name={s.icon}
              size={20}
              className="shrink-0 text-bone/40 transition-colors group-hover:text-bone"
            />
            <span className="flex-1">{s.label}</span>
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="text-bone/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
