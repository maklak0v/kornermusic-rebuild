import { useRef } from 'react';
import { KollabDice } from '@/components/KollabDice';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { musicLinks, socialMediaLinks } from '@/data/social';
import { BrandIcon } from '@/components/BrandIcons';
import { FadeIn } from '@/components/SectionLabel';
import { useReducedMotion } from '@/hooks/useUi';

const FINAL_IMG = 'https://images.pexels.com/photos/9694198/pexels-photo-9694198.jpeg?auto=compress&cs=tinysrgb&w=1800';

const CONTACT_EMAIL = 'd.mo7oko@gmail.com';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);

  return (
    <footer ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* Background */}
      <motion.div
        style={reduced ? {} : { y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <img
          src={FINAL_IMG}
          alt=""
          className="h-full w-full object-cover opacity-30 grayscale-[60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/50 to-ink" />
      </motion.div>

      {/* Final statement */}
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <motion.div style={reduced ? {} : { y: textY }}>
          <FadeIn>
            <p className="font-nemoy-thin text-[21px] uppercase tracking-extreme text-ash">
              06 — END
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2 className="mt-8 font-nemoy-med text-[35px] uppercase leading-tight tracking-wide text-bone sm:text-5xl md:text-6xl">
              this is only
              <br />
              the beginning.
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-6 font-nemoy-thin text-sm tracking-wide text-bone/40">
              the next transmission is already being created.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="mt-10 font-nemoy-thin text-[30px] uppercase tracking-ultra text-ash">
              music for the moments that stay with you.
            </p>
          </FadeIn>
        </motion.div>
      </div>

      {/* Newsletter + links */}
      <div className="relative mx-auto max-w-[1600px] px-5 pb-12 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-t border-bone/10 pt-12 md:grid-cols-3">
          {/* Music platforms */}
          <div>
            <p className="font-nemoy-thin text-xs uppercase tracking-ultra text-ash">
              MUSICA
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              {musicLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border-b border-bone/5 py-2 font-nemoy-thin text-sm uppercase tracking-wide text-bone/60 transition-colors hover:text-bone"
                >
                  <BrandIcon name={s.icon} size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-bone" />
                  {s.label}
                  <ArrowUpRight size={12} className="ml-auto text-bone/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Social media */}
          <div>
            <p className="font-nemoy-thin text-xs uppercase tracking-ultra text-ash">
              MEDIA
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              {socialMediaLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border-b border-bone/5 py-2 font-nemoy-thin text-sm uppercase tracking-wide text-bone/60 transition-colors hover:text-bone"
                >
                  <BrandIcon name={s.icon} size={18} className="shrink-0 text-bone/40 transition-colors group-hover:text-bone" />
                  {s.label}
                  <ArrowUpRight size={12} className="ml-auto text-bone/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-nemoy-thin text-xs uppercase tracking-ultra text-ash">
              CONTACT
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 block font-nemoy-thin text-sm text-bone/60 transition-colors hover:text-bone"
            >
              d.mo7oko@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-nemoy-med text-sm uppercase tracking-ultra text-bone">
            KORNER
          </p>
          <KollabDice />
        </div>
      </div>
    </footer>
  );
}
