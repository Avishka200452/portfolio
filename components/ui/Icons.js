'use client';

export function IconMail({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <path d="m3.5 6.5 7.42 5.56a1.8 1.8 0 0 0 2.16 0L20.5 6.5" />
      <circle cx="12" cy="14" r="1" fill={color} stroke="none" opacity="0.6" />
    </svg>
  );
}

export function IconPhone({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sleek mobile device with soundwaves */}
      <rect x="5.5" y="2.5" width="13" height="19" rx="3" />
      <line x1="10" y1="5.5" x2="14" y2="5.5" />
      <circle cx="12" cy="17.5" r="1.2" fill={color} stroke="none" />
      <path d="M20.5 8.5a4.5 4.5 0 0 1 0 7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPin({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Modern architectural geometric pin */}
      <path d="M12 21.5c-4.2-4.8-7.5-8.8-7.5-12.5a7.5 7.5 0 1 1 15 0c0 3.7-3.3 7.7-7.5 12.5z" />
      <circle cx="12" cy="9" r="2.8" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="9" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconArrowUpRight({ size = 16, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function IconCheckCircle({ size = 24, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </svg>
  );
}
