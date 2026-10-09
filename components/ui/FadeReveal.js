'use client';
import FadeContent from './FadeContent';

/**
 * FadeReveal — wrapped around React Bits FadeContent
 * for backward compatibility across all inner components.
 */
export default function FadeReveal({
  children,
  delay = 0,
  duration = 1000,
  className = '',
  style = {},
  as: Tag = 'div',
  blur = true,
  easing = 'ease-out',
  ease = 'power2.out',
  initialOpacity = 0,
  ...props
}) {
  return (
    <FadeContent
      as={Tag}
      blur={blur}
      duration={duration}
      easing={easing}
      ease={ease}
      delay={delay}
      initialOpacity={initialOpacity}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </FadeContent>
  );
}
