'use client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';

export default function UiuxSection({ items }) {
  if (!items?.length) return null;
  return (
    <section id="uiux" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>INTERFACE ARCHITECTURE ✦</span></FadeReveal>
          <h2 className="section-title" style={{ opacity: 1, color: '#000000' }}>
            Digital <span className="accent-text">Products</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {items.map(item => (
            <div key={item.id} className="glass glass-hover" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              {item.image_url && (
                <div style={{ background: 'rgba(0,0,0,0.04)', padding: '28px 28px 0' }}>
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', display: 'block', borderRadius: '8px 8px 0 0', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}
              <div style={{ padding: '22px 24px 28px' }}>
                <div style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#000000', marginBottom: 8, letterSpacing: '-0.01em' }}>{item.title}</div>
                {item.description && <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#222222', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 16 }}>{item.description}</p>}
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ fontSize: '0.82rem' }}>View Project →</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#uiux .container > div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
