'use client';
import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import { parseVideoUrl } from '@/lib/videoHelper';

const PLAT = {
  instagram: { icon: '📸', label: 'Instagram' },
  youtube:   { icon: '▶️', label: 'YouTube'   },
  tiktok:    { icon: '🎵', label: 'TikTok'    },
  facebook:  { icon: '📘', label: 'Facebook'  },
  twitter:   { icon: '𝕏',  label: 'X / Twitter'},
  vimeo:     { icon: '🎬', label: 'Vimeo'     },
};

export default function VideoSection({ items }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModal(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  const videoList = useMemo(() => items || [], [items]);

  // Counts for filter pills
  const landscapeCount = useMemo(() => videoList.filter(i => i.orientation !== 'portrait').length, [videoList]);
  const portraitCount  = useMemo(() => videoList.filter(i => i.orientation === 'portrait').length, [videoList]);

  // Filtered list
  const filteredVideos = useMemo(() => {
    if (filter === 'landscape') return videoList.filter(i => i.orientation !== 'portrait');
    if (filter === 'portrait')  return videoList.filter(i => i.orientation === 'portrait');
    return videoList;
  }, [videoList, filter]);

  if (!videoList.length) return null;

  return (
    <section id="video" className="section" style={{ position: 'relative', padding: '90px 0 100px' }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <FadeReveal>
            <span className="section-tag" style={{ letterSpacing: '0.18em', opacity: 1, color: '#000000' }}>
              OUR PORTFOLIO ✦
            </span>
          </FadeReveal>
          <ScrollReveal
            as="h2"
            containerClassName="section-title"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 700, marginBottom: 12, opacity: 1, color: '#000000' }}
          >
            <span className="accent-text">Videography</span>
          </ScrollReveal>
          <FadeReveal delay={0.1}>
            <p style={{ color: '#1a1a1a', opacity: 1, fontSize: '0.95rem', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6, fontFamily: 'Montserrat, sans-serif' }}>
              A curated collection of commercial videography, cinematic films, and vertical reels.
            </p>

            {/* Filter Pills */}
            <div style={{ display: 'inline-flex', gap: 8, padding: 5, background: 'rgba(0, 0, 0, 0.04)', borderRadius: 30, border: '1px solid rgba(0, 0, 0, 0.08)' }}>
              {[
                { id: 'all',       label: 'All Work',          count: videoList.length },
                { id: 'landscape', label: 'Landscape (16:9)',  count: landscapeCount },
                { id: 'portrait',  label: 'Reels & Shorts (9:16)', count: portraitCount },
              ].map(tab => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 24,
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive ? '#000000' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'rgba(0, 0, 0, 0.65)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>
          </FadeReveal>
        </div>

        {/* ── Mixed Landscape & Portrait Masonry Grid ── */}
        <div className="video-showcase-grid">
          {filteredVideos.map((item) => {
            const isPortrait = item.orientation === 'portrait';
            const parsed = parseVideoUrl(item.video_url);
            const thumb = item.image_url || parsed?.thumbnailUrl;
            const fallbackThumb = item.image_url ? (parsed?.thumbnailUrl || parsed?.fallbackThumb) : parsed?.fallbackThumb;
            const p = PLAT[item.social_platform] || {};

            return (
              <div
                key={item.id}
                onClick={() => setModal(item)}
                className={`video-showcase-card ${isPortrait ? 'video-showcase-card--portrait' : 'video-showcase-card--landscape'}`}
              >
                {/* Media Image / Video Target with Zoom on Hover */}
                <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.title}
                      className="video-media-target"
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)',
                      }}
                      onError={(e) => {
                        if (fallbackThumb && e.currentTarget.src !== fallbackThumb) {
                          e.currentTarget.src = fallbackThumb;
                        } else {
                          e.currentTarget.style.display = 'none';
                          const fb = e.currentTarget.parentElement?.querySelector('.video-fallback-box');
                          if (fb) fb.style.display = 'flex';
                        }
                      }}
                    />
                  ) : item.video_url && parsed?.type === 'direct' ? (
                    <video
                      src={`${item.video_url}#t=0.5`}
                      muted
                      playsInline
                      preload="metadata"
                      className="video-media-target"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : null}

                  {/* Fallback if no thumb or broken */}
                  <div
                    className="video-fallback-box"
                    style={{
                      display: thumb || (item.video_url && parsed?.type === 'direct') ? 'none' : 'flex',
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(ellipse at center, #1f1f1f 0%, #0a0a0a 100%)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 8,
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>🎬</span>
                  </div>
                </div>

                {/* Top Format Badge & Stats */}
                <div style={{
                  position: 'absolute', top: 14, left: 14, right: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  zIndex: 3, pointerEvents: 'none',
                }}>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {isPortrait ? '9:16 REEL' : '16:9 WIDE'}
                  </div>

                  {(item.stats_views || item.social_platform) && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.55)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: '0.70rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      {item.stats_views && <span>👁️ {item.stats_views}</span>}
                      {p.icon && <span>{p.icon}</span>}
                    </div>
                  )}
                </div>

                {/* Centered Circular Play Button */}
                <div
                  className="video-play-btn"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.50)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(255, 255, 255, 0.70)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
                    transition: 'all 0.25s cubic-bezier(0.2, 0, 0.2, 1)',
                    zIndex: 3,
                  }}
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="#FFFFFF" style={{ marginLeft: 2 }}>
                    <polygon points="6 4 20 12 6 20" />
                  </svg>
                </div>

                {/* Bottom Dark Gradient Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.60) 40%, rgba(0, 0, 0, 0.10) 70%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />

                {/* Bottom Content (Title & Subtitle Centered like reference photo) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px 14px 14px',
                    textAlign: 'center',
                    zIndex: 3,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Gued, sans-serif',
                      fontWeight: 700,
                      fontSize: isPortrait ? '1.02rem' : '1.08rem',
                      color: '#FFFFFF',
                      marginBottom: 4,
                      lineHeight: 1.25,
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      lineHeight: 1.35,
                      margin: '0 auto',
                      maxWidth: '92%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {item.description || (item.client ? `Client: ${item.client}` : item.social_platform ? `${item.social_platform.toUpperCase()} Film` : 'Cinematic Video')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Fullscreen Video Player Modal with Backdrop Blur & Overlay (Covers Navbar) ── */}
      {mounted && modal && createPortal(
        (() => {
          const modalVideo = parseVideoUrl(modal.video_url);
          const isEmbed = modalVideo?.type === 'drive' || modalVideo?.type === 'youtube' || modalVideo?.type === 'vimeo';
          const isPortrait = modal.orientation === 'portrait';
          const p = PLAT[modal.social_platform] || {};

          return (
            <div
              onClick={() => setModal(null)}
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
                padding: isPortrait ? '16px' : '24px 20px',
                cursor: 'zoom-out',
                animation: 'modalFadeIn 0.22s ease-out',
              }}
            >
              {/* Screen Top-Right Close Button */}
              <button
                type="button"
                onClick={() => setModal(null)}
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
                aria-label="Close video"
              >
                ✕
              </button>

              {/* Exact-Ratio Video Container — No separate card box! */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  width: isPortrait ? 'auto' : 'min(92vw, 1100px)',
                  height: isPortrait ? 'min(88vh, 850px)' : 'auto',
                  aspectRatio: isPortrait ? '9 / 16' : '16 / 9',
                  maxWidth: isPortrait ? '94vw' : '1100px',
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
                {/* Floating Close Button on Video Frame */}
                <button
                  type="button"
                  onClick={() => setModal(null)}
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
                  aria-label="Close video"
                >
                  ✕
                </button>

                {/* Video Content */}
                {isEmbed ? (
                  <iframe
                    src={modalVideo.embedUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 0,
                      display: 'block',
                      background: '#000000',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={modal.video_url}
                    poster={modal.image_url || undefined}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: '#000000',
                      display: 'block',
                    }}
                  />
                )}

                {/* In-Video Bottom Details & Likes Overlay (Integrated directly into the video) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.70) 55%, rgba(0, 0, 0, 0.15) 85%, transparent 100%)',
                    padding: isPortrait ? '45px 18px 20px' : '55px 28px 22px',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {/* Badge & Client */}
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
                      {isPortrait ? '9:16 Reel' : '16:9 Cinema'}
                    </span>

                    {modal.client && (
                      <span
                        style={{
                          fontSize: '0.76rem',
                          color: 'rgba(255, 255, 255, 0.80)',
                          fontWeight: 500,
                        }}
                      >
                        Client: {modal.client}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'Gued, sans-serif',
                      fontSize: isPortrait ? '1.18rem' : '1.38rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.25,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {modal.title}
                  </h3>

                  {/* Description */}
                  {modal.description && (
                    <p
                      style={{
                        fontSize: isPortrait ? '0.80rem' : '0.86rem',
                        color: 'rgba(255, 255, 255, 0.82)',
                        lineHeight: 1.45,
                        margin: 0,
                        textShadow: '0 1px 6px rgba(0, 0, 0, 0.8)',
                        maxHeight: isPortrait ? '3em' : '4.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {modal.description}
                    </p>
                  )}

                  {/* Likes, Views, Comments & Social Link */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginTop: 4,
                    }}
                  >
                    {/* Stats pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {modal.stats_likes && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.14)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            padding: '4px 10px',
                            borderRadius: 20,
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          <span>❤️</span>
                          <span>{modal.stats_likes}</span>
                        </div>
                      )}
                      {modal.stats_views && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.14)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            padding: '4px 10px',
                            borderRadius: 20,
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          <span>👁️</span>
                          <span>{modal.stats_views}</span>
                        </div>
                      )}
                      {modal.stats_comments && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.14)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            padding: '4px 10px',
                            borderRadius: 20,
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          <span>💬</span>
                          <span>{modal.stats_comments}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Link Button */}
                    {modal.social_link && (
                      <a
                        href={modal.social_link}
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
                          fontSize: '0.74rem',
                          padding: '6px 14px',
                          borderRadius: 20,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
                          transition: 'transform 0.2s, opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <span>{p.icon || '↗'}</span>
                        <span>Watch on {p.label || 'Post'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </section>
  );
}
