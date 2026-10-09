'use client';
import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import AccordionGallery from '@/components/ui/AccordionGallery';

// ── Group items into albums by client field ──────────────────────────────
function buildAlbums(items) {
  const map = {};
  const standalone = [];

  (items || []).forEach(item => {
    const key = item.client?.trim();
    if (key) {
      if (!map[key]) map[key] = [];
      map[key].push(item);
    } else {
      standalone.push(item);
    }
  });

  return { albumMap: map, standalone };
}

// ── Album modal (all posts in a campaign) ────────────────────────────────
function AlbumModal({ name, posts, onClose, onPostClick }) {
  return (
    <div
      onClick={onClose}
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
        padding: '30px 20px',
        overflowY: 'auto',
        cursor: 'zoom-out',
        animation: 'modalFadeIn 0.22s ease-out',
      }}
    >
      {/* Screen Top-Right Close Button */}
      <button
        type="button"
        onClick={onClose}
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
        aria-label="Close album"
      >
        ✕
      </button>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 20,
          padding: '32px 36px',
          margin: 'auto',
          background: 'rgba(20, 20, 25, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.85)',
          cursor: 'default',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h3 style={{
              fontFamily: 'Gued, sans-serif', fontWeight: 700,
              fontSize: '1.6rem', color: '#fff', marginBottom: 6,
            }}>{name}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem' }}>
              {posts.length} post{posts.length !== 1 ? 's' : ''} in this campaign &middot; Click to expand
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF', width: 40, height: 40, borderRadius: '50%',
              cursor: 'pointer', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#000000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#FFFFFF'; }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Posts grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 16,
        }}>
          {posts.map(post => (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              style={{
                cursor: 'pointer',
                borderRadius: 14,
                overflow: 'hidden',
                aspectRatio: '1080 / 1350',
                background: '#000000',
                border: '1px solid rgba(255,255,255,0.12)',
                position: 'relative',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'var(--accent, #CFAA0A)';
                const ov = e.currentTarget.querySelector('.post-overlay');
                if (ov) ov.style.opacity = '1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                const ov = e.currentTarget.querySelector('.post-overlay');
                if (ov) ov.style.opacity = '0';
              }}
            >
              {post.image_url
                ? <img src={post.image_url} alt={post.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🖼️</div>
              }
              <div
                className="post-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 75%)',
                  opacity: 0,
                  transition: 'opacity 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 16,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3 }}>{post.title}</div>
                {post.client && (
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', marginTop: 4, fontWeight: 500 }}>
                    {post.client}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Full post lightbox (Exact Ratio & In-Poster Overlay — Covers Navbar) ──
function Lightbox({ item, onClose }) {
  return (
    <div
      onClick={onClose}
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
        onClick={onClose}
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
        aria-label="Close image"
      >
        ✕
      </button>

      {/* Exact 1080x1350 (4:5) Poster Container — No separate card box! */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          height: 'min(88vh, 850px)',
          width: 'auto',
          aspectRatio: '1080 / 1350',
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
        {/* Poster Frame Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
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
          aria-label="Close image"
        >
          ✕
        </button>

        {/* Poster Image */}
        <img
          src={item.image_url}
          alt={item.title || 'Poster'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            background: '#000000',
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* In-Frame Bottom Details Overlay (No separate box!) */}
        {(item.title || item.description || item.client || item.link) && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.70) 55%, rgba(0, 0, 0, 0.15) 85%, transparent 100%)',
              padding: '45px 22px 22px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Tag / Client */}
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
                1080×1350 POSTER
              </span>

              {item.client && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'rgba(255, 255, 255, 0.80)',
                    fontWeight: 500,
                  }}
                >
                  Client: {item.client}
                </span>
              )}
            </div>

            {/* Title */}
            {item.title && (
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
                {item.title}
              </h3>
            )}

            {/* Description */}
            {item.description && (
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
                {item.description}
              </p>
            )}

            {/* External Link */}
            {item.link && (
              <div style={{ marginTop: 4 }}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    pointerEvents: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--accent, #CFAA0A)',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '6px 16px',
                    borderRadius: 20,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <span>View Post ↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────
export default function SocialSection({ items }) {
  const [openAlbum,    setOpenAlbum]    = useState(null); // album name string
  const [lightboxItem, setLightboxItem] = useState(null);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when any modal is open
  useEffect(() => {
    if (!openAlbum && !lightboxItem) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxItem) setLightboxItem(null);
        else if (openAlbum) setOpenAlbum(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openAlbum, lightboxItem]);

  const { albumMap, standalone } = useMemo(() => buildAlbums(items), [items]);
  const albumEntries = Object.entries(albumMap); // [[name, posts[]], ...]

  if (!items?.length) return null;

  // Build accordion items — one per album
  const accordionItems = albumEntries.map(([name, posts]) => ({
    image: posts[0]?.image_url || '',
    label: name,
    count: posts.length,
    alt:   name,
  }));

  const handlePanelClick = (index) => {
    const [name] = albumEntries[index];
    setOpenAlbum(name);
  };

  const handlePostClick = (post) => {
    setOpenAlbum(null);
    setLightboxItem(post);
  };

  return (
    <section id="social" className="section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>Curated social media campaigns ✦</span></FadeReveal>
          <ScrollReveal as="h2" containerClassName="section-title" style={{ opacity: 1, color: '#000000' }}>
            Social Media <span className="accent-text">Posters</span>
          </ScrollReveal>
          <p className="section-sub" style={{ margin: '0 auto', opacity: 1, color: '#1a1a1a' }}>
            Edited using Adobe Photoshop &middot; Optimized for Instagram, Facebook, and LinkedIn
          </p>
        </div>

        {/* Accordion Gallery — album covers */}
        {accordionItems.length > 0 && (
          <AccordionGallery
            items={accordionItems}
            defaultIndex={0}
            accentColor="#000000"
            overlayColor="#000000"
            textColor="#ffffff"
            height={550}
            gap={10}
            radius={16}
            expandRatio={0.52}
            orientation="horizontal"
            duration={0.55}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            trigger="hover"
            showLabels={true}
            grayscale={true}
            onPanelClick={handlePanelClick}
          />
        )}

        {/* Standalone posts (no album) */}
        {standalone.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{
              fontSize: '0.72rem', letterSpacing: '0.12em',
              color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase',
              marginBottom: 20, paddingBottom: 12,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
              Individual Posters (1080×1350)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 16,
            }}>
              {standalone.map(item => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 14,
                    overflow: 'hidden',
                    aspectRatio: '1080 / 1350',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.18)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)';
                    const ov = e.currentTarget.querySelector('.post-overlay');
                    if (ov) ov.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                    const ov = e.currentTarget.querySelector('.post-overlay');
                    if (ov) ov.style.opacity = '0';
                  }}
                >
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🖼️</div>
                  }
                  <div
                    className="post-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 45%, transparent 70%)',
                      opacity: 0,
                      transition: 'opacity 0.25s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: 16,
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3 }}>{item.title}</div>
                    {item.client && (
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', marginTop: 4, fontWeight: 500 }}>
                        {item.client}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Album modal — portaled to document.body to cover navbar */}
      {mounted && openAlbum && createPortal(
        <AlbumModal
          name={openAlbum}
          posts={albumMap[openAlbum]}
          onClose={() => setOpenAlbum(null)}
          onPostClick={handlePostClick}
        />,
        document.body
      )}

      {/* Post lightbox — portaled to document.body to cover navbar */}
      {mounted && lightboxItem && createPortal(
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />,
        document.body
      )}
    </section>
  );
}
