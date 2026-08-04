import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScrolled } from '@/hooks/useUi';
import { KollabDice } from '@/components/KollabDice';
import { HeaderLinksDropdown, MobileLinksAccordion } from '@/components/HeaderLinksDropdown';

const NAV = [
  { label: 'STORY', href: '#story' },
  { label: 'MUSIC', href: '#music' },
  { label: 'MERCH', href: '#merch' },
  { label: 'ART', href: '#photos' },
  { label: 'FILM', href: '#video' },
];

export function Header() {
  const scrolled = useScrolled(60);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed left-0 right-0 top-0 z-[100] transition-all duration-700"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          backgroundColor: scrolled ? 'rgba(5,5,5,0.75)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(232,228,220,0.1)' : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-[1250px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
          {/* Logo */}
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-nemoy-med text-[16px] uppercase tracking-[0.28em] text-bone sm:text-[18px] lg:text-[22px]"
          >
            KORNER
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 lg:flex xl:gap-12">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNav(item.href);
                }}
                className="font-nemoy-thin text-[15px] uppercase tracking-[0.22em] text-bone/80 transition-colors duration-300 hover:text-bone xl:text-[17px]"
              >
                {item.label}
              </a>
            ))}

            {/* LINKS dropdown */}
            <HeaderLinksDropdown />
          </nav>

          {/* Kollab logo and mobile menu */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden lg:block">
              <KollabDice compact />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-bone/80 transition-colors hover:text-bone lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNav={handleNav}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  onNav,
}: {
  open: boolean;
  onClose: () => void;
  onNav: (href: string) => void;
}) {
  const items: {
    label: string;
    href: string;
    big?: boolean;
  }[] = [
    { label: 'KORNER', href: '#top', big: true },
    ...NAV,
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex flex-col bg-ink lg:hidden"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Mobile top bar */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <span className="font-nemoy-med text-[15px] uppercase tracking-[0.28em] text-bone">
              KORNER
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center text-bone/80 transition-colors hover:text-bone"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto px-5 pb-8 sm:px-6">
            {items.map((item, index) => (
              <motion.a
                key={`${item.label}-${item.href}`}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                onClick={(event) => {
                  if (item.href.startsWith('#')) {
                    event.preventDefault();
                    onNav(item.href);
                  }
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.06 + index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`font-nemoy-thin uppercase tracking-[0.18em] text-bone transition-colors hover:text-ember ${
                  item.big ? 'text-[32px]' : 'text-[22px]'
                }`}
              >
                {item.label}
              </motion.a>
            ))}

            {/* LINKS accordion */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.06 + items.length * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-2"
            >
              <MobileLinksAccordion />
            </motion.div>

            <motion.div
              key="kollab-dice"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.06 + (items.length + 1) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-4 flex justify-center"
            >
              <KollabDice compact />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
