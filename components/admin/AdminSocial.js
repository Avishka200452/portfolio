'use client';
import { useState, useEffect } from 'react';
import { supabase, getSocialLinks } from '@/lib/supabase';
import { cleanSocialHandle, cleanSocialUrl, isEmojiOnly } from '@/lib/socialHelper';

const PLATFORM_PRESETS = [
  { platform: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/yourusername', defaultHandle: '@yourusername' },
  { platform: 'LinkedIn',  icon: '💼', placeholder: 'https://linkedin.com/in/yourusername', defaultHandle: 'Your Name' },
  { platform: 'Facebook',  icon: '📘', placeholder: 'https://facebook.com/yourusername', defaultHandle: 'Your Name' },
  { platform: 'Behance',   icon: '🎨', placeholder: 'https://behance.net/yourusername', defaultHandle: 'yourusername' },
  { platform: 'YouTube',   icon: '▶️', placeholder: 'https://youtube.com/@yourchannel', defaultHandle: '@yourchannel' },
  { platform: 'Twitter / X',icon: '🐦', placeholder: 'https://x.com/yourusername', defaultHandle: '@yourusername' },
  { platform: 'Dribbble',  icon: '🏀', placeholder: 'https://dribbble.com/yourusername', defaultHandle: '@yourusername' },
  { platform: 'GitHub',    icon: '💻', placeholder: 'https://github.com/yourusername', defaultHandle: 'yourusername' },
  { platform: 'TikTok',    icon: '🎵', placeholder: 'https://tiktok.com/@yourusername', defaultHandle: '@yourusername' },
];

export default function AdminSocial() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ platform: 'Instagram', url: '', icon: '📸', username: '' });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    const data = await getSocialLinks();
    setLinks(data || []);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url?.trim()) {
      alert('URL is required');
      return;
    }
    setSaving(true);
    try {
      const sanitizedUrl = cleanSocialUrl(form.url);
      const savedIcon = form.username?.trim() || form.icon || '🔗';

      if (form.id && form.id !== 'default-facebook') {
        await supabase.from('social_links').update({
          platform: form.platform,
          url: sanitizedUrl,
          icon: savedIcon,
        }).eq('id', form.id);
      } else {
        await supabase.from('social_links').insert({
          platform: form.platform,
          url: sanitizedUrl,
          icon: savedIcon,
          sort_order: links.length,
        });
      }
      await loadLinks();
      setModal(false);
      setForm({ platform: 'Instagram', url: '', icon: '📸', username: '' });
    } catch (err) {
      alert('Error saving social link: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this social link?')) return;
    if (id !== 'default-facebook') {
      await supabase.from('social_links').delete().eq('id', id);
    }
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const openAdd = () => {
    setForm({ platform: 'Instagram', url: '', icon: '📸', username: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    const handle = cleanSocialHandle(item);
    setForm({
      ...item,
      url: cleanSocialUrl(item.url),
      username: handle,
    });
    setModal(true);
  };

  const inputStyle = {
    width: '100%',
    background: '#FAFAFA',
    border: '1.5px solid rgba(0, 0, 0, 0.16)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#000000',
    fontSize: '0.9rem',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(0, 0, 0, 0.65)',
    display: 'block',
    marginBottom: 8,
    fontFamily: 'Montserrat, sans-serif',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: 'rgba(0, 0, 0, 0.45)', fontFamily: 'Montserrat, sans-serif' }}>
        Loading social links...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Gued, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#000000' }}>
            Social Media Links
          </h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.875rem', marginTop: 4 }}>
            Social media profiles and username handles displayed on your portfolio
          </p>
        </div>
        <button onClick={openAdd} className="btn-accent">
          + Add Social Link
        </button>
      </div>

      {links.length === 0 ? (
        <div style={{
          padding: 60, borderRadius: 'var(--radius, 16px)', textAlign: 'center',
          background: '#FFFFFF', border: '1px dashed rgba(0, 0, 0, 0.18)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', marginBottom: 20 }}>
            No social links added yet. Add your Instagram, LinkedIn, Behance, etc.
          </p>
          <button onClick={openAdd} className="btn-accent">
            + Add First Social Link
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {links.map(l => (
            <div
              key={l.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.10)',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '1.6rem' }}>
                  {isEmojiOnly(l.icon) ? l.icon : (PLATFORM_PRESETS.find(p => p.platform.toLowerCase() === l.platform.toLowerCase())?.icon || '🔗')}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, color: '#000000', fontSize: '0.96rem' }}>{l.platform}</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(0, 0, 0, 0.06)',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                      }}
                    >
                      {cleanSocialHandle(l)}
                    </span>
                  </div>
                  <a
                    href={cleanSocialUrl(l.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(0, 0, 0, 0.50)', fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    {cleanSocialUrl(l.url)}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => openEdit(l)}
                  style={{
                    padding: '6px 14px', background: 'rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: 8,
                    color: '#000000', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(l.id)}
                  style={{
                    padding: '6px 14px', background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 8,
                    color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.14)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius, 16px)',
              width: 500, maxWidth: '95vw', padding: 32,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.3rem' }}>
                {form.id ? 'Edit Social Link' : 'Add Social Link'}
              </h3>
              <button
                onClick={() => setModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(0, 0, 0, 0.45)', fontSize: '1.6rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Platform</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {PLATFORM_PRESETS.map(p => (
                    <button
                      key={p.platform}
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        platform: p.platform,
                        icon: p.icon,
                        username: f.username || (p.platform === 'Instagram' ? '@bambare' : p.platform === 'LinkedIn' ? 'avishka bambaradeniya' : p.platform === 'Facebook' ? 'Avishka Bambaradeniya' : '')
                      }))}
                      style={{
                        padding: '5px 10px', borderRadius: 14, fontSize: '0.74rem',
                        background: form.platform === p.platform ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                        color: form.platform === p.platform ? '#FFFFFF' : '#000000',
                        border: '1px solid ' + (form.platform === p.platform ? '#000000' : 'rgba(0, 0, 0, 0.12)'),
                        cursor: 'pointer', fontWeight: form.platform === p.platform ? 700 : 500,
                      }}
                    >
                      {p.icon} {p.platform}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  placeholder="Platform name (e.g. Instagram)"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Display Username / Handle (Shown on page)</label>
                <input
                  type="text"
                  value={form.username || ''}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="e.g. @bambare or avishka bambaradeniya"
                  style={inputStyle}
                />
                <span style={{ fontSize: '0.74rem', color: 'rgba(0, 0, 0, 0.55)', marginTop: 4, display: 'block' }}>
                  This name/handle is displayed on your website instead of the raw link (e.g. @bambare).
                </span>
              </div>

              <div>
                <label style={labelStyle}>Profile URL</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" disabled={saving} className="btn-accent" style={{ flex: 1, padding: 12 }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
