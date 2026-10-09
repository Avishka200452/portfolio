'use client';
import { useEffect, useState } from 'react';
import { supabase, getMeta, getWorks, getTimeline } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AdminMeta     from '@/components/admin/AdminMeta';
import AdminWorks    from '@/components/admin/AdminWorks';
import AdminTimeline from '@/components/admin/AdminTimeline';
import AdminProcess  from '@/components/admin/AdminProcess';
import AdminSocial   from '@/components/admin/AdminSocial';

const SECTIONS = [
  { id: 'meta',         label: 'Profile',       icon: '👤' },
  { id: 'timeline',     label: 'Timeline',      icon: '📅' },
  { id: 'process',      label: 'My Process',    icon: '⚡' },
  { id: 'social_links', label: 'Social Links',  icon: '🔗' },
  { id: 'video',        label: 'Videos',        icon: '🎬' },
  { id: 'photography',  label: 'Photography',   icon: '📷' },
  { id: 'social_media', label: 'Social Media',  icon: '📱' },
  { id: 'branding',     label: 'Branding',      icon: '🎨' },
  { id: 'logo',         label: 'Logo Design',   icon: '✏️' },
  { id: 'uiux',         label: 'UI / UX',       icon: '🖥️' },
];

export default function AdminDashboard() {
  const router  = useRouter();
  const [active,          setActive]          = useState('meta');
  const [meta,            setMeta]            = useState(null);
  const [worksCache,      setWorksCache]      = useState({});
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [timeline,        setTimeline]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [user,            setUser]            = useState(null);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin');
      } else {
        setUser(data.session.user);
      }
    });
  }, [router]);

  // Load meta + timeline + prefetch categories on mount
  useEffect(() => {
    Promise.all([getMeta(), getTimeline()]).then(([m, t]) => {
      setMeta(m);
      setTimeline(t);
      setLoading(false);
    });

    // Prefetch all work categories in the background so tabs switch instantly
    ['video', 'photography', 'social_media', 'branding', 'logo', 'uiux'].forEach(cat => {
      getWorks(cat).then(items => {
        setWorksCache(prev => ({ ...prev, [cat]: items || [] }));
      });
    });
  }, []);

  // Load / refresh works when category changes
  useEffect(() => {
    if (['meta', 'timeline', 'process', 'social_links'].includes(active)) return;
    if (!worksCache[active]) {
      setLoadingCategory(true);
    }
    getWorks(active).then(items => {
      setWorksCache(prev => ({ ...prev, [active]: items || [] }));
      setLoadingCategory(false);
    }).catch(err => {
      console.error('Failed to load works for', active, err);
      setLoadingCategory(false);
    });
  }, [active]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#FFFFFF',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(0, 0, 0, 0.15)',
            borderTopColor: '#000000',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#000000', display: 'flex' }}>

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside style={{
        width: 250, flexShrink: 0,
        background: '#FAFAFA',
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '0',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 34, height: 34, background: '#000000',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: 'Gued, sans-serif',
              fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem', flexShrink: 0,
            }}>P</div>
            <span style={{ fontFamily: 'Gued, sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.05rem' }}>
              Admin Panel
            </span>
          </div>
          {user && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(0, 0, 0, 0.55)', marginTop: 6, paddingLeft: 44, wordBreak: 'break-all' }}>
              {user.email}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '14px 10px' }}>
          {SECTIONS.map(s => {
            const isSel = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '10px 14px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  background: isSel ? '#000000' : 'transparent',
                  color: isSel ? '#FFFFFF' : 'rgba(0, 0, 0, 0.75)',
                  fontWeight: isSel ? 600 : 500,
                  marginBottom: 3,
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: '0.88rem',
                  transition: 'background 0.2s, color 0.2s',
                }}>
                <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '14px 12px 20px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <a href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', borderRadius: 10, marginBottom: 4,
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.65)', fontSize: '0.82rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#000000'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(0, 0, 0, 0.65)'}>
            🌐 View Portfolio
          </a>
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '9px 14px', borderRadius: 10,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: 'transparent',
            color: 'rgba(0, 0, 0, 0.6)',
            cursor: 'pointer', fontSize: '0.82rem',
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(220, 38, 38, 0.4)'; e.currentTarget.style.color='#dc2626'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0, 0, 0, 0.12)'; e.currentTarget.style.color='rgba(0, 0, 0, 0.6)'; }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', minHeight: '100vh', background: '#FFFFFF' }}>
        {active === 'meta' && (
          <AdminMeta meta={meta} onUpdate={m => setMeta(m)} />
        )}
        {active === 'timeline' && (
          <AdminTimeline items={timeline} onUpdate={setTimeline} />
        )}
        {active === 'process' && (
          <AdminProcess />
        )}
        {active === 'social_links' && (
          <AdminSocial />
        )}
        {!['meta', 'timeline', 'process', 'social_links'].includes(active) && (
          <AdminWorks
            key={active}
            category={active}
            items={worksCache[active] || []}
            loading={loadingCategory && !worksCache[active]}
            onUpdate={newItems => setWorksCache(prev => ({ ...prev, [active]: newItems }))}
          />
        )}
      </main>
    </div>
  );
}
