'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminTimeline({ items, onUpdate }) {
  const [modal,  setModal]  = useState(null); // null | 'new' | 'edit'
  const [form,   setForm]   = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = (type) => { setForm({ type }); setModal('new'); };
  const openEdit = (item) => { setForm({ ...item }); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm({}); };

  const refresh = async () => {
    const { data } = await supabase.from('timeline_items').select('*').order('sort_order');
    onUpdate(data || []);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { alert('Title is required'); return; }
    setSaving(true);
    const payload = {
      type: form.type,
      title: form.title,
      institution: form.institution || '',
      period: form.period || '',
      description: form.description || '',
    };
    if (form.id) {
      await supabase.from('timeline_items').update(payload).eq('id', form.id);
    } else {
      await supabase.from('timeline_items').insert({ ...payload, sort_order: (items || []).length });
    }
    await refresh();
    setSaving(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await supabase.from('timeline_items').delete().eq('id', id);
    onUpdate(items.filter(i => i.id !== id));
  };

  const edu = (items || []).filter(i => i.type === 'education');
  const exp = (items || []).filter(i => i.type === 'experience');

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

  const ItemCard = ({ item }) => (
    <div style={{
      padding: '18px 20px', borderRadius: 12,
      marginBottom: 10, display: 'flex',
      justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
      background: '#FFFFFF',
      border: '1px solid rgba(0, 0, 0, 0.10)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>{item.title}</div>
        <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '0.82rem', marginTop: 3, fontWeight: 500 }}>
          {item.institution}{item.period && ` · ${item.period}`}
        </div>
        {item.description && (
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.8rem', marginTop: 6, lineHeight: 1.5 }}>
            {item.description}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => openEdit(item)} style={{
          padding: '6px 14px', background: 'rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: 8,
          color: '#000000', cursor: 'pointer', fontSize: '0.78rem',
          fontWeight: 600, transition: 'background 0.2s',
        }}>Edit</button>
        <button onClick={() => handleDelete(item.id)} style={{
          padding: '6px 14px', background: 'rgba(220, 38, 38, 0.08)',
          border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 8,
          color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem',
          fontWeight: 600,
        }}>Delete</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <h2 style={{ fontFamily: 'Gued, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#000000' }}>
            Timeline
          </h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.875rem', marginTop: 6 }}>
            Education and work experience shown on the portfolio
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {[
          { label: 'Education', list: edu, type: 'education' },
          { label: 'Experience', list: exp, type: 'experience' },
        ].map(({ label, list, type }) => (
          <div key={type}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16, paddingBottom: 12,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}>
              <h3 style={{
                fontSize: '0.78rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.60)',
                fontWeight: 700,
              }}>{label}</h3>
              <button onClick={() => openAdd(type)} className="btn-accent" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                + Add {label}
              </button>
            </div>

            {list.length === 0 ? (
              <div style={{
                padding: 32, textAlign: 'center', borderRadius: 12,
                border: '1px dashed rgba(0, 0, 0, 0.15)', background: 'rgba(0, 0, 0, 0.02)',
                color: 'rgba(0, 0, 0, 0.45)', fontSize: '0.85rem',
              }}>
                No {label.toLowerCase()} added yet
              </div>
            ) : (
              list.map(item => <ItemCard key={item.id} item={item} />)
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-bg" onClick={closeModal}>
          <div onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
              borderRadius: 'var(--radius, 16px)',
              width: 500, maxWidth: '95vw', padding: 36
            }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28,
            }}>
              <h3 style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.3rem' }}>
                {modal === 'edit' ? 'Edit' : 'Add'} {form.type === 'education' ? 'Education' : 'Experience'}
              </h3>
              <button onClick={closeModal} style={{
                background: 'none', border: 'none', color: 'rgba(0, 0, 0, 0.45)',
                fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1, padding: 4,
              }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { key: 'title',       label: form.type === 'education' ? 'Degree / Program' : 'Job Title', placeholder: form.type === 'education' ? 'e.g. Bachelor of Design' : 'e.g. Senior Designer' },
                { key: 'institution', label: form.type === 'education' ? 'School / University' : 'Company',  placeholder: form.type === 'education' ? 'e.g. State University' : 'e.g. Acme Studio' },
                { key: 'period',      label: 'Time Period', placeholder: 'e.g. 2020 – 2023' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    value={form[key] || ''}
                    placeholder={placeholder}
                    onChange={e => set(key, e.target.value)}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                    onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Description <span style={{ textTransform: 'none', opacity: 0.6 }}>(optional)</span></label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  placeholder="Brief description of what you studied/did..."
                  onChange={e => set('description', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={handleSave} disabled={saving} className="btn-accent" style={{ flex: 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={closeModal} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
