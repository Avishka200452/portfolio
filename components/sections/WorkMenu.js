'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import FlowingMenu from '@/components/ui/FlowingMenu';
import { parseVideoUrl } from '@/lib/videoHelper';

const FALLBACK = {
  video:       'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
  photography: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
  social:      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
  branding:    'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
  logo:        'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
  uiux:        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&h=400&fit=crop&sat=-100&auto=format',
};

// Pick a preview image from the first item of each category
const coverFor = (list, key) => {
  const first = (list || [])[0];
  if (!first) return FALLBACK[key];
  if (first.image_url) return first.image_url;
  if (first.thumbnail_url) return first.thumbnail_url;
  const parsed = first.video_url ? parseVideoUrl(first.video_url) : null;
  return parsed?.thumbnailUrl || FALLBACK[key];
};

export default function WorkMenu({ videos, photos, social, branding, logo, uiux }) {
  const all = [
    { key: 'video',       text: 'Videography',        list: videos },
    { key: 'photography', text: 'Photography',        list: photos },
    { key: 'social',      text: 'Social Media Posts', list: social },
    { key: 'branding',    text: 'Branding & Mockups', list: branding },
    { key: 'logo',        text: 'Logo Design',        list: logo },
    { key: 'uiux',        text: 'UI / UX',            list: uiux },
  ];

  // Sections render nothing when empty, so only list the ones that exist
  const withContent = all.filter(c => c.list?.length);
  const source = withContent.length ? withContent : all;

  const items = source.map(c => ({
    link: `#${c.key}`,
    text: c.text,
    image: coverFor(c.list, c.key),
  }));

  const handleItemClick = (e, link) => {
    e.preventDefault();
    const target = document.querySelector(link);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 75;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section id="work-menu" className="section" style={{ paddingBottom: 60 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <FadeReveal><span className="section-tag" style={{ opacity: 1, color: '#000000' }}>SELECTED WORK ✦</span></FadeReveal>
          <ScrollReveal as="h2" containerClassName="section-title" style={{ opacity: 1, color: '#000000' }}>
            Explore My <span className="accent-text">Work</span>
          </ScrollReveal>
        </div>
      </div>

      <div
        className="work-menu-frame"
        style={{
          height: Math.max(360, items.length * 100),
          position: 'relative',
          borderTop: '1px solid rgba(0,0,0,0.12)',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
        }}
      >
        <FlowingMenu
          items={items}
          speed={15}
          textColor="#000000"
          bgColor="transparent"
          marqueeBgColor="#000000"
          marqueeTextColor="#FFFFFF"
          borderColor="rgba(0,0,0,0.12)"
          onItemClick={handleItemClick}
        />
      </div>

      <style>{`
        .work-menu-frame .menu__item-link,
        .work-menu-frame .marquee span {
          font-family: 'Gued', sans-serif;
          letter-spacing: -0.01em;
        }
        @media (max-width: 640px) {
          .work-menu-frame .menu__item-link,
          .work-menu-frame .marquee span { font-size: 3vh; }
          .work-menu-frame .marquee__img { width: 120px; height: 5vh; }
        }
      `}</style>
    </section>
  );
}
