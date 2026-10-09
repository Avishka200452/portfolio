'use client';
import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
  as: Tag = 'div',
  style = {},
}) => {
  const containerRef = useRef(null);
  const isString = typeof children === 'string';

  // Only split if children is a plain string
  const splitText = useMemo(() => {
    if (!isString) return null;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="sr-word" key={index}>{word}</span>;
    });
  }, [children, isString]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef?.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      // Rotation on the container (both string and JSX children)
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true,
          },
        }
      );

      const isSectionHeading = Tag === 'h1' || Tag === 'h2' || Tag === 'h3' || containerClassName?.includes('section-title');
      const startOpacity = isSectionHeading ? 1 : baseOpacity;

      if (isString) {
        // Word-by-word animation for string children
        const wordElements = el.querySelectorAll('.sr-word');
        gsap.fromTo(
          wordElements,
          { opacity: startOpacity },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
        if (enableBlur && !isSectionHeading) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: true,
              },
            }
          );
        }
      } else {
        // For JSX children — animate the whole block
        gsap.fromTo(
          el,
          { opacity: startOpacity, filter: (enableBlur && !isSectionHeading) ? `blur(${blurStrength}px)` : 'none' },
          {
            ease: 'none',
            opacity: 1,
            filter: 'blur(0px)',
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength, isString]);

  return (
    <Tag
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`.trim()}
      style={style}
    >
      {isString
        ? <span className={`scroll-reveal-text ${textClassName}`.trim()}>{splitText}</span>
        : children
      }
    </Tag>
  );
};

export default ScrollReveal;
