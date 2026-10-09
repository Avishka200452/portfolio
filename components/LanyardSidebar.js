'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
  loading: () => null,
});

export default function LanyardSidebar() {
  const pathname   = usePathname();
  const [visible,  setVisible]  = useState(true);   // start visible immediately
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isWide,   setIsWide]   = useState(false);
  const observerRef = useRef(null);

  const isAdmin = pathname?.startsWith('/admin');

  // Desktop check
  useEffect(() => {
    if (isAdmin) return;
    const check = () => setIsWide(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [isAdmin]);

  // Observer: show while #hero OR #about is in view (works on scroll up + down)
  useEffect(() => {
    if (isAdmin) return;

    const startObserver = () => {
      const hero  = document.getElementById('hero');
      const about = document.getElementById('about');
      if (!hero && !about) return false;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // any part of hero or about is visible → show lanyard
          const anyVisible = entries.some(e => e.isIntersecting);
          setVisible(anyVisible);
        },
        { threshold: 0.01 }  // fires as soon as 1% is visible
      );

      if (hero)  observerRef.current.observe(hero);
      if (about) observerRef.current.observe(about);
      return true;
    };

    // Try immediately, retry if DOM not ready yet
    if (!startObserver()) {
      const t = setTimeout(startObserver, 500);
      return () => clearTimeout(t);
    }

    return () => observerRef.current?.disconnect();
  }, [isAdmin]);

  // Fetch profile photo from Supabase
  useEffect(() => {
    if (isAdmin) return;
    supabase
      .from('portfolio_meta')        // ← correct table name
      .select('photo_url')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.photo_url) setPhotoUrl(data.photo_url);
      })
      .catch(() => {});
  }, [isAdmin]);

  // Never render on admin pages or mobile
  if (isAdmin || !isWide) return null;

  // KEY: use opacity/pointer-events — NEVER unmount while in hero/about range.
  // Unmounting destroys the WebGL context and physics engine.
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        right:         0,
        width:         'clamp(440px, 52vw, 800px)',
        height:        '100vh',
        zIndex:        6,
        background:    '#0a0a0f',   // exact same as page bg → panel is invisible
        opacity:       visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition:    'opacity 0.5s ease',
      }}
    >
      <Lanyard
        position={[0, 0, 16]}
        gravity={[0, -40, 0]}
        fov={16}
        transparent={false}
        frontImage={photoUrl}
        imageFit="cover"
        lanyardWidth={1.2}
      />
    </div>
  );
}

