'use client'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onAuthClick: () => void;
}

export default function Header({ user, onMenuClick, onAuthClick }: HeaderProps) {
  return (
    <nav style={headerStyle}>
      <div style={headerContent}>
        {/* Hamburger Menu Toggle */}
        <button onClick={onMenuClick} style={hamburgerBtn}>☰</button>
        
        {/* Brand Identity */}
        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', flex: 1, textAlign: 'center' }}>
          EVENT<span style={{ color: '#2563eb' }}>CORE</span>
        </div>

        {/* Dynamic Action Button */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <button onClick={onAuthClick} style={profileBtnStyle}>
              {/* If user is logged in, show a profile icon or initial */}
              {user.email?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button onClick={onAuthClick} style={signInBtnStyle}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

// --- Styles ---
const headerStyle: React.CSSProperties = {
  position: 'fixed', top: 0, width: '100%', background: 'rgba(255,255,255,0.95)', 
  backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', zIndex: 100, height: '64px', 
  display: 'flex', alignItems: 'center'
};

const headerContent: React.CSSProperties = {
  maxWidth: '480px', margin: '0 auto', width: '100%', padding: '0 16px', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const hamburgerBtn = {
  background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', padding: '8px', color: '#0f172a'
};

const signInBtnStyle = {
  background: '#0f172a', color: '#fff', border: 'none', 
  padding: '8px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
};

const profileBtnStyle = {
  background: '#2563eb', color: '#fff', border: 'none', width: '36px', height: '36px',
  borderRadius: '50%', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
};
