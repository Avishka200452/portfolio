'use client';
import LogoLoop from '@/components/ui/LogoLoop';
import {
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeAfterEffect,
  TbBrandAdobe,
} from 'react-icons/tb';
import {
  SiFigma,
  SiGithub,
  SiReact,
  SiFlutter,
  SiCplusplus,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';

// Official CapCut vector icon
function CapCutIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 510"
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        fill="#FFFFFF"
        fillRule="nonzero"
        d="M109.095 181.505c2.223-19.532 18.316-34.578 37.955-35.483l167.194-.001a40.612 40.612 0 0130.095 17.427 42.152 42.152 0 016.39 14.915l49.135-24.364a2.185 2.185 0 013.141 1.674v27.628l.001.096a4.571 4.571 0 01-2.837 4.229 177620.936 177620.936 0 00-135.63 67.336l135.324 66.948a4.695 4.695 0 013.142 4.08v27.685a2.266 2.266 0 01-3.613 1.821c-16.12-8.162-32.464-15.854-48.462-24.18a63.503 63.503 0 01-4.282 11.225 40.813 40.813 0 01-26.098 20.135 44.994 44.994 0 01-11.221.919l-155.833.003c-3.51 0-7.04 0-10.53-.266-18.089-2.705-32.049-17.363-33.869-35.565v-26.77a5.935 5.935 0 014.08-4.879c27.791-13.732 55.521-27.587 83.353-41.258a32412.61 32412.61 0 00-84.17-41.748 5.41 5.41 0 01-3.223-4.918c-.042-8.876-.185-17.792-.042-26.689zm30.975.184c-1.674 3.367-.898 7.263-1.041 10.896 30.608 15.12 60.99 30.321 91.536 45.339 30.185-14.963 60.384-29.927 90.596-44.89 0-2.714.123-5.428 0-8.162a10.203 10.203 0 00-10.096-8.734h-.106l-161.565.001a10.082 10.082 0 00-9.345 5.55h.021zm-1.041 135.406c.142 3.673-.654 7.631 1.122 11.039a10.204 10.204 0 009.284 5.405l161.667.002.081-.001c3.618 0 6.961-1.94 8.754-5.081 2.04-3.57 1.102-7.855 1.305-11.773-30.26-14.936-60.48-30.118-90.801-44.89a43915.126 43915.126 0 00-91.432 45.299h.02z"
      />
    </svg>
  );
}

// Custom Antigravity icon (stylized levitation orb with orbital rings in theme accent)
function AntigravityIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="agGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      {/* Outer angled orbit ring */}
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="5"
        stroke="#000000"
        strokeWidth="1.5"
        transform="rotate(-25 16 16)"
        opacity="0.8"
      />
      {/* Counter orbit ring */}
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="5"
        stroke="#666666"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        transform="rotate(35 16 16)"
        opacity="0.6"
      />
      {/* Central glowing core */}
      <circle cx="16" cy="16" r="4.5" fill="url(#agGrad)" />
      {/* Inner spark */}
      <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

// Tool badge helper to display icon + title with brand color accents
function ToolPill({ icon, name, color }) {
  return (
    <div
      className="tool-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 18px',
        borderRadius: 999,
        background: 'rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        fontSize: '0.88rem',
        fontWeight: 600,
        fontFamily: 'Montserrat, sans-serif',
        color: '#1a1a1a',
        whiteSpace: 'nowrap',
        cursor: 'default',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color || '#000000';
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span>{name}</span>
    </div>
  );
}

const TOOLS = [
  {
    title: 'Photoshop',
    node: <ToolPill icon={<TbBrandAdobePhotoshop color="#31A8FF" />} name="Photoshop" color="#31A8FF" />,
  },
  {
    title: 'Illustrator',
    node: <ToolPill icon={<TbBrandAdobeIllustrator color="#FF9A00" />} name="Illustrator" color="#FF9A00" />,
  },
  {
    title: 'Premiere Pro',
    node: <ToolPill icon={<TbBrandAdobePremiere color="#9999FF" />} name="Premiere Pro" color="#9999FF" />,
  },
  {
    title: 'After Effects',
    node: <ToolPill icon={<TbBrandAdobeAfterEffect color="#CF96FD" />} name="After Effects" color="#CF96FD" />,
  },
  {
    title: 'Adobe',
    node: <ToolPill icon={<TbBrandAdobe color="#FF0000" />} name="Adobe" color="#FF0000" />,
  },
  {
    title: 'CapCut',
    node: <ToolPill icon={<CapCutIcon />} name="CapCut" color="#FFFFFF" />,
  },
  {
    title: 'Figma',
    node: <ToolPill icon={<SiFigma color="#F24E1E" />} name="Figma" color="#F24E1E" />,
  },
  {
    title: 'Antigravity',
    node: <ToolPill icon={<AntigravityIcon />} name="Antigravity" color="#000000" />,
  },
  {
    title: 'GitHub',
    node: <ToolPill icon={<SiGithub color="#1a1a1a" />} name="GitHub" color="#1a1a1a" />,
  },
  {
    title: 'React',
    node: <ToolPill icon={<SiReact color="#61DAFB" />} name="React" color="#61DAFB" />,
  },
  {
    title: 'Flutter',
    node: <ToolPill icon={<SiFlutter color="#54C5F8" />} name="Flutter" color="#54C5F8" />,
  },
  {
    title: 'Java',
    node: <ToolPill icon={<FaJava color="#E76F00" />} name="Java" color="#E76F00" />,
  },
  {
    title: 'C++',
    node: <ToolPill icon={<SiCplusplus color="#00599C" />} name="C++" color="#00599C" />,
  },
];

export default function SkillsBand() {
  return (
    <section
      id="skills-band"
      style={{
        overflow: 'hidden',
        padding: '36px 0',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        background: 'rgba(0, 0, 0, 0.015)',
        position: 'relative',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(0, 0, 0, 0.30)',
          marginBottom: 20,
          fontWeight: 600,
        }}
      >
        ✦ &nbsp; TOOLS &amp; TECHNOLOGIES &nbsp; ✦
      </div>

      <LogoLoop
        logos={TOOLS}
        speed={45}
        direction="left"
        logoHeight={44}
        gap={20}
        hoverSpeed={0}
        fadeOut
        fadeOutColor="#FFFFFF"
        scaleOnHover={false}
        ariaLabel="Tools and technologies I use"
      />
    </section>
  );
}
