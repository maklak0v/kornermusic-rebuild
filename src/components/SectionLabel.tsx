import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useUi';

interface SectionLabelProps {
  index: string;
  title: string;
  className?: string;
}

export function SectionLabel({ index, title, className = '' }: SectionLabelProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`flex items-baseline gap-3 sm:gap-4 ${className}`}>
      <motion.span
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: -10 }}
        whileInView={reduced ? {} : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-nemoy-thin text-[44px] leading-none uppercase tracking-[0.25em] text-ash sm:text-[60px] md:text-[72px] lg:text-[80px]"
      >
        {index}
      </motion.span>
      <motion.span
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        whileInView={reduced ? {} : { opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-6 bg-bone/20 sm:w-8"
      />
      <motion.h2
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
        whileInView={reduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-nemoy-med text-[13px] uppercase tracking-[0.28em] text-bone sm:text-[15px] lg:text-base"
      >
        {title}
      </motion.h2>
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, y = 20, className = '' }: FadeInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
