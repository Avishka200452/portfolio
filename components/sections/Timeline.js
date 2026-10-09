'use client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';

export default function Timeline({ items }) {
  const edu = (items || []).filter(i => i.type === 'education');
  const exp = (items || []).filter(i => i.type === 'experience');

  const Card = ({ item }) => (
    <div className="glass glass-hover" style={{
      padding: 24, borderRadius: 'var(--radius)', marginBottom: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{
            fontFamily: 'Gued, sans-serif', fontWeight: 700,
            fontSize: '1.05rem', color: '#000000', opacity: 1,
            letterSpacing: '-0.01em',
          }}>{item.title}</div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#1a1a1a', fontSize: '0.85rem', marginTop: 4, fontWeight: 600
          }}>{item.institution}</div>
        </div>
        <span style={{
          fontSize: '0.73rem', color: '#000000',
          fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
          background: 'rgba(0,0,0,0.05)', padding: '4px 12px',
          borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0
        }}>{item.period}</span>
      </div>
      {item.description && (
        <p style={{
          marginTop: 12, fontSize: '0.875rem', color: '#222222', lineHeight: 1.65,
          fontFamily: 'Montserrat, sans-serif', opacity: 1,
        }}>
          {item.description}
        </p>
      )}
    </div>
  );

  return (
    <section id="timeline" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>CHRONOLOGY &amp; CAREER ✦</span></FadeReveal>
          <ScrollReveal as="h2" containerClassName="section-title" style={{ opacity: 1, color: '#000000' }}>
            Education &amp; <span className="accent-text">Experience</span>
          </ScrollReveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <FadeReveal delay={0}>
            <h3 style={{
              fontFamily: 'Gued, sans-serif',
              fontSize: '1.05rem', letterSpacing: '0.04em',
              textTransform: 'uppercase', color: '#000000',
              fontWeight: 700, opacity: 1,
              marginBottom: 20, paddingBottom: 12,
              borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}>Education</h3>
            {edu.length ? edu.map(i => <Card key={i.id} item={i} />) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontFamily: 'Montserrat, sans-serif' }}>Add education in Admin Panel</p>
            )}
          </FadeReveal>
          <FadeReveal delay={0.15}>
            <h3 style={{
              fontFamily: 'Gued, sans-serif',
              fontSize: '1.05rem', letterSpacing: '0.04em',
              textTransform: 'uppercase', color: '#000000',
              fontWeight: 700, opacity: 1,
              marginBottom: 20, paddingBottom: 12,
              borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}>Experience</h3>
            {exp.length ? exp.map(i => <Card key={i.id} item={i} />) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontFamily: 'Montserrat, sans-serif' }}>Add experience in Admin Panel</p>
            )}
          </FadeReveal>
        </div>
      </div>
      <style>{`@media(max-width:768px){#timeline .tl-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
