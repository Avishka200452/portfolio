'use client';
import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FadeReveal from '@/components/ui/FadeReveal';
import { IconMail, IconPhone, IconPin, IconCheckCircle, IconArrowUpRight } from '@/components/ui/Icons';
import { cleanSocialHandle, cleanSocialUrl, renderPlatformIcon } from '@/lib/socialHelper';

export default function Contact({ meta, socialLinks = [] }) {
  const [form,    setForm]    = useState({ name:'', email:'', message:'' });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const displayLinks = (socialLinks && socialLinks.length > 0)
    ? socialLinks.map(l => ({
        platform: l.platform || 'Instagram',
        url: cleanSocialUrl(l.url) || 'https://instagram.com',
        handle: cleanSocialHandle(l),
      }))
    : [
        {
          platform: 'Instagram',
          url: 'https://instagram.com/bambare',
          handle: '@bambare',
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/avishka-bambaradeniya',
          handle: 'avishka bambaradeniya',
        },
        {
          platform: 'Facebook',
          url: 'https://facebook.com/avishka.bambaradeniya',
          handle: 'Avishka Bambaradeniya',
        },
      ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#000000',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'border-color 0.2s, background 0.2s',
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left Column */}
          <div>
            <FadeReveal>
              <span className="section-tag" style={{ opacity: 1, color: '#000000' }}>
                INITIATE COLLABORATION ✦
              </span>
            </FadeReveal>

            <ScrollReveal
              as="h2"
              containerClassName="section-title"
              style={{ opacity: 1, color: '#000000' }}
            >
              Let&apos;s create something <span className="accent-text">extraordinary</span>
            </ScrollReveal>

            <FadeReveal delay={0.1}>
              <p
                style={{
                  color: '#1a1a1a',
                  lineHeight: 1.8,
                  marginBottom: 36,
                  fontSize: '1rem',
                  fontFamily: 'Montserrat, sans-serif',
                  opacity: 1,
                }}
              >
                Have a project in mind, a visual campaign, or need creative direction? Reach out directly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {meta?.email && (
                  <a
                    href={`mailto:${meta.email}`}
                    className="contact-card-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#000000',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconMail size={20} color="#FFFFFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#000000',
                          opacity: 1,
                          marginBottom: 2,
                        }}
                      >
                        Email Address
                      </div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          color: '#000000',
                          opacity: 1,
                        }}
                      >
                        {meta.email}
                      </div>
                    </div>
                    <IconArrowUpRight size={18} color="#000000" style={{ opacity: 0.6 }} />
                  </a>
                )}

                {meta?.phone && (
                  <a
                    href={`tel:${meta.phone}`}
                    className="contact-card-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#000000',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconPhone size={20} color="#FFFFFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#000000',
                          opacity: 1,
                          marginBottom: 2,
                        }}
                      >
                        Phone Number
                      </div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          color: '#000000',
                          opacity: 1,
                        }}
                      >
                        {meta.phone}
                      </div>
                    </div>
                    <IconArrowUpRight size={18} color="#000000" style={{ opacity: 0.6 }} />
                  </a>
                )}

                {meta?.location && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#000000',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconPin size={20} color="#FFFFFF" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#000000',
                          opacity: 1,
                          marginBottom: 2,
                        }}
                      >
                        Location
                      </div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          color: '#000000',
                          opacity: 1,
                        }}
                      >
                        {meta.location}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Profiles */}
                {displayLinks.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#000000',
                        opacity: 1,
                      }}
                    >
                      Social Profiles
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                      {displayLinks.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-chip"
                          title={`Follow ${item.handle} on ${item.platform}`}
                        >
                          <span className="social-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {renderPlatformIcon(item.platform, 16)}
                          </span>
                          <span className="social-handle-text">{item.handle}</span>
                          <span className="social-arrow">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FadeReveal>
          </div>

          {/* Right Column: Form */}
          <FadeReveal delay={0.15}>
            {sent ? (
              <div
                className="glass"
                style={{
                  padding: 48,
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                }}
              >
                <div style={{ display: 'inline-flex', marginBottom: 18, color: '#000000' }}>
                  <IconCheckCircle size={56} color="#000000" />
                </div>
                <div
                  style={{
                    fontFamily: 'Gued, sans-serif',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#000000',
                    opacity: 1,
                  }}
                >
                  Message Sent!
                </div>
                <p
                  style={{
                    color: '#222222',
                    marginTop: 12,
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.95rem',
                    opacity: 1,
                  }}
                >
                  Thank you! I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass"
                style={{
                  padding: 40,
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  border: '1px solid rgba(0, 0, 0, 0.10)',
                }}
              >
                {[
                  ['name', 'Your Name', 'text'],
                  ['email', 'Your Email', 'email'],
                ].map(([k, ph, t]) => (
                  <div key={k}>
                    <label
                      style={{
                        fontSize: '0.74rem',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#000000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        marginBottom: 8,
                        display: 'block',
                        opacity: 1,
                      }}
                    >
                      {k}
                    </label>
                    <input
                      type={t}
                      required
                      placeholder={ph}
                      value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#000000')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
                    />
                  </div>
                ))}
                <div>
                  <label
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#000000',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                      marginBottom: 8,
                      display: 'block',
                      opacity: 1,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => (e.target.style.borderColor = '#000000')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-accent"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '14px 28px',
                  }}
                >
                  {sending ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </FadeReveal>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){#contact .container > div{grid-template-columns:1fr!important}}
        .contact-card-link:hover {
          border-color: rgba(0, 0, 0, 0.35) !important;
          background: rgba(0, 0, 0, 0.05) !important;
          transform: translateY(-2px);
        }
        .contact-social-chip {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 16px;
          border-radius: 30px;
          background: #ffffff;
          border: 1.5px solid rgba(0, 0, 0, 0.16);
          color: #000000;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-social-chip .social-arrow {
          font-size: 0.75rem;
          opacity: 0.45;
          margin-left: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .contact-social-chip:hover {
          background: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22) !important;
        }
        .contact-social-chip:hover .social-handle-text {
          color: #ffffff !important;
        }
        .contact-social-chip:hover .social-arrow {
          opacity: 1 !important;
          color: #ffffff !important;
          transform: translate(2px, -2px);
        }
        .contact-social-chip:hover svg.icon-stroke {
          stroke: #ffffff !important;
        }
        .contact-social-chip:hover svg.icon-fill {
          fill: #ffffff !important;
        }
      `}</style>
    </section>
  );
}
