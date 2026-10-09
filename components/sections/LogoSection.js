'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import CircularCarousel from '@/components/ui/CircularCarousel';

export default function LogoSection({ items }) {
  const mapped = items
    ?.filter(item => Boolean(item.image_url))
    .map(item => ({
      src: item.image_url,
      alt: item.title || 'Brand Mark',
      title: item.title || '',
      subtitle: item.client || ''
    }));

  let carouselItems = mapped && mapped.length > 0 ? mapped : undefined;
  if (carouselItems && carouselItems.length > 0 && carouselItems.length < 5) {
    const original = [...carouselItems];
    while (carouselItems.length < 6) {
      carouselItems = [...carouselItems, ...original];
    }
  }

  return (
    <section id="logo" className="section" style={{ overflow: 'hidden', paddingBottom: 100 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <FadeReveal>
            <span className="section-tag" style={{ opacity: 1, color: '#000000' }}>TRADEMARKS &amp; EMBLEMS ✦</span>
          </FadeReveal>
          <ScrollReveal
            as="h2"
            containerClassName="section-title"
            style={{ opacity: 1, color: '#000000' }}
          >
            Logo <span className="accent-text">Design</span>
          </ScrollReveal>
        </div>
      </div>
      <div style={{ width: '100%', height: 'clamp(480px, 64vh, 620px)', position: 'relative' }}>
        <CircularCarousel
          items={carouselItems}
          preset="cylinder"
          curve={0}
          intro="rise"
          cardWidth={230}
          aspectRatio={1}
          gap={24}
          cornerRadius={16}
          fadeColor="#ffffff"
          speed={12}
          captions={true}
          draggable={true}
          pauseOnHover={true}
          focusOnClick={true}
        />
      </div>
    </section>
  );
}
