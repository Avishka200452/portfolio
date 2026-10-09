'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate via server proxy (bypasses browser ad-blockers, Brave shields, and CORS)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        throw new Error('Authentication failed');
      }

      if (data.session) {
        // Sync session into the client-side Supabase instance
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        router.push('/admin/dashboard');
        return;
      }
    } catch (apiErr) {
      // Fallback: direct Supabase client login
      try {
        const { data, error: clientErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (clientErr) {
          if (clientErr.message?.toLowerCase().includes('fetch')) {
            setError('Could not connect to database. Please check your internet connection or disable ad-blockers.');
          } else {
            setError(clientErr.message);
          }
          setLoading(false);
          return;
        }

        if (data?.session) {
          router.push('/admin/dashboard');
          return;
        }
      } catch (err) {
        setError(err.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1.5px solid rgba(0, 0, 0, 0.18)',
    borderRadius: 10,
    padding: '13px 16px',
    color: '#000000',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg, #FFFFFF)',
      padding: 20,
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
        padding: '48px 44px',
        borderRadius: 'var(--radius, 16px)',
        width: '100%',
        maxWidth: 420,
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 60, height: 60, background: '#000000',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
            fontFamily: 'Gued, sans-serif', fontWeight: 700,
            color: '#FFFFFF', fontSize: '1.5rem',
          }}>P</div>
          <h1 style={{
            fontFamily: 'Gued, sans-serif',
            fontSize: '1.7rem', fontWeight: 700, color: '#000000',
          }}>Admin Panel</h1>
          <p style={{ color: 'rgba(0, 0, 0, 0.55)', marginTop: 8, fontSize: '0.875rem' }}>
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'rgba(0, 0, 0, 0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' }}>
              Email
            </label>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#000000'}
              onBlur={e  => e.target.style.borderColor = 'rgba(0, 0, 0, 0.18)'}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'rgba(0, 0, 0, 0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' }}>
              Password
            </label>
            <input
              type="password" required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#000000'}
              onBlur={e  => e.target.style.borderColor = 'rgba(0, 0, 0, 0.18)'}
            />
          </div>

          {error && (
            <div style={{
              color: '#dc2626', fontSize: '0.82rem',
              padding: '10px 14px',
              background: 'rgba(220, 38, 38, 0.08)',
              borderRadius: 8,
              border: '1px solid rgba(220, 38, 38, 0.25)',
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-accent" style={{ marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.78rem', color: 'rgba(0, 0, 0, 0.45)' }}>
          Create your admin account in{' '}
          <a href="https://supabase.com" target="_blank" rel="noopener"
            style={{ color: '#000000', fontWeight: 600, textDecoration: 'underline' }}>
            Supabase Auth
          </a>
        </p>
      </div>
    </div>
  );
}
