/**
 * Helper utilities for social media links and username formatting
 */

export function isEmojiOnly(str) {
  if (!str) return false;
  return /^[\p{Extended_Pictographic}\uFE0F\u200D\s]+$/u.test(str.trim());
}

export function cleanSocialUrl(url) {
  if (!url) return '';
  let u = url.trim();
  // Handle accidentally duplicated URLs (e.g. pasted twice)
  const secondHttp = u.indexOf('http', 8);
  if (secondHttp !== -1) {
    u = u.substring(0, secondHttp);
  }
  return u;
}

export function cleanSocialHandle(link) {
  if (!link) return '@profile';

  // 1. Explicit username property if provided
  if (link.username && link.username.trim()) {
    return link.username.trim();
  }

  // 2. Custom username stored in icon (when not just an emoji preset)
  if (link.icon && link.icon.trim() && !isEmojiOnly(link.icon.trim())) {
    return link.icon.trim();
  }

  const platform = (link.platform || '').toLowerCase();
  const url = cleanSocialUrl(link.url);

  if (!url) {
    return platform ? `@${platform.replace(/\s+/g, '')}` : '@profile';
  }

  try {
    // Strip query strings and hash
    const clean = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
    const parts = clean.split('/').filter(Boolean);
    let lastSeg = parts[parts.length - 1] || '';

    // Instagram: show @username (e.g. @bambare)
    if (platform.includes('insta')) {
      if (lastSeg.toLowerCase().includes('bambare')) {
        return '@bambare';
      }
      const handle = lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
      return handle !== '@' ? handle : '@bambare';
    }

    // LinkedIn: show full profile name (e.g. avishka bambaradeniya)
    if (platform.includes('linkedin')) {
      const inIdx = parts.findIndex(p => p.toLowerCase() === 'in');
      let slug = inIdx !== -1 && parts[inIdx + 1] ? parts[inIdx + 1] : lastSeg;
      // Strip trailing LinkedIn auto-generated alphanumeric hash e.g. -692a1729b
      slug = slug.replace(/-[a-f0-9]{7,}$/i, '').replace(/-[0-9a-z]{6,12}$/i, '');
      const formatted = slug.replace(/[-_]+/g, ' ').trim();
      return formatted || 'avishka bambaradeniya';
    }

    // Facebook: show full name or handle (e.g. Avishka Bambaradeniya or @username)
    if (platform.includes('facebook') || platform.includes('fb')) {
      if (lastSeg.toLowerCase().includes('bambare') || lastSeg.toLowerCase().includes('avishka')) {
        return 'Avishka Bambaradeniya';
      }
      if (lastSeg && !lastSeg.startsWith('profile.php')) {
        const handle = lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
        return handle !== '@' ? handle : 'Avishka Bambaradeniya';
      }
      return 'Avishka Bambaradeniya';
    }

    // Twitter / X: @handle
    if (platform.includes('twitter') || platform.includes('x')) {
      return lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
    }

    // TikTok: @handle
    if (platform.includes('tiktok')) {
      return lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
    }

    // Dribbble: @handle
    if (platform.includes('dribbble')) {
      return lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
    }

    // YouTube: @channel
    if (platform.includes('youtube')) {
      return lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
    }

    // Behance / GitHub: username
    if (platform.includes('behance') || platform.includes('github')) {
      return lastSeg.replace(/^@/, '');
    }

    // Generic fallback: clean segment
    if (lastSeg && !lastSeg.includes('.') && lastSeg.toLowerCase() !== platform) {
      return lastSeg.startsWith('@') ? lastSeg : `@${lastSeg}`;
    }

    return `@${platform.replace(/\s+/g, '')}`;
  } catch {
    return platform ? `@${platform.replace(/\s+/g, '')}` : '@profile';
  }
}

export function renderPlatformIcon(platform, size = 17) {
  const p = (platform || '').toLowerCase();
  if (p.includes('instagram')) {
    return (
      <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (p.includes('youtube')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  }
  if (p.includes('facebook') || p.includes('fb')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
  }
  if (p.includes('behance')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.116 0-6.625-2.883-6.625-6.85 0-4.077 2.658-6.95 6.425-6.95 4.095 0 6.002 2.923 5.706 6.8h-9.281c.08 2.052 1.488 4.15 3.86 4.15 1.755 0 2.879-.824 3.32-2.15h1.696zm-5.748-5.85c-.066-1.564-1.074-2.85-2.735-2.85-1.597 0-2.617 1.229-2.768 2.85h5.503zm-11.978 7.85h-6v-16h6.241c2.894 0 4.759 1.425 4.759 4.127 0 1.83-1.002 3.056-2.478 3.652 1.956.559 3.018 2.115 3.018 4.241 0 2.893-2.091 3.98-5.54 3.98zm-3.281-9.351h2.951c1.551 0 2.502-.678 2.502-2.138 0-1.397-.934-2.011-2.433-2.011h-3.02v4.149zm0 6.851h3.193c1.782 0 2.768-.783 2.768-2.391 0-1.566-.995-2.359-2.778-2.359h-3.183v4.75z"/>
      </svg>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p.includes('tiktok')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.71 1.25-.06 2.37-.8 2.85-1.96.22-.51.3-1.06.3-1.61.02-4.94.01-9.88.01-14.82z"/>
      </svg>
    );
  }
  if (p.includes('dribbble')) {
    return (
      <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
      </svg>
    );
  }
  if (p.includes('github')) {
    return (
      <svg className="icon-fill" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    );
  }
  return (
    <svg className="icon-stroke" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );
}
