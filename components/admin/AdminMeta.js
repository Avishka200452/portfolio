'use client';
import { useState, useEffect } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';

export default function AdminMeta({ meta, onUpdate }) {
  const [form,        setForm]        = useState(meta || {});
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [saved,       setSaved]       = useState(false);

  useEffect(() => {
    if (meta) {
      setForm(meta);
    }
  }, [meta]);

  const set = (key, val) => {
    setSaved(false);
    setForm(f => ({ ...f, [key]: val }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `profile/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const url  = await uploadFile('images', file, path);
      set('photo_url', url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please select a valid PDF file (.pdf)');
      return;
    }
    setUploadingCv(true);
    try {
      const cleanFileName = file.name.replace(/\s/g, '_');
      const path = `cv/${Date.now()}_${cleanFileName}`;
      const url  = await uploadFile('images', file, path);
      set('resume_url', url);
      // Auto-save resume_url to Supabase immediately so the uploaded CV is saved right away
      const updated = { ...form, resume_url: url, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('portfolio_meta').upsert(updated);
      if (error) {
        console.warn('Auto-save error:', error.message);
      } else {
        if (onUpdate) onUpdate(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('CV Upload failed: ' + err.message);
    }
    setUploadingCv(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('portfolio_meta')
      .upsert({ ...form, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      onUpdate(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const FIELDS = [
    { key: 'name',       label: 'Your Name',       type: 'text',  placeholder: 'e.g. Alex Johnson' },
    { key: 'tagline',    label: 'Tagline',         type: 'text',  placeholder: 'e.g. Visual Designer & Content Creator' },
    { key: 'email',      label: 'Email',           type: 'email', placeholder: 'hello@example.com' },
    { key: 'phone',      label: 'Phone',           type: 'text',  placeholder: '+1 (555) 000-0000' },
    { key: 'location',   label: 'Location',        type: 'text',  placeholder: 'e.g. New York, USA' },
  ];

  const inputStyle = {
    width: '100%',
    background: '#FAFAFA',
    border: '1.5px solid rgba(0, 0, 0, 0.16)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#000000',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    fontSize: '0.74rem',
    color: 'rgba(0, 0, 0, 0.70)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
    display: 'block',
  };

  const cardStyle = {
    padding: 28,
    borderRadius: 'var(--radius, 16px)',
    marginBottom: 24,
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <h2 style={{ fontFamily: 'Gued, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#000000' }}>
            Profile Settings
          </h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.875rem', marginTop: 6 }}>
            Your personal information shown on the portfolio
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-accent">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Photo upload */}
      <div style={cardStyle}>
        <label style={labelStyle}>Profile Photo</label>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {form.photo_url ? (
            <img src={form.photo_url} alt="Profile"
              style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(0, 0, 0, 0.25)' }} />
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: 12, background: 'rgba(0, 0, 0, 0.04)',
              border: '2px dashed rgba(0, 0, 0, 0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>📸</div>
          )}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <label className="btn-accent" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                {uploading ? '⏳ Uploading...' : '📁 Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
              {form.photo_url && (
                <button
                  type="button"
                  onClick={() => set('photo_url', '')}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Remove Photo
                </button>
              )}
            </div>
            <input
              type="url"
              value={form.photo_url || ''}
              placeholder="https://... (Direct photo URL or upload button)"
              onChange={e => set('photo_url', e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 6 }}>JPG, PNG, WebP — uploaded to Supabase Storage or direct link</p>
          </div>
        </div>
      </div>

      {/* Resume / CV PDF upload */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Resume / Curriculum Vitae (PDF)</label>
          {form.resume_url && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#16a34a',
              background: 'rgba(22, 163, 74, 0.10)',
              padding: '3px 10px',
              borderRadius: 12,
              border: '1px solid rgba(22, 163, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              ✓ Active CV Live
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 90,
            height: 90,
            borderRadius: 12,
            background: form.resume_url ? 'rgba(220, 38, 38, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            border: form.resume_url ? '1.5px solid rgba(220, 38, 38, 0.25)' : '2px dashed rgba(0, 0, 0, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            gap: 2
          }}>
            <span style={{ fontSize: '2rem' }}>📄</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: form.resume_url ? '#dc2626' : 'rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>
              PDF
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <label className="btn-accent" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                {uploadingCv ? '⏳ Uploading PDF...' : '📁 Upload CV (PDF File)'}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleCvUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {form.resume_url && (
                <>
                  <a
                    href={form.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', textDecoration: 'none' }}
                  >
                    View / Test Download ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => set('resume_url', '')}
                    className="btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' }}
                  >
                    Remove CV
                  </button>
                </>
              )}
            </div>

            <input
              type="url"
              value={form.resume_url || ''}
              placeholder="https://... (Direct PDF link or click Upload CV above)"
              onChange={e => set('resume_url', e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 6 }}>
              Upload your CV as a PDF file. Customers will be able to download it with one click from the About Me section.
            </p>
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {FIELDS.map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key] || ''}
                placeholder={f.placeholder}
                onChange={e => set(f.key, e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div style={cardStyle}>
        <label style={labelStyle}>Bio / About Text</label>
        <textarea
          rows={6}
          value={form.bio || ''}
          placeholder="Write a short bio about yourself, your skills, and what you do..."
          onChange={e => set('bio', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
          onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
        />
        <p style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 8 }}>
          {(form.bio || '').length} characters — first 160 shown in hero section
        </p>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-accent" style={{ width: '100%', padding: 16 }}>
        {saving ? 'Saving...' : saved ? '✓ Changes Saved!' : 'Save All Changes'}
      </button>
    </div>
  );
}
