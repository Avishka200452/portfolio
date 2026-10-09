'use client';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import TechText from '@/components/ui/TechText';
import PatternWaves from '@/components/ui/PatternWaves';

const WORDS = ['Visual Designer', 'Content Creator', 'Brand Strategist', 'Photographer'];

export default function Hero({ meta }) {
  const [wordIdx,   setWordIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  // Typewriter
  useEffect(() => {
    const word = WORDS[wordIdx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', overflow: 'hidden',
    }}>
      {/* PatternWaves Header Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
        <PatternWaves
          preset="silk"
          color="#000000"
          backgroundColor="#ffffff"
          fade="edges"
          interactive
          cursorSize={50}
          cursorStrength={0.45}
          spacing={5}
          light={4}
          shine={0.85}
          speed={0.5}
          fadeSize={0.95}
        />
      </div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 950 }}>
          <FadeReveal delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <div className="cinema-badge" style={{ opacity: 1, color: '#000000' }}>
                <span className="rec-dot" />
                <span>REC</span>
                <span style={{ color: 'rgba(0,0,0,0.4)', margin: '0 3px' }}>|</span>
                <span style={{ color: '#000000', fontWeight: 700 }}>24 FPS</span>
                <span style={{ color: 'rgba(0,0,0,0.4)', margin: '0 3px' }}>·</span>
                <span>4K SCOPE</span>
              </div>
              <span className="section-tag" style={{ margin: 0, opacity: 1, color: '#000000' }}>
                VISUAL DESIGNER &amp; CONTENT CREATOR ✦
              </span>
            </div>
          </FadeReveal>

          <h1 className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            {meta?.name || 'Avishka Bambaradeniya'}
          </h1>

          <div
            style={{
              width: '100%',
              height: 'clamp(80px, 13vw, 140px)',
              position: 'relative',
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            <TechText
              text={meta?.name || 'Avishka Bambaradeniya'}
              fontFamily="'Gued', sans-serif"
              fontWeight={700}
              fontSize={140}
              letterSpacing={-0.02}
              color="#000000"
              accentColor="#000000"
              reach={180}
              softness={0.7}
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              lineStyle="dashed"
              reveal="letter"
              specks={15}
              selection={true}
              labels={true}
              draggable={true}
              sweep={true}
              speed={1}
            />
          </div>

          <FadeReveal delay={0.05}>
            <div style={{
              fontFamily: 'Gued, sans-serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.6rem)',
              fontWeight: 700, color: '#000000',
              opacity: 1,
              marginBottom: 28, minHeight: '1.2em',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{displayed}</span>
              <span style={{ color: '#000000', animation: 'blink 1s step-end infinite' }}>|</span>
            </div>
          </FadeReveal>

          <FadeReveal delay={0.08}>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.1rem',
                color: '#1a1a1a',
                maxWidth: 540,
                lineHeight: 1.75,
                marginBottom: 44,
                opacity: 1,
              }}
            >
              {meta?.bio?.slice(0, 160) || 'Crafting bold visual identities and captivating content that resonates.'}
            </p>
          </FadeReveal>

          <FadeReveal delay={0.1} y={20}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#work"    className="btn-accent">View My Work ↓</a>
              <a href="#contact" className="btn-ghost">Let&apos;s Collaborate</a>
            </div>
          </FadeReveal>
        </div>
      </div>


      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        color: 'rgba(0,0,0,0.30)', fontSize: '0.66rem', letterSpacing: '0.16em',
        fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase',
        zIndex: 2,
      }}>
        <span>SCENE 01 / SCROLL</span>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
      </div>
    </section>
  );
}
