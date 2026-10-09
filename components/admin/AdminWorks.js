'use client';
import { useState, useMemo, useRef } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { parseVideoUrl } from '@/lib/videoHelper';

// ── Config for each category ──────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  video: {
    label: 'Videos',
    thumb: item => item.image_url || null,
    fields: [
      { key: 'title',           label: 'Video Title',      type: 'text',      required: true, placeholder: 'e.g. Miyasiya Brand Teaser' },
      { key: 'orientation',     label: 'Orientation / Aspect Ratio', type: 'select', options: ['portrait', 'landscape'] },
      { key: 'video_url',       label: 'Video File or URL', type: 'videoupload' },
      { key: 'image_url',       label: 'Cover Photo / Custom Thumbnail', type: 'imgupload', bucket: 'images' },
      { key: 'client',          label: 'Client / Project',  type: 'text',      placeholder: 'e.g. Miyasiya 26 / Brand Name' },
      { key: 'description',     label: 'Description',      type: 'textarea',  placeholder: 'About this video...' },
      { key: 'social_platform', label: 'Social Platform',  type: 'select',    options: ['', 'instagram', 'youtube', 'tiktok', 'facebook', 'twitter', 'vimeo'] },
      { key: 'social_link',     label: 'Social Link URL',  type: 'text',      placeholder: 'https://instagram.com/...' },
      { key: 'stats_views',     label: 'Views',            type: 'text',      placeholder: 'e.g. 1.2M' },
      { key: 'stats_likes',     label: 'Likes',            type: 'text',      placeholder: 'e.g. 45K' },
      { key: 'stats_comments',  label: 'Comments',         type: 'text',      placeholder: 'e.g. 230' },
    ],
  },
  photography: {
    label: 'Photography',
    fields: [
      { key: 'title',       label: 'Title',       type: 'text',      required: true, placeholder: 'Photo title' },
      { key: 'image_url',   label: 'Photo',       type: 'imgupload', bucket: 'photos' },
      { key: 'location',    label: 'Location',    type: 'text',      placeholder: 'e.g. Bali, Indonesia' },
      { key: 'description', label: 'Description', type: 'textarea',  placeholder: 'Caption or description...' },
    ],
  },
  social_media: {
    label: 'Social Media Posters',
    fields: [
      { key: 'title',           label: 'Poster Title / Caption',type: 'text',      required: true, placeholder: 'Poster title' },
      { key: 'image_url',       label: 'Poster Image (1080×1350)', type: 'imgupload', bucket: 'images' },
      { key: 'client',          label: 'Campaign / Album Name', type: 'text',      placeholder: 'e.g. Miyasiya 26 — leave blank for standalone' },
      { key: 'social_platform', label: 'Platform',              type: 'select',    options: ['', 'instagram', 'facebook', 'tiktok', 'twitter', 'linkedin', 'youtube'] },
      { key: 'link',            label: 'Post URL',              type: 'text',      placeholder: 'https://instagram.com/p/...' },
      { key: 'description',     label: 'Caption / Notes',       type: 'textarea',  placeholder: 'Poster details or caption...' },
    ],
  },
  branding: {
    label: 'Branding & Mockups',
    fields: [
      { key: 'title',       label: 'Design Title / Mockup Name', type: 'text',      required: true, placeholder: 'e.g. Streetwear Tee Mockup, City Billboard, etc.' },
      { key: 'image_url',   label: 'Mockup Image (1080×1350)', type: 'imgupload', bucket: 'images' },
      { key: 'client',      label: 'Category / Client',          type: 'text',      placeholder: 'e.g. T-Shirt Design, Billboard OOH, Packaging' },
      { key: 'description', label: 'Description & Specs',        type: 'textarea',  placeholder: 'Details about the design concept, print specifications...' },
    ],
  },
  logo: {
    label: 'Logo Design',
    fields: [
      { key: 'title',       label: 'Logo Name',  type: 'text',      required: true, placeholder: 'Logo name' },
      { key: 'image_url',   label: 'Logo File',  type: 'imgupload', bucket: 'images' },
      { key: 'client',      label: 'Client',     type: 'text',      placeholder: 'Client name' },
      { key: 'description', label: 'Notes',      type: 'textarea',  placeholder: 'Design notes...' },
    ],
  },
  uiux: {
    label: 'UI / UX',
    fields: [
      { key: 'title',       label: 'Project Name', type: 'text',      required: true, placeholder: 'Project name' },
      { key: 'image_url',   label: 'Screenshot',   type: 'imgupload', bucket: 'images' },
      { key: 'link',        label: 'Live URL',     type: 'text',      placeholder: 'https://...' },
      { key: 'description', label: 'Description',  type: 'textarea',  placeholder: 'What is this project about?' },
    ],
  },
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminWorks({ category, items = [], onUpdate, loading = false }) {
  const [modal,          setModal]          = useState(null);
  const [form,           setForm]           = useState({});
  const [saving,         setSaving]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Batch Upload state
  const [selectedAlbum,  setSelectedAlbum]  = useState('all');
  const [batchModal,     setBatchModal]     = useState(false);
  const [batchAlbum,     setBatchAlbum]     = useState('');
  const [batchLocation,  setBatchLocation]  = useState('');
  const [batchFiles,     setBatchFiles]     = useState([]);
  const [batchPrefix,    setBatchPrefix]    = useState('');
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchStatus,    setBatchStatus]    = useState('');
  const [dragActive,     setDragActive]     = useState(false);
  const batchFileInputRef = useRef(null);

  const config = CATEGORY_CONFIG[category] || { label: category, fields: [] };

  // Calculate unique existing albums
  const existingAlbums = useMemo(() => {
    if (category !== 'social_media') return [];
    const set = new Set();
    items.forEach(i => {
      const c = i.client?.trim();
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [items, category]);

  // Filter items based on active album
  const displayedItems = useMemo(() => {
    if (category !== 'social_media' || selectedAlbum === 'all') return items;
    return items.filter(i => i.client?.trim() === selectedAlbum);
  }, [items, category, selectedAlbum]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openAdd = (defaultAlbum = '') => {
    setForm({
      category,
      client: defaultAlbum,
      orientation: category === 'video' ? 'portrait' : undefined,
    });
    setModal('new');
  };
  const openEdit = (item) => {
    setForm({
      ...item,
      orientation: category === 'video' ? (item.orientation || 'portrait') : item.orientation,
    });
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setForm({}); };

  const openBatchModal = (defaultAlbum = '') => {
    if (category === 'social_media') {
      setBatchAlbum(defaultAlbum || (existingAlbums[0] || 'Miyasiya 26'));
    } else {
      setBatchAlbum('');
    }
    setBatchLocation('');
    setBatchFiles([]);
    setBatchPrefix('');
    setBatchStatus('');
    setDragActive(false);
    setBatchModal(true);
  };
  const closeBatchModal = () => {
    if (batchUploading) return;
    setBatchModal(false);
    setBatchFiles([]);
    setDragActive(false);
  };

  const handleBatchFileSelect = (newFiles) => {
    if (!newFiles || !newFiles.length) return;
    const fileList = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (!fileList.length) {
      alert('Please select valid image files (JPG, PNG, WebP, etc.).');
      return;
    }
    const oversized = fileList.filter(f => f.size > 50 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`${oversized.length} file(s) exceed 50MB and were skipped.`);
    }
    const valid = fileList.filter(f => f.size <= 50 * 1024 * 1024);
    setBatchFiles(prev => {
      const existingNames = new Set(prev.map(p => p.name + p.size));
      const newlyAdded = valid.filter(v => !existingNames.has(v.name + v.size));
      return [...prev, ...newlyAdded];
    });
  };

  const removeBatchFile = (idxToRemove) => {
    setBatchFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) {
      handleBatchFileSelect(e.dataTransfer.files);
    }
  };

  const refresh = async () => {
    const { data } = await supabase
      .from('works').select('*')
      .eq('category', category)
      .order('sort_order');
    onUpdate(data || []);
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB).\n` +
        `Supabase free tier storage has a 50MB limit per file.`
      );
      return;
    }

    const bucket = field.bucket || (field.type === 'videoupload' ? 'videos' : 'images');
    const ext    = file.name.split('.').pop();
    const path   = `${category}/${Date.now()}.${ext}`;
    setUploadProgress(p => ({ ...p, [field.key]: true }));
    try {
      const url = await uploadFile(bucket, file, path);
      set(field.key, url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploadProgress(p => ({ ...p, [field.key]: false }));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { alert('Title is required'); return; }
    setSaving(true);
    let result;
    if (form.id) {
      const { id, created_at, ...updateData } = form;
      result = await supabase.from('works').update(updateData).eq('id', id);
    } else {
      const { id, created_at, ...insertData } = form;
      result = await supabase.from('works').insert({ ...insertData, category });
    }
    if (result.error) {
      alert('Error: ' + result.error.message);
      setSaving(false);
      return;
    }
    await refresh();
    setSaving(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await supabase.from('works').delete().eq('id', id);
    onUpdate(items.filter(i => i.id !== id));
  };

  // Batch upload execution
  const handleBatchUpload = async () => {
    if (!batchFiles.length) {
      alert(`Please select at least one ${category === 'photography' ? 'photo' : 'poster'} image file.`);
      batchFileInputRef.current?.click();
      return;
    }
    if (category === 'social_media' && !batchAlbum?.trim()) {
      alert('Please specify an album name (e.g. Miyasiya 26).');
      return;
    }

    setBatchUploading(true);
    const toInsert = [];
    const bucket = category === 'photography' ? 'photos' : 'images';
    const total = batchFiles.length;

    for (let i = 0; i < total; i++) {
      const file = batchFiles[i];
      setBatchStatus(`Uploading ${category === 'photography' ? 'photo' : 'poster'} ${i + 1} of ${total}: ${file.name}...`);
      try {
        const ext = file.name.split('.').pop();
        const path = `${category}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const url = await uploadFile(bucket, file, path);

        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const title = batchPrefix?.trim()
          ? `${batchPrefix.trim()} ${i + 1}`
          : cleanName;

        if (category === 'photography') {
          toInsert.push({
            category: 'photography',
            title: title,
            image_url: url,
            location: batchLocation?.trim() || null,
          });
        } else {
          toInsert.push({
            category: 'social_media',
            title: title,
            client: batchAlbum.trim(),
            image_url: url,
            social_platform: 'instagram',
          });
        }
      } catch (err) {
        alert(`Failed to upload ${file.name}: ${err.message}`);
        setBatchUploading(false);
        setBatchStatus('');
        return;
      }
    }

    setBatchStatus('Saving to database...');
    const { error } = await supabase.from('works').insert(toInsert);
    if (error) {
      alert('Error saving to database: ' + error.message);
      setBatchUploading(false);
      setBatchStatus('');
      return;
    }

    await refresh();
    setBatchUploading(false);
    setBatchStatus('');
    closeBatchModal();
    alert(`Successfully added ${toInsert.length} ${category === 'photography' ? 'photos' : `posters to album "${batchAlbum.trim()}"`}!`);
  };

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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Gued, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#000000' }}>
            {config.label}
          </h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.875rem', marginTop: 4 }}>
            {items.length} total {category === 'social_media' ? 'poster' : category === 'photography' ? 'photo' : 'item'}{items.length !== 1 ? 's' : ''} {category === 'social_media' && existingAlbums.length ? `across ${existingAlbums.length} albums` : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {(category === 'social_media' || category === 'photography') && (
            <button
              type="button"
              onClick={() => openBatchModal(category === 'social_media' && selectedAlbum !== 'all' ? selectedAlbum : '')}
              className="btn-ghost"
              style={{
                padding: '9px 18px',
                fontSize: '0.82rem',
                borderColor: 'rgba(0, 0, 0, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              ⚡ Batch Upload {category === 'photography' ? 'Photos' : 'Posters'}
            </button>
          )}
          <button
            type="button"
            onClick={() => openAdd(category === 'social_media' && selectedAlbum !== 'all' ? selectedAlbum : '')}
            className="btn-accent"
            style={{ padding: '9px 20px', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            + Add Single {category === 'social_media' ? 'Poster' : config.label.replace(/s$/, '')}
          </button>
        </div>
      </div>

      {/* ── Social Media: Album Filter Bar ── */}
      {category === 'social_media' && existingAlbums.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.60)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
              Albums:
            </span>
            <button
              onClick={() => setSelectedAlbum('all')}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                background: selectedAlbum === 'all' ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                color: selectedAlbum === 'all' ? '#FFFFFF' : '#000000',
                border: '1px solid ' + (selectedAlbum === 'all' ? '#000000' : 'rgba(0, 0, 0, 0.12)'),
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              All Posters ({items.length})
            </button>
            {existingAlbums.map(alb => {
              const count = items.filter(i => i.client?.trim() === alb).length;
              const isSel = selectedAlbum === alb;
              return (
                <button
                  key={alb}
                  onClick={() => setSelectedAlbum(alb)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                    background: isSel ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                    color: isSel ? '#FFFFFF' : '#000000',
                    border: '1px solid ' + (isSel ? '#000000' : 'rgba(0, 0, 0, 0.12)'),
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {alb} ({count})
                </button>
              );
            })}
          </div>

          {/* Album quick action banner */}
          {selectedAlbum !== 'all' && (
            <div
              style={{
                marginTop: 16,
                padding: '16px 20px',
                borderRadius: 14,
                background: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#000000' }}>
                  Viewing Album: <span style={{ color: '#000000', textDecoration: 'underline' }}>{selectedAlbum}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.55)', marginTop: 2 }}>
                  {displayedItems.length} poster{displayedItems.length !== 1 ? 's' : ''} in this album
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => openAdd(selectedAlbum)}
                  className="btn-accent"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  + Add Poster to {selectedAlbum}
                </button>
                <button
                  onClick={() => openBatchModal(selectedAlbum)}
                  className="btn-ghost"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', borderColor: 'rgba(0, 0, 0, 0.25)' }}
                >
                  ⚡ Batch Upload to {selectedAlbum}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Items grid */}
      {loading ? (
        <div style={{
          padding: 60, borderRadius: 'var(--radius)', textAlign: 'center',
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid rgba(0, 0, 0, 0.15)',
            borderTopColor: '#000000',
            animation: 'adminSpin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '0.9rem', fontWeight: 600 }}>
            Loading {config.label}...
          </p>
          <style>{`@keyframes adminSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : displayedItems.length === 0 ? (
        <div style={{
          padding: 60, borderRadius: 'var(--radius)', textAlign: 'center',
          background: '#FFFFFF',
          border: '1px dashed rgba(0, 0, 0, 0.18)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>
            {category === 'video' ? '🎬' : category === 'photography' ? '📸' : category === 'social_media' ? '📱' : '🎨'}
          </div>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', marginBottom: 20 }}>
            {selectedAlbum !== 'all' ? `No posters in album "${selectedAlbum}" yet` : `No ${config.label.toLowerCase()} added yet`}
          </p>
          <button onClick={() => openAdd(selectedAlbum !== 'all' ? selectedAlbum : '')} className="btn-accent">
            Add your first {category === 'social_media' ? 'poster' : config.label.replace(/s$/, '').toLowerCase()}
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: category === 'social_media' ? 'repeat(auto-fill, minmax(210px, 1fr))' : 'repeat(3, 1fr)',
          gap: 16
        }}>
          {displayedItems.map(item => (
            <div key={item.id} style={{
              borderRadius: 14, overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.10)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              {/* Thumbnail */}
              {item.image_url ? (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: category === 'social_media'
                    ? '1080 / 1350'
                    : category === 'video'
                      ? (item.orientation === 'portrait' ? '9 / 16' : '16 / 9')
                      : '16 / 9',
                  maxHeight: category === 'video' && item.orientation === 'portrait' ? 240 : undefined,
                  background: 'rgba(0, 0, 0, 0.05)',
                  margin: category === 'video' && item.orientation === 'portrait' ? '0 auto' : undefined,
                }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  {category === 'video' && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
                      padding: '3px 8px', borderRadius: 8,
                      fontSize: '0.68rem', fontWeight: 600, color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span>🖼️ Cover</span>
                      <span style={{ color: 'var(--accent, #CFAA0A)' }}>
                        {item.orientation === 'portrait' ? '9:16' : '16:9'}
                      </span>
                    </div>
                  )}
                  {category === 'social_media' && item.client && (
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
                      padding: '4px 10px', borderRadius: 12,
                      fontSize: '0.72rem', fontWeight: 600, color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}>
                      📁 {item.client}
                    </div>
                  )}
                </div>
              ) : (() => {
                const parsed = parseVideoUrl(item.video_url);
                if (parsed?.thumbnailUrl) {
                  return (
                    <div style={{ position: 'relative', width: '100%', height: 160, background: '#000000', overflow: 'hidden' }}>
                      <img src={parsed.thumbnailUrl} alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => e.target.style.display = 'none'} />
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.30)', color: '#ffffff', fontSize: '1.8rem',
                      }}>▶</div>
                    </div>
                  );
                }
                if (item.video_url) {
                  return (
                    <div style={{ position: 'relative', width: '100%', height: 160, background: '#000000', overflow: 'hidden' }}>
                      <video src={item.video_url} preload="metadata" muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.25)', color: '#ffffff', fontSize: '1.8rem', pointerEvents: 'none',
                      }}>▶</div>
                    </div>
                  );
                }
                return null;
              })()}

              {!item.image_url && !item.video_url && (
                <div style={{
                  height: 100, background: 'rgba(0, 0, 0, 0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', color: 'rgba(0, 0, 0, 0.35)',
                }}>📄</div>
              )}

              {/* Info */}
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontWeight: 600, color: '#000000', fontSize: '0.92rem', marginBottom: 4, lineHeight: 1.3 }}>
                  {item.title}
                </div>
                {item.client && category !== 'social_media' && (
                  <div style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.55)', marginBottom: 8 }}>{item.client}</div>
                )}
                {item.orientation && (
                  <div style={{
                    display: 'inline-block', fontSize: '0.68rem', color: '#000000',
                    border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: 4,
                    padding: '2px 7px', marginBottom: 10, textTransform: 'capitalize',
                  }}>{item.orientation}</div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => openEdit(item)} style={{
                    flex: 1, padding: '7px 0', background: 'rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: 8,
                    color: '#000000', cursor: 'pointer', fontSize: '0.78rem',
                    fontWeight: 600,
                  }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{
                    flex: 1, padding: '7px 0', background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 8,
                    color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem',
                    fontWeight: 600,
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Single Modal ── */}
      {modal && (
        <div className="modal-bg" onClick={closeModal}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
              borderRadius: 'var(--radius, 16px)', width: '100%', maxWidth: 620,
              maxHeight: '88vh', overflowY: 'auto', padding: 36,
            }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.3rem' }}>
                {modal === 'edit' ? 'Edit' : 'Add'} {category === 'social_media' ? 'Poster' : config.label.replace(/s$/, '')}
              </h3>
              <button onClick={closeModal} style={{
                background: 'none', border: 'none',
                color: 'rgba(0, 0, 0, 0.45)', fontSize: '1.6rem',
                cursor: 'pointer', lineHeight: 1, padding: 4,
              }}>×</button>
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {config.fields.map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>
                    {field.label}
                    {field.required && <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span>}
                  </label>

                  {/* Special Album quick-select for client field */}
                  {field.key === 'client' && existingAlbums.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.60)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                        Quick-select existing album:
                      </span>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {existingAlbums.map(alb => (
                          <button
                            key={alb}
                            type="button"
                            onClick={() => set('client', alb)}
                            style={{
                              padding: '4px 10px', borderRadius: 14, fontSize: '0.74rem',
                              background: form.client === alb ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                              color: form.client === alb ? '#FFFFFF' : '#000000',
                              border: '1px solid ' + (form.client === alb ? '#000000' : 'rgba(0, 0, 0, 0.12)'),
                              cursor: 'pointer', fontWeight: form.client === alb ? 700 : 500,
                            }}
                          >
                            {alb}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text input with datalist autocomplete */}
                  {field.type === 'text' && (
                    <>
                      <input
                        list={field.key === 'client' ? 'existing-albums-datalist' : undefined}
                        type="text"
                        value={form[field.key] || ''}
                        placeholder={field.placeholder || ''}
                        onChange={e => set(field.key, e.target.value)}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                        onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                      />
                      {field.key === 'client' && (
                        <datalist id="existing-albums-datalist">
                          {existingAlbums.map(alb => <option key={alb} value={alb} />)}
                        </datalist>
                      )}
                    </>
                  )}

                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <textarea
                      rows={4}
                      value={form[field.key] || ''}
                      placeholder={field.placeholder || ''}
                      onChange={e => set(field.key, e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                    />
                  )}

                  {/* Select dropdown */}
                  {field.type === 'select' && (
                    <select
                      value={form[field.key] || ''}
                      onChange={e => set(field.key, e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer', background: '#FAFAFA' }}>
                      {field.options.map(o => {
                        const val = typeof o === 'object' ? o.value : o;
                        const lbl = typeof o === 'object' ? o.label : (
                          field.key === 'orientation'
                            ? (o === 'portrait' ? '📱 Portrait (9:16 — Reels / TikTok / Shorts)' : '🖥 Landscape (16:9 — Widescreen / YouTube)')
                            : (o || '— None —')
                        );
                        return (
                          <option key={val} value={val} style={{ background: '#FFFFFF', color: '#000000' }}>
                            {lbl}
                          </option>
                        );
                      })}
                    </select>
                  )}

                  {/* Image upload */}
                  {field.type === 'imgupload' && (
                    <div>
                      {form[field.key] && (
                        <div style={{
                          position: 'relative',
                          marginBottom: 12,
                          textAlign: category === 'video' && form.orientation === 'portrait' ? 'center' : 'left'
                        }}>
                          <div style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: category === 'video' && form.orientation === 'portrait' ? 190 : '100%',
                            aspectRatio: category === 'video'
                              ? (form.orientation === 'portrait' ? '9 / 16' : '16 / 9')
                              : (category === 'social_media' ? '1080 / 1350' : undefined),
                            background: '#000000',
                            borderRadius: 10,
                            overflow: 'hidden',
                            border: '1.5px solid rgba(0, 0, 0, 0.15)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                          }}>
                            <img src={form[field.key]} alt="Preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                maxHeight: category === 'video'
                                  ? (form.orientation === 'portrait' ? 330 : 220)
                                  : (category === 'social_media' ? 260 : 180),
                                objectFit: category === 'video' ? 'cover' : 'contain',
                                display: 'block',
                              }}
                              onError={e => e.target.style.display = 'none'} />
                            {category === 'video' && (
                              <div style={{
                                position: 'absolute', bottom: 8, left: 8,
                                background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
                                padding: '3px 8px', borderRadius: 6,
                                fontSize: '0.68rem', fontWeight: 600, color: '#FFFFFF',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                              }}>
                                {form.orientation === 'portrait' ? '📱 9:16 Portrait Cover' : '🖥 16:9 Landscape Cover'}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => set(field.key, '')}
                              style={{
                                position: 'absolute', top: 8, right: 8,
                                background: 'rgba(0,0,0,0.75)', color: '#ff6b6b',
                                border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
                                width: 26, height: 26, cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                              title="Remove image">✕</button>
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                        <label className="btn-accent" style={{ cursor: 'pointer', display: 'inline-flex', padding: '8px 16px', fontSize: '0.85rem' }}>
                          {uploadProgress[field.key]
                            ? '⏳ Uploading...'
                            : (category === 'video' ? '📁 Upload Cover Photo' : category === 'social_media' ? '📁 Upload Poster Image' : '📁 Upload Image')}
                          <input
                            type="file" accept="image/*"
                            onChange={e => handleFileUpload(field, e.target.files[0])}
                            style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.55)' }}>
                          {category === 'video' ? 'or paste cover photo URL:' : 'or paste image URL:'}
                        </span>
                      </div>
                      <input
                        type="url"
                        value={form[field.key] || ''}
                        placeholder={category === 'video' ? 'https://... (Cover photo URL or upload file above)' : 'https://... (Direct image URL or upload above)'}
                        onChange={e => set(field.key, e.target.value)}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                        onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                      />
                      <p style={{ fontSize: '0.74rem', color: 'rgba(0, 0, 0, 0.55)', marginTop: 6, lineHeight: 1.5 }}>
                        {category === 'video' ? (
                          form.orientation === 'portrait'
                            ? '📐 Exact ratio: 9:16 portrait (e.g. 1080×1920 px) · Matches your vertical reel / short directly'
                            : '📐 Exact ratio: 16:9 widescreen (e.g. 1920×1080 px) · Matches your landscape video directly'
                        ) : category === 'social_media' ? (
                          '📐 Recommended: 1080×1350 px (4:5 portrait) · JPG, PNG, WebP'
                        ) : category === 'branding' ? (
                          '📐 Recommended: 1080×1350 px (4:5 portrait mockup) or high-res JPG, PNG'
                        ) : (
                          'JPG, PNG, WebP, SVG recommended'
                        )}
                      </p>
                    </div>
                  )}

                  {/* Video upload */}
                  {field.type === 'videoupload' && (
                    <div>
                      {form[field.key] && (() => {
                        const parsed = parseVideoUrl(form[field.key]);
                        const isEmbed = parsed?.type === 'drive' || parsed?.type === 'youtube' || parsed?.type === 'vimeo';
                        return (
                          <div style={{ position: 'relative', marginBottom: 12 }}>
                            {isEmbed ? (
                              <iframe
                                src={parsed.embedUrl}
                                style={{ width: '100%', height: 210, borderRadius: 8, border: 0, background: '#000', display: 'block' }}
                                allow="autoplay; fullscreen"
                                allowFullScreen
                              />
                            ) : (
                              <video src={form[field.key]} controls
                                style={{ width: '100%', maxHeight: 200, borderRadius: 8, background: '#000', display: 'block' }} />
                            )}
                            <button
                              type="button"
                              onClick={() => set(field.key, '')}
                              style={{
                                position: 'absolute', top: 8, right: 8,
                                background: 'rgba(0,0,0,0.85)', color: '#ff6b6b',
                                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
                                width: 26, height: 26, cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10
                              }}
                              title="Remove video">✕</button>
                          </div>
                        );
                      })()}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                        <label className="btn-accent" style={{ cursor: 'pointer', display: 'inline-flex', padding: '8px 16px', fontSize: '0.85rem' }}>
                          {uploadProgress[field.key] ? '⏳ Uploading...' : '🎬 Upload Video File'}
                          <input
                            type="file" accept="video/*"
                            onChange={e => handleFileUpload(field, e.target.files[0])}
                            style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.55)' }}>or paste video URL:</span>
                      </div>
                      <input
                        type="url"
                        value={form[field.key] || ''}
                        placeholder="https://... (Direct video URL, e.g. MP4, or upload above)"
                        onChange={e => set(field.key, e.target.value)}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                        onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                      />
                      <p style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 6, lineHeight: 1.4 }}>
                        MP4, MOV, WebM — Max 50MB per upload on Supabase Storage free plan. For larger videos, host externally (e.g. Cloudinary, YouTube, Google Drive, Vimeo) and paste the direct link.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button onClick={handleSave} disabled={saving} className="btn-accent" style={{ flex: 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={closeModal} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Batch Multi-Item Upload Modal ── */}
      {batchModal && (
        <div className="modal-bg" onClick={closeBatchModal}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
              borderRadius: 'var(--radius)',
              width: '100%',
              maxWidth: 660,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 36,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.4rem' }}>
                  ⚡ Batch Upload {category === 'photography' ? 'Photos' : 'Posters to Album'}
                </h3>
                <p style={{ color: 'rgba(0, 0, 0, 0.60)', fontSize: '0.82rem', marginTop: 4 }}>
                  {category === 'photography'
                    ? 'Upload multiple photography shots at once to your gallery.'
                    : 'Select multiple poster images (1080×1350) at once to add directly to an album.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeBatchModal}
                disabled={batchUploading}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(0, 0, 0, 0.45)', fontSize: '1.6rem',
                  cursor: 'pointer', lineHeight: 1, padding: 4,
                }}
              >
                ×
              </button>
            </div>

            {/* Target Album (for Social Media) or Location (for Photography) */}
            {category === 'social_media' ? (
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>
                  Target Album / Campaign Name <span style={{ color: '#000000' }}>*</span>
                </label>

                {existingAlbums.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.60)', display: 'block', marginBottom: 6 }}>
                      Quick select existing album:
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {existingAlbums.map(alb => (
                        <button
                          key={alb}
                          type="button"
                          onClick={() => setBatchAlbum(alb)}
                          style={{
                            padding: '5px 12px', borderRadius: 16, fontSize: '0.76rem',
                            background: batchAlbum === alb ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                            color: batchAlbum === alb ? '#ffffff' : '#000000',
                            border: '1.5px solid ' + (batchAlbum === alb ? '#000000' : 'rgba(0, 0, 0, 0.14)'),
                            cursor: 'pointer', fontWeight: batchAlbum === alb ? 700 : 600,
                          }}
                        >
                          📁 {alb}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={batchAlbum}
                  onChange={e => setBatchAlbum(e.target.value)}
                  placeholder="e.g. Miyasiya 26"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>
                  Location / Shoot Name (Optional)
                </label>
                <input
                  type="text"
                  value={batchLocation}
                  onChange={e => setBatchLocation(e.target.value)}
                  placeholder="e.g. Bali, Indonesia or Concert 2024"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                />
                <p style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 4 }}>
                  This will be applied to all uploaded photos in this batch (optional).
                </p>
              </div>
            )}

            {/* Choose multiple files dropzone */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                Select {category === 'photography' ? 'Photo' : 'Poster'} Files <span style={{ color: '#000000' }}>*</span>
              </label>

              {/* Hidden file input controlled via batchFileInputRef */}
              <input
                ref={batchFileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={e => {
                  handleBatchFileSelect(e.target.files);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: dragActive ? '2px dashed #000000' : '2px dashed rgba(0, 0, 0, 0.22)',
                  borderRadius: 14,
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: dragActive ? 'rgba(0, 0, 0, 0.05)' : '#FAFAFA',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => batchFileInputRef.current?.click()}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>🖼️</div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    batchFileInputRef.current?.click();
                  }}
                  className="btn-accent"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 24px',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: '#000000',
                    color: '#FFFFFF',
                  }}
                >
                  📂 Choose Multiple Images
                </button>
                <p style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', marginTop: 12 }}>
                  or <strong style={{ color: '#000000' }}>drag &amp; drop</strong> photos here
                </p>
                <p style={{ color: 'rgba(0, 0, 0, 0.50)', fontSize: '0.74rem', marginTop: 4 }}>
                  Select as many photos as you want &bull; JPG, PNG, WEBP up to 50MB each
                </p>
              </div>

              {/* Selected files preview count */}
              {batchFiles.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#000000' }}>
                      ✓ {batchFiles.length} file{batchFiles.length !== 1 ? 's' : ''} ready to upload:
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => batchFileInputRef.current?.click()}
                        style={{
                          background: 'none', border: 'none', color: '#000000',
                          fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600,
                        }}
                      >
                        + Add more
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatchFiles([])}
                        style={{
                          background: 'none', border: 'none', color: '#dc2626',
                          fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600,
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  <div style={{
                    maxHeight: 180, overflowY: 'auto',
                    background: '#FAFAFA', borderRadius: 10, padding: '10px 14px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                  }}>
                    {batchFiles.map((file, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#000000' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 380 }}>
                          <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 600, marginRight: 6 }}>{idx + 1}.</span>
                          {file.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <span style={{ color: 'rgba(0, 0, 0, 0.50)', fontSize: '0.72rem' }}>
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBatchFile(idx)}
                            style={{
                              background: 'none', border: 'none', color: 'rgba(0, 0, 0, 0.45)',
                              fontSize: '0.9rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
                            }}
                            title="Remove this photo"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Title Prefix */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>
                Title Prefix (Optional)
              </label>
              <input
                type="text"
                value={batchPrefix}
                onChange={e => setBatchPrefix(e.target.value)}
                placeholder={
                  category === 'photography'
                    ? 'e.g. "Gallery" (names them: Gallery 1, Gallery 2...)'
                    : `e.g. "${batchAlbum || 'Miyasiya 26'} Poster" (names them: Poster 1, Poster 2...)`
                }
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
              />
              <p style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.50)', marginTop: 4 }}>
                Leave empty to automatically use each image&apos;s filename as the title.
              </p>
            </div>

            {/* Status indicator */}
            {batchStatus && (
              <div style={{
                marginBottom: 20, padding: '12px 16px', borderRadius: 10,
                background: '#FAFAFA', border: '1px solid rgba(0, 0, 0, 0.2)',
                color: '#000000', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600,
              }}>
                ⏳ {batchStatus}
              </div>
            )}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  if (batchUploading) return;
                  if (batchFiles.length === 0) {
                    batchFileInputRef.current?.click();
                    return;
                  }
                  if (category === 'social_media' && !batchAlbum.trim()) {
                    alert('Please enter or select an album name first (e.g. Miyasiya 26).');
                    return;
                  }
                  handleBatchUpload();
                }}
                disabled={batchUploading}
                className="btn-accent"
                style={{
                  flex: 1,
                  padding: '13px 0',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: batchUploading ? 'wait' : 'pointer',
                  opacity: batchUploading ? 0.7 : 1,
                }}
              >
                {batchUploading
                  ? `Uploading... (${batchFiles.length} files)`
                  : batchFiles.length === 0
                  ? `📂 Step 1: Click to Choose ${category === 'photography' ? 'Photos' : 'Posters'}`
                  : `⚡ Upload ${batchFiles.length} ${category === 'photography' ? 'Photo' : 'Poster'}${batchFiles.length > 1 ? 's' : ''} Now`}
              </button>
              <button
                type="button"
                onClick={closeBatchModal}
                disabled={batchUploading}
                className="btn-ghost"
                style={{ flex: 1, cursor: batchUploading ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
