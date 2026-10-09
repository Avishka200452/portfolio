'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import FlexCarousel from '@/components/ui/FlexCarousel';

export default function BrandingSection({ items }) {
  const mapped = items
    ?.filter(item => Boolean(item.image_url))
    .map(item => ({
      src: item.image_url,
      alt: item.title || 'Brand Mockup',
      title: item.title || '',
      subtitle: item.client || item.description || 'Apparel & Brand Collateral'
    }));

  let carouselItems = mapped && mapped.length > 0 ? mapped : undefined;
  if (carouselItems && carouselItems.length > 0 && carouselItems.length < 4) {
    const original = [...carouselItems];
    while (carouselItems.length < 6) {
      carouselItems = [...carouselItems, ...original];
    }
  }

  return (
    <section id="branding" className="section" style={{ overflow: 'hidden', paddingBottom: 110 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <FadeReveal>
            <span className="section-tag" style={{ opacity: 1, color: '#000000', letterSpacing: '0.16em' }}>
              APPAREL · BILLBOARDS · REAL-WORLD MOCKUPS ✦
            </span>
          </FadeReveal>
          <ScrollReveal
            as="h2"
            containerClassName="section-title"
            style={{ opacity: 1, color: '#000000', marginBottom: 14 }}
          >
            Branding &amp; <span className="accent-text">Mockups</span>
          </ScrollReveal>

          <FadeReveal delay={0.1}>
            <p
              style={{
                margin: '0 auto 16px',
                opacity: 1,
                color: '#1a1a1a',
                maxWidth: 640,
                fontSize: '0.98rem',
                lineHeight: 1.7,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              From custom streetwear and apparel graphics to high-impact billboard campaigns and tactile product mockups. Bringing bold visual identities into physical spaces.
            </p>
          </FadeReveal>

          <FadeReveal delay={0.15}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 12,
              }}
            >
              <span className="branding-pill">
                <span style={{ fontSize: '0.95rem' }}>👕</span> T-Shirt &amp; Apparel
              </span>
              <span className="branding-pill">
                <span style={{ fontSize: '0.95rem' }}>🏢</span> Billboard &amp; Outdoor
              </span>
              <span className="branding-pill">
                <span style={{ fontSize: '0.95rem' }}>📦</span> Product &amp; Print Mockups
              </span>
            </div>
          </FadeReveal>
        </div>
      </div>

      <div style={{ width: '100%', height: 'clamp(640px, 80vh, 820px)', position: 'relative' }}>
        <FlexCarousel
          items={carouselItems}
          preset="liquid"
          intro="rise"
          fit="1080x1350"
          cardHeight={0.58}
          gap={20}
          radius={16}
          squeeze={0.16}
          focusOnClick
          captions
          captureWheel={false}
        />
      </div>

      <style>{`
        .branding-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 15px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.035);
          border: 1px solid rgba(0, 0, 0, 0.09);
          font-family: 'Montserrat', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #000000;
          letter-spacing: 0.02em;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          transition: all 0.22s ease;
        }
        .branding-pill:hover {
          background: #000000;
          color: #ffffff;
          border-color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}
