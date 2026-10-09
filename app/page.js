import { getMeta, getWorks, getTimeline, getProcessSteps, getSocialLinks } from '@/lib/supabase';
import GlobalBackground from '@/components/GlobalBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SkillsBand from '@/components/sections/SkillsBand';
import Timeline from '@/components/sections/Timeline';
import Process from '@/components/sections/Process';
import WorkMenu from '@/components/sections/WorkMenu';
import VideoSection from '@/components/sections/VideoSection';
import PhotoSection from '@/components/sections/PhotoSection';
import SocialSection from '@/components/sections/SocialSection';
import BrandingSection from '@/components/sections/BrandingSection';
import LogoSection from '@/components/sections/LogoSection';
import UiuxSection from '@/components/sections/UiuxSection';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import FadeContent from '@/components/ui/FadeContent';

export const revalidate = 60;

export default async function Home() {
  let meta, videos, photos, social, branding, logo, uiux, timeline, process, socialLinks;

  try {
    [meta, videos, photos, social, branding, logo, uiux, timeline, process, socialLinks] =
      await Promise.all([
        getMeta(),
        getWorks('video'),
        getWorks('photography'),
        getWorks('social_media'),
        getWorks('branding'),
        getWorks('logo'),
        getWorks('uiux'),
        getTimeline(),
        getProcessSteps(),
        getSocialLinks(),
      ]);
  } catch {
    // Supabase not configured yet — show placeholder site
    meta = { name: 'Your Name', tagline: 'Visual Designer & Content Creator', bio: 'Update your Supabase .env.local to load real content.' };
    [videos, photos, social, branding, logo, uiux, timeline, process, socialLinks] = Array(9).fill([]);
  }

  return (
    <>
      <div className="cinema-vignette" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />
      <div className="cinema-letterbox-top" aria-hidden="true" />
      <div className="cinema-letterbox-bottom" aria-hidden="true" />
      <div className="cinema-strip-left" aria-hidden="true" />
      <div className="cinema-strip-right" aria-hidden="true" />
      <GlobalBackground />
      <Navbar />
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Hero meta={meta} />
      </FadeContent>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <About meta={meta} socialLinks={socialLinks || []} />
      </FadeContent>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <SkillsBand />
      </FadeContent>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Timeline items={timeline || []} />
      </FadeContent>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Process steps={process || []} />
      </FadeContent>
      <div id="work">
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <WorkMenu
            videos={videos || []}
            photos={photos || []}
            social={social || []}
            branding={branding || []}
            logo={logo || []}
            uiux={uiux || []}
          />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <VideoSection items={videos || []} />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <PhotoSection items={photos || []} />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <SocialSection items={social || []} />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <BrandingSection items={branding || []} />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <LogoSection items={logo || []} />
        </FadeContent>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <UiuxSection items={uiux || []} />
        </FadeContent>
      </div>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Contact meta={meta} socialLinks={socialLinks || []} />
      </FadeContent>
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <Footer meta={meta} />
      </FadeContent>
    </>
  );
}
