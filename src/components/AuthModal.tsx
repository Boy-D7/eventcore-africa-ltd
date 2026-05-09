'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1. Logic for Social Logins (Google & Facebook)
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin, // Returns user to the current page after login
      },
    });
    if (error) alert(error.message);
  };

  // 2. Logic for Magic Link (Email)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Success! Check your email for a secure login link.');
      onClose(); // Close modal after sending
    }
    setLoading(false);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Welcome</h2>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>Sign in or create an account</p>

        {/* FACEBOOK BUTTON */}
        <button onClick={() => handleSocialLogin('facebook')} style={socialBtn}>
          <span style={{ fontSize: '1.4rem' }}>📘</span> 
          <span style={{ flex: 1, color: '#1877f2' }}>Continue with Facebook</span>
        </button>

        {/* GOOGLE BUTTON */}
        <button onClick={() => handleSocialLogin('google')} style={socialBtn}>
          <span style={{ fontSize: '1.4rem' }}>🌐</span> 
          <span style={{ flex: 1, color: '#ea4335' }}>Continue with Google</span>
        </button>

        <div style={dividerContainer}>
          <div style={line}></div>
          <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '0.9rem' }}>or</span>
          <div style={line}></div>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmailLogin}>
          <input 
            type="email" 
            placeholder="Email address" 
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" disabled={loading} style={primaryBtnStyle}>
            {loading ? 'Processing...' : 'Continue with Email'}
          </button>
        </form>

        <button onClick={onClose} style={maybeLaterBtn}>Maybe later</button>
      </div>
    </div>
  );
}

// --- Wired Styles to Match your Image ---
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const modalStyle: React.CSSProperties = { background: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '40px 24px', width: '100%', maxWidth: '480px', textAlign: 'center', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' };
const socialBtn: React.CSSProperties = { width: '100%', padding: '16px', borderRadius: '40px', fontWeight: 600, marginBottom: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem' };
const dividerContainer = { display: 'flex', alignItems: 'center', margin: '24px 0' };
const line = { flex: 1, height: '1px', background: '#e2e8f0' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '18px 24px', borderRadius: '40px', border: '1px solid #cbd5e1', marginBottom: '16px', fontSize: '1rem', outline: 'none' };
const primaryBtnStyle = { width: '100%', background: '#2563eb', color: 'white', padding: '18px', borderRadius: '40px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' };
const maybeLaterBtn = { marginTop: '20px', background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' };
