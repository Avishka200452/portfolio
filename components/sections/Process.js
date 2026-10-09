'use client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function Process({ steps }) {
  const DEFAULT = [
    { step_number: 1, title: 'Research',    description: 'Deep dive into the brief, market, and target audience to define the creative direction.' },
    { step_number: 2, title: 'Concept',     description: 'Sketch multiple directions and select the strongest path forward.' },
    { step_number: 3, title: 'Design',      description: 'Craft pixel-perfect visuals with purpose, intent, and obsessive attention to detail.' },
    { step_number: 4, title: 'Deliver',     description: 'Final handoff with full assets, style guides, and documentation.' },
  ];
  const list = steps?.length ? steps : DEFAULT;

  return (
    <section id="process" className="section" style={{ background: 'rgba(0, 0, 0, 0.015)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>PRODUCTION PIPELINE ✦</span></FadeReveal>
          <ScrollReveal as="h2" containerClassName="section-title" style={{ opacity: 1, color: '#000000' }}>
            Directing &amp; <span className="accent-text">Execution</span>
          </ScrollReveal>
        </div>

        <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {list.map((s, i) => (
            <FadeReveal key={i} delay={i * 0.12} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SpotlightCard
                className="card-spotlight--dark"
                spotlightColor="rgba(255, 255, 255, 0.16)"
                style={{ height: '100%', flex: 1 }}
              >
                <div style={{
                  fontFamily: 'Gued, sans-serif',
                  fontSize: '3.2rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  opacity: 0.25,
                  lineHeight: 1,
                  marginBottom: 18,
                  letterSpacing: '-0.02em',
                }}>
                  0{s.step_number}
                </div>
                <div style={{
                  fontFamily: 'Gued, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: '#FFFFFF',
                  marginBottom: 10,
                  letterSpacing: '-0.01em',
                }}>
                  {s.title}
                </div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {s.description}
                </p>
              </SpotlightCard>
            </FadeReveal>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){#process .process-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:540px){#process .process-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
