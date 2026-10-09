'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import DriftWall from '@/components/ui/DriftWall';
import { IconPin } from '@/components/ui/Icons';

export default function PhotoSection({ items }) {
  const [lightbox, setLightbox] = useState(null);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox]);

  if (!items?.length) return null;

  // DriftWall expects { image, title, href? } — map from Supabase shape
  const wallItems = items.map(item => ({
    image: item.image_url,
    title: item.title || '',
    // store original item so we can open lightbox on click
    _original: item,
  }));

  return (
    <section id="photography" className="section" style={{ paddingBottom: 50 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>STILL FRAMES · 35MM ✦</span></FadeReveal>
          <ScrollReveal as="h2" containerClassName="section-title" style={{ opacity: 1, color: '#000000' }}>
            Through the <span className="accent-text">Lens</span>
          </ScrollReveal>
          <p className="section-sub" style={{ margin: '0 auto', opacity: 1, color: '#1a1a1a' }}>
            Monochrome &amp; visual captures &middot; Click to view full scale
          </p>
        </div>
      </div>

      {/* DriftWall — full viewport width, fixed height with seamless feather blend */}
      <div
        style={{
          position: 'relative',
          height: 680,
          width: '100%',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={e => {
          // Find clicked tile's data
          const tile = e.target.closest('[data-tile-id]');
          if (!tile) return;
          const tileId = tile.dataset.tileId;
          // tileId format: "col-copyIndex-itemIndex"
          const [col,,itemIndex] = tileId.split('-').map(Number);
          const colItems = [];
          items.forEach((it, i) => { if (i % 5 === col) colItems.push(it); });
          const clicked = colItems[itemIndex % colItems.length];
          if (clicked) setLightbox(clicked);
        }}
      >
        <DriftWall
          items={wallItems}
          columns={5}
          tileWidth={220}
          tileHeight={165}
          gap={16}
          radius={14}
          tilt={10}
          turn={-8}
          perspective={1300}
          depth={80}
          speed={32}
          direction="up"
          variance={0.35}
          parallax={0.5}
          pauseOnHover={false}
          lift={70}
          fade={0.65}
          dim={0.82}
          grayscale={true}
          overlayColor="transparent"
        />

        {/* Top smooth blend into header */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            background: 'linear-gradient(to bottom, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.5) 65%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Bottom smooth blend into page — dissolves any hard cutoffs completely */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 220,
            background: 'linear-gradient(to top, #FFFFFF 0%, rgba(255, 255, 255, 0.98) 28%, rgba(255, 255, 255, 0.82) 52%, rgba(255, 255, 255, 0.35) 78%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Left & Right edge blends */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 70,
            background: 'linear-gradient(to right, #FFFFFF 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 70,
            background: 'linear-gradient(to left, #FFFFFF 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      </div>

      {/* ── Fullscreen Photo Lightbox (Covers Navbar & In-Frame Details) ── */}
      {mounted && lightbox && createPortal(
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.90)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
            cursor: 'zoom-out',
            animation: 'modalFadeIn 0.22s ease-out',
          }}
        >
          {/* Screen Top-Right Close Button */}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              top: 20,
              right: 24,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Close (Esc)"
            aria-label="Close photo"
          >
            ✕
          </button>

          {/* Exact-Ratio Photo Container — No separate card box! */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '88vh',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#000000',
              boxShadow: '0 30px 100px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
            }}
          >
            {/* Photo Frame Top-Right Close Button */}
            <button
              type="button"
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Close (Esc)"
              aria-label="Close photo"
            >
              ✕
            </button>

            {/* Photo Image */}
            <img
              src={lightbox.image_url}
              alt={lightbox.title || 'Photo'}
              style={{
                maxWidth: '92vw',
                maxHeight: '88vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                background: '#000000',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* In-Frame Bottom Details Overlay (No separate box!) */}
            {(lightbox.title || lightbox.location || lightbox.description) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.70) 55%, rgba(0, 0, 0, 0.15) 85%, transparent 100%)',
                  padding: '45px 24px 22px',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Badge & Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      padding: '3px 9px',
                      borderRadius: 16,
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    35MM STILL FRAME
                  </span>

                  {lightbox.location && (
                    <span
                      style={{
                        fontSize: '0.76rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <IconPin size={13} color="#FFFFFF" />
                      <span>{lightbox.location}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                {lightbox.title && (
                  <h3
                    style={{
                      fontFamily: 'Gued, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.25,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {lightbox.title}
                  </h3>
                )}

                {/* Description */}
                {lightbox.description && (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'rgba(255, 255, 255, 0.82)',
                      lineHeight: 1.45,
                      margin: 0,
                      textShadow: '0 1px 6px rgba(0, 0, 0, 0.8)',
                      maxHeight: '3.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {lightbox.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
