/**
 * Parses video URLs from Google Drive, YouTube, Vimeo, or direct files (MP4, WebM, etc.)
 */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();

  // 1. Google Drive
  // Formats:
  // - https://drive.google.com/file/d/{id}/view?usp=sharing
  // - https://drive.google.com/file/d/{id}/view
  // - https://drive.google.com/open?id={id}
  // - https://drive.google.com/file/d/{id}/preview
  const driveMatch = clean.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/);
  if (driveMatch) {
    const id = driveMatch[1] || driveMatch[2];
    return {
      type: 'drive',
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${id}=w1920`,
      originalUrl: clean,
    };
  }

  // 2. YouTube
  // Formats:
  // - https://www.youtube.com/watch?v={id}
  // - https://youtu.be/{id}
  // - https://www.youtube.com/shorts/{id}
  // - https://www.youtube.com/embed/{id}
  const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&vq=hd1080&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      fallbackThumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      originalUrl: clean,
    };
  }

  // 3. Vimeo
  // Format: https://vimeo.com/{id}
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&quality=1080p`,
      thumbnailUrl: `https://vumbnail.com/${id}.jpg`,
      originalUrl: clean,
    };
  }

  // 4. Direct video file (MP4, WebM, MOV, Supabase Storage, Cloudinary, S3)
  return {
    type: 'direct',
    url: clean,
    embedUrl: clean,
    thumbnailUrl: null,
    originalUrl: clean,
  };
}

export function getVideoThumbnail(item) {
  if (!item) return null;
  if (item.image_url) return item.image_url;
  const parsed = parseVideoUrl(item.video_url);
  return parsed?.thumbnailUrl || null;
}
