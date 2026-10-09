'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import JellyRadio from '@/components/ui/JellyRadio';

const NAV_ITEMS = [
  { value: '#about', label: 'About' },
  { value: '#timeline', label: 'Timeline' },
  { value: '#work', label: 'Work' },
  { value: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const isClickingRef = useRef(false);

  // Track scroll position for navbar background blur & active section
  useEffect(() => {
    if (pathname && pathname.startsWith('/admin')) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      if (isClickingRef.current) return;

      // If user is at the top (Hero section), no nav item is active
      if (window.scrollY < 200) {
        setActiveNav('');
        return;
      }

      // If user has scrolled to the bottom of the page, activate Contact
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveNav('#contact');
        return;
      }

      // Check sections in reverse order of page appearance
      // Order from bottom to top: #contact, #work, #timeline, #about
      const sectionIds = ['#contact', '#work', '#timeline', '#about'];

      for (const id of sectionIds) {
        const el = document.querySelector(id);
        if (el) {
          // getBoundingClientRect().top + window.scrollY calculates accurate document Y,
          // avoiding offsetTop bugs caused by parent CSS transforms or FadeContent containers
          const sectionTop = el.getBoundingClientRect().top + window.scrollY - 160;
          if (window.scrollY >= sectionTop) {
            setActiveNav(id);
            return;
          }
        }
      }

      setActiveNav('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavChange = (value) => {
    setActiveNav(value);

    if (typeof window === 'undefined') return;

    if (window.location.pathname !== '/') {
      window.location.href = `/${value}`;
      return;
    }

    isClickingRef.current = true;
    const target = document.querySelector(value);
    if (target) {
      const topOffset = 75;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 900);
  };

  // Do not render navbar in admin panel
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const navLinkStyle = {
    color: 'rgba(0,0,0,0.55)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
    padding: '8px 0',
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        padding: scrolled ? '10px 0' : '18px 0',
        transition: 'padding 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div
        className="container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Brand / Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} aria-label="Home">
          <img
            src="/logo.png"
            alt="Logo"
            width={44}
            height={44}
            style={{
              height: 42,
              width: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12) rotate(-4deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
          />
        </Link>

        {/* Desktop Navigation with JellyRadio */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <JellyRadio
            items={NAV_ITEMS}
            value={activeNav}
            onChange={handleNavChange}
            chipColor="rgba(0, 0, 0, 0.04)"
            activeColor="#000000"
            textColor="rgba(0, 0, 0, 0.60)"
            activeTextColor="#ffffff"
            size="md"
            gap={6}
            radius={20}
            swell={0.16}
            barge={4}
            shrink={0.04}
            jelly={0.8}
            bounce={0.22}
            stagger={18}
            stiffness={540}
            ariaLabel="Portfolio Navigation"
          />
        </nav>

        {/* Desktop CTA */}
        <div className="desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavChange('#contact');
            }}
            className="btn-accent"
            style={{ padding: '9px 22px', fontSize: '0.82rem' }}
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', color: '#1a1a1a', padding: 8, cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 2,
                background: '#1a1a1a',
                borderRadius: 2,
                marginBottom: i < 2 ? 5 : 0,
                transform: open
                  ? i === 0
                    ? 'rotate(45deg) translateY(7px)'
                    : i === 2
                    ? 'rotate(-45deg) translateY(-7px)'
                    : 'none'
                  : 'none',
                opacity: open && i === 1 ? 0 : 1,
                transition: '0.3s ease',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(255, 255, 255, 0.96)',
          }}
        >
          {NAV_ITEMS.map((l) => (
            <a
              key={l.value}
              href={l.value}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                handleNavChange(l.value);
              }}
              style={{
                ...navLinkStyle,
                color: activeNav === l.value ? 'var(--accent)' : 'rgba(0,0,0,0.70)',
                fontWeight: activeNav === l.value ? 700 : 500,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-accent"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              handleNavChange('#contact');
            }}
            style={{ marginTop: 8 }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}

      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .desktop-cta {
          display: flex !important;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
            flex-direction: column;
          }
        }
      `}</style>
    </header>
  );
}
