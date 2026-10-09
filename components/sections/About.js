'use client';
import { useEffect, useRef } from 'react';
import TiltedCard from '@/components/ui/TiltedCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import { cleanSocialHandle, cleanSocialUrl } from '@/lib/socialHelper';

// Platform SVG Icons
const renderPlatformIcon = (platform, size = 17) => {
  const p = (platform || '').toLowerCase();
  if (p.includes('instagram')) {
    return (
      <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (p.includes('youtube')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  }
  if (p.includes('behance')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.116 0-6.625-2.883-6.625-6.85 0-4.077 2.658-6.95 6.425-6.95 4.095 0 6.002 2.923 5.706 6.8h-9.281c.08 2.052 1.488 4.15 3.86 4.15 1.755 0 2.879-.824 3.32-2.15h1.696zm-5.748-5.85c-.066-1.564-1.074-2.85-2.735-2.85-1.597 0-2.617 1.229-2.768 2.85h5.503zm-11.978 7.85h-6v-16h6.241c2.894 0 4.759 1.425 4.759 4.127 0 1.83-1.002 3.056-2.478 3.652 1.956.559 3.018 2.115 3.018 4.241 0 2.893-2.091 3.98-5.54 3.98zm-3.281-9.351h2.951c1.551 0 2.502-.678 2.502-2.138 0-1.397-.934-2.011-2.433-2.011h-3.02v4.149zm0 6.851h3.193c1.782 0 2.768-.783 2.768-2.391 0-1.566-.995-2.359-2.778-2.359h-3.183v4.75z"/>
      </svg>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p.includes('tiktok')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.71 1.25-.06 2.37-.8 2.85-1.96.22-.51.3-1.06.3-1.61.02-4.94.01-9.88.01-14.82z"/>
      </svg>
    );
  }
  if (p.includes('dribbble')) {
    return (
      <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
      </svg>
    );
  }
  if (p.includes('github')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    );
  }
  return (
    <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );
};

export default function About({ meta, socialLinks = [] }) {
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      statsRef.current?.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        let count = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = Math.round(count) + (el.dataset.suffix || '');
          if (count >= target) clearInterval(interval);
        }, 16);
      });
      obs.disconnect();
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const STATS = [
    { label: 'Projects', value: 30, suffix: '+' },
    { label: 'Clients',  value: 25, suffix: '+' },
    { label: 'Years',    value: 6,  suffix: '+' },
    { label: 'Awards',   value: 3, suffix: '+' },
  ];

  const displayLinks = (socialLinks && socialLinks.length > 0)
    ? socialLinks.map(l => ({
        platform: l.platform || 'Instagram',
        url: cleanSocialUrl(l.url) || 'https://instagram.com',
        handle: cleanSocialHandle(l),
      }))
    : [
        {
          platform: 'Instagram',
          url: 'https://instagram.com/bambare',
          handle: '@bambare',
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/avishka-bambaradeniya',
          handle: 'avishka bambaradeniya',
        },
        {
          platform: 'Facebook',
          url: 'https://facebook.com/avishka.bambaradeniya',
          handle: 'Avishka Bambaradeniya',
        },
      ];

  const handleDownloadCv = (e) => {
    if (!meta?.resume_url) return;
    e.preventDefault();
    const fileName = meta?.name ? `${meta.name.replace(/\s+/g, '_')}_CV.pdf` : 'Avishka_Bambaradeniya_CV.pdf';
    fetch(meta.resume_url)
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(meta.resume_url, '_blank', 'noopener,noreferrer');
      });
  };

  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 64,
          alignItems: 'center',
        }}>
          {/* ── Left: text content ── */}
          <div>
            <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>SCENE 02 · BIOGRAPHY ✦</span></FadeReveal>
            <ScrollReveal
              as="h2"
              containerClassName="section-title"
              style={{ maxWidth: 560, marginBottom: 24, opacity: 1, color: '#000000' }}
            >
              Crafting cinematic <span className="accent-text">visual narratives</span>
            </ScrollReveal>

            <FadeReveal delay={0.06}>
              <p
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a',
                  lineHeight: 1.9,
                  marginBottom: 40,
                  fontSize: '1.05rem',
                  maxWidth: 520,
                  opacity: 1,
                }}
              >
                {meta?.bio || 'Tell your story here. Update this in your admin panel.'}
              </p>
            </FadeReveal>

            {/* Stats */}
            <FadeReveal delay={0.1}>
              <div ref={statsRef} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12, marginBottom: 40,
              }}>
                {STATS.map(s => (
                  <div key={s.label} className="glass" style={{
                    padding: '20px 12px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      fontFamily: 'Gued, sans-serif',
                      fontSize: '2rem', fontWeight: 700, color: '#000000', opacity: 1,
                    }} data-target={s.value} data-suffix={s.suffix}>0</div>
                    <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.68rem', color: '#000000', opacity: 1, marginTop: 4,
                      textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700,
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeReveal>

            {/* CTAs & Social Links */}
            <FadeReveal delay={0.2} y={20}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="#contact" className="btn-accent">Hire Me</a>
                {meta?.resume_url ? (
                  <a
                    href={meta.resume_url}
                    download={meta?.name ? `${meta.name.replace(/\s+/g, '_')}_CV.pdf` : 'Avishka_Bambaradeniya_CV.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownloadCv}
                    className="btn-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    title="Download Curriculum Vitae (PDF)"
                  >
                    <span>Download CV</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className="btn-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                    title="Get in touch to request CV"
                  >
                    <span>Download CV</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                )}
              </div>

              {/* Follow Me On */}
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'rgba(0, 0, 0, 0.65)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  <span>Follow me on:</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  {displayLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-social-chip"
                      title={`Follow ${item.handle} on ${item.platform}`}
                    >
                      <span className="social-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {renderPlatformIcon(item.platform, 17)}
                      </span>
                      <span className="social-handle-text">{item.handle}</span>
                      <span className="social-arrow">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </FadeReveal>
          </div>


          {/* ── Right: TiltedCard Profile Picture ── */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <TiltedCard
              imageSrc={
                meta?.photo_url && !meta.photo_url.includes('1790091483852_WhatsApp_Image')
                  ? meta.photo_url
                  : '/profile.jpg'
              }
              altText={meta?.name || 'Avishka Bambaradeniya'}
              captionText={meta?.name || 'Avishka Bambaradeniya'}
              containerHeight="min(520px, 126vw)"
              containerWidth="100%"
              imageHeight="min(500px, 122vw)"
              imageWidth="min(360px, 88vw)"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 16,
                    right: 16,
                    padding: '12px 18px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(20px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pointerEvents: 'auto',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'Gued, sans-serif',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#000000',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                      }}
                    >
                      {meta?.name || 'Avishka Bambaradeniya'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        color: '#000000',
                        marginTop: 4,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {meta?.tagline || 'Visual Designer & Content Creator'}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      padding: '4px 10px',
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                    title="Available for Work"
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#000000',
                        boxShadow: '0 0 6px rgba(0, 0, 0, 0.3)',
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.66rem',
                        color: '#000000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Available
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <style>{`
        .about-social-chip {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 16px;
          border-radius: 30px;
          background: #ffffff;
          border: 1.5px solid rgba(0, 0, 0, 0.16);
          color: #000000;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-social-chip .social-arrow {
          font-size: 0.75rem;
          opacity: 0.45;
          margin-left: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .about-social-chip:hover {
          background: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22) !important;
        }
        .about-social-chip:hover .social-handle-text {
          color: #ffffff !important;
        }
        .about-social-chip:hover .social-arrow {
          opacity: 1 !important;
          color: #ffffff !important;
          transform: translate(2px, -2px);
        }
        .about-social-chip:hover svg.icon-stroke {
          stroke: #ffffff !important;
        }
        .about-social-chip:hover svg.icon-fill {
          fill: #ffffff !important;
        }

        @media (max-width: 900px) {
          #about .container > div {
            grid-template-columns: 1fr !important;
          }
          #about .container > div > div:last-child {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
