'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState(null); // { type: 'link' | 'view' | 'drag' | 'text' | 'input', label: string }
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100, prevX: -100, prevY: -100 });
  const ringPos = useRef({ x: -100, y: -100, angle: 0, speed: 0 });
  const isDownRef = useRef(false);
  const hoverStateRef = useRef(null);

  const ripples = useRef([]);
  const sparks = useRef([]);
  const trails = useRef([]);
  const trailCooldown = useRef(0);

  useEffect(() => {
    hoverStateRef.current = hoverState;
  }, [hoverState]);

  useEffect(() => {
    // If on a touch screen, don't run animation loops
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ringEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    onResize();
    window.addEventListener('resize', onResize);

    const getHoverInfo = (el) => {
      if (!el) return null;
      // 1. Video cards
      if (el.closest('.video-showcase-card, [data-video], .video-grid-item, .video-card')) {
        return { type: 'view', label: 'PLAY' };
      }
      // 2. Photos & Gallery
      if (el.closest('#photography, [data-lightbox], .photo-grid-item, #social .glass-hover, .photo-card, .lightbox-trigger')) {
        return { type: 'view', label: 'VIEW' };
      }
      // 3. Horizontal Branding carousel & draggable strips
      if (el.closest('#branding, .flowing-menu, [data-drag], .marquee-track, .menu-wrap')) {
        return { type: 'drag', label: '‹ DRAG ›' };
      }
      // 4. Buttons, Links, Interactive elements
      if (
        el.closest(
          'a, button, [role="button"], input[type="submit"], .btn-accent, .btn-ghost, .about-social-chip, .contact-social-chip, .contact-card-link, .nav-link, .mobile-menu-btn, .jelly-radio, [data-hover]'
        )
      ) {
        return { type: 'link', label: '' };
      }
      // 5. Input fields
      if (el.closest('input, textarea, select')) {
        return { type: 'input', label: '' };
      }
      // 6. Text content
      if (el.closest('p, h1, h2, h3, h4, .section-title, .section-tag')) {
        return { type: 'text', label: '' };
      }
      return null;
    };

    let firstMove = true;
    const onMouseMove = (e) => {
      if (firstMove) {
        firstMove = false;
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
        mouse.current.prevX = e.clientX;
        mouse.current.prevY = e.clientY;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        setIsVisible(true);
      } else {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      }

      // Check hover info with event delegation
      const info = getHoverInfo(e.target);
      const prev = hoverStateRef.current;
      if (info?.type !== prev?.type || info?.label !== prev?.label) {
        setHoverState(info);
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onMouseDown = (e) => {
      isDownRef.current = true;

      // 1. Shockwave Ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: 65,
        alpha: 0.95,
        lineWidth: 2.2,
      });

      // 2. Kinetic directional sparks
      const sparkCount = 16;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.25;
        const speed = 3.5 + Math.random() * 5.2;
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.95,
          decay: 0.034 + Math.random() * 0.018,
        });
      }
    };
    window.addEventListener('mousedown', onMouseDown);

    const onMouseUp = () => {
      isDownRef.current = false;
    };
    window.addEventListener('mouseup', onMouseUp);

    const onMouseLeave = () => {
      setIsVisible(false);
    };
    const onMouseEnter = () => {
      setIsVisible(true);
    };
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let raf;
    let downScale = 1;

    const render = () => {
      const targetX = mouse.current.x;
      const targetY = mouse.current.y;

      // Elastic click snap interpolation
      const targetDown = isDownRef.current ? 0.75 : 1;
      downScale += (targetDown - downScale) * 0.24;

      // Center dot follows with 0 latency
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${downScale})`;

      // Outer follower ring lerp
      const dx = targetX - ringPos.current.x;
      const dy = targetY - ringPos.current.y;
      ringPos.current.x += dx * 0.18;
      ringPos.current.y += dy * 0.18;

      // Velocity calculation
      const velX = targetX - mouse.current.prevX;
      const velY = targetY - mouse.current.prevY;
      mouse.current.prevX = targetX;
      mouse.current.prevY = targetY;

      const rawSpeed = Math.hypot(velX, velY);
      ringPos.current.speed += (rawSpeed - ringPos.current.speed) * 0.15;

      if (rawSpeed > 0.8) {
        ringPos.current.angle = Math.atan2(velY, velX);
      }

      const activeHover = hoverStateRef.current;
      const isCardState = activeHover?.type === 'view' || activeHover?.type === 'drag';
      
      // When displaying a view/drag label, keep perfectly circular & upright
      const angle = isCardState ? 0 : ringPos.current.angle;
      const stretch = isCardState ? 0 : Math.min(ringPos.current.speed * 0.012, 0.42);
      const scaleX = (1 + stretch) * downScale;
      const scaleY = (1 - stretch * 0.45) * downScale;

      ringEl.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;

      // Canvas Rendering (Shockwaves, Sparks, Stardust Trail)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Stardust Trail
      if (rawSpeed > 2.5 && trailCooldown.current <= 0 && !isCardState) {
        trails.current.push({
          x: targetX + (Math.random() - 0.5) * 4,
          y: targetY + (Math.random() - 0.5) * 4,
          size: 1.2 + Math.random() * 1.4,
          alpha: 0.55,
        });
        trailCooldown.current = 2;
      } else {
        trailCooldown.current--;
      }

      for (let i = trails.current.length - 1; i >= 0; i--) {
        const t = trails.current[i];
        t.alpha -= 0.038;
        t.size *= 0.96;
        if (t.alpha <= 0) {
          trails.current.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${t.alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shockwaves (Expanding Ripple)
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.15 + 1.2;
        r.alpha -= 0.038;
        r.lineWidth = Math.max(0.6, r.lineWidth * 0.96);
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sparks (Radial Burst)
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.89;
        s.vy *= 0.89;
        s.alpha -= s.decay;
        if (s.alpha <= 0) {
          sparks.current.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.8, s.y - s.vy * 1.8);
        ctx.stroke();
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      className={`custom-cursor-container ${isVisible ? 'is-visible' : 'is-hidden'}`}
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="cursor-canvas" />

      {/* Liquid Follower Ring with Morphing & Dynamic Micro-Labels */}
      <div
        ref={ringRef}
        className={`cursor-follower ${hoverState ? `is-${hoverState.type}` : ''}`}
      >
        <span className="cursor-label">{hoverState?.label || ''}</span>
      </div>

      {/* Precision Core Dot (Zero-Lag Pinpoint) */}
      <div
        ref={dotRef}
        className={`cursor-dot ${hoverState ? `is-${hoverState.type}` : ''}`}
      />
    </div>
  );
}
