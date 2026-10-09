'use client';
import { useState, useEffect } from 'react';
import { supabase, getProcessSteps } from '@/lib/supabase';

const DEFAULT_STEPS = [
  { step_number: 1, icon: '🔍', title: 'Research', description: 'Deep dive into the brief, market, and target audience to define the creative direction.' },
  { step_number: 2, icon: '✏️', title: 'Concept', description: 'Sketch multiple directions and select the strongest path forward.' },
  { step_number: 3, icon: '🎨', title: 'Design', description: 'Craft pixel-perfect visuals with purpose, intent, and obsessive attention to detail.' },
  { step_number: 4, icon: '🚀', title: 'Deliver', description: 'Final handoff with full assets, style guides, and documentation.' },
];

export default function AdminProcess() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    setLoading(true);
    const data = await getProcessSteps();
    if (data && data.length > 0) {
      setSteps(data);
    } else {
      setSteps(DEFAULT_STEPS);
    }
    setLoading(false);
  };

  const updateStep = (index, field, value) => {
    setSaved(false);
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const step of steps) {
        if (step.id) {
          await supabase.from('process_steps').update({
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            icon: step.icon || '✦',
          }).eq('id', step.id);
        } else {
          await supabase.from('process_steps').insert({
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            icon: step.icon || '✦',
          });
        }
      }
      await loadSteps();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving process steps: ' + err.message);
    }
    setSaving(false);
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
    transition: 'border-color 0.2s, background 0.2s',
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(0, 0, 0, 0.15)',
          borderTopColor: '#000000',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'rgba(0, 0, 0, 0.60)', fontSize: '0.88rem' }}>Loading Process Steps...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Gued, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#000000' }}>
            My Process (How I Work)
          </h2>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', fontSize: '0.875rem', marginTop: 4 }}>
            Edit the 4-step creative workflow displayed on your portfolio
          </p>
        </div>
        <button onClick={handleSaveAll} disabled={saving} className="btn-accent" style={{ padding: '10px 24px' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Process Steps'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 32 }}>
        {steps.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.10)',
              borderRadius: 'var(--radius, 16px)',
              padding: 24,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.8rem' }}>{s.icon || '✦'}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>
                  Step 0{s.step_number || idx + 1}
                </span>
              </div>
              <input
                type="text"
                value={s.icon || ''}
                onChange={e => updateStep(idx, 'icon', e.target.value)}
                placeholder="Emoji icon (e.g. 🔍)"
                style={{
                  width: 60,
                  textAlign: 'center',
                  background: '#FAFAFA',
                  border: '1px solid rgba(0, 0, 0, 0.14)',
                  borderRadius: 8,
                  padding: '6px',
                  fontSize: '1.1rem',
                }}
                title="Change icon"
              />
            </div>

            <div>
              <label style={labelStyle}>Step Title</label>
              <input
                type="text"
                value={s.title || ''}
                onChange={e => updateStep(idx, 'title', e.target.value)}
                placeholder="e.g. Research, Concept, Design"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Step Description</label>
              <textarea
                rows={3}
                value={s.description || ''}
                onChange={e => updateStep(idx, 'description', e.target.value)}
                placeholder="Describe what happens in this step..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                onFocus={e => { e.target.style.borderColor = '#000000'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0, 0, 0, 0.16)'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSaveAll} disabled={saving} className="btn-accent" style={{ width: '100%', padding: 14 }}>
        {saving ? 'Saving...' : saved ? '✓ Process Steps Saved!' : 'Save Process Steps'}
      </button>
    </div>
  );
}
