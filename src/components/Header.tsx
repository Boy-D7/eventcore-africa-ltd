'use client'
import { User } from '@supabase/supabase-js'
import { Menu, Bell } from 'lucide-react'

interface HeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onAuthClick: () => void;
}

export default function Header({ user, onMenuClick, onAuthClick }: HeaderProps) {
  return (
    <nav style={headerStyle}>
      <div style={headerContent}>
        
        {/* LEFT: MENU & BRANDING (Closer together) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onMenuClick} style={iconBtn}>
            <Menu size={24} color="#0f172a" />
          </button>

          <div style={brandContainer}>
            <span style={mainLogo}>EVENTCORE</span>
            <span style={subLogo}>AFRICA LIMITED</span>
            <span style={tagline}>A Digital Event Infrastructure</span>
          </div>
        </div>

        {/* RIGHT: NOTIFICATIONS & AUTH */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button style={iconBtn}>
            <Bell size={20} color="#64748b" />
          </button>

          {user ? (
            <button onClick={onAuthClick} style={profileBtnStyle}>
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

// --- PRODUCTION STYLES ---
const headerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  background: 'rgba(255,255,255,0.98)', 
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #f1f5f9',
  zIndex: 1000,
  height: '72px', 
  display: 'flex',
  alignItems: 'center'
};

const headerContent: React.CSSProperties = {
  maxWidth: '480px',
  margin: '0 auto',
  width: '100%',
  padding: '0 16px', 
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const brandContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  lineHeight: 1.1
};

const mainLogo = {
  fontWeight: 900,
  fontSize: '1.1rem',
  color: '#0f172a',
  letterSpacing: '-0.5px'
};

const subLogo = {
  fontSize: '0.55rem',
  fontWeight: 700,
  letterSpacing: '1.2px',
  color: '#2563eb',
  marginTop: '1px'
};

const tagline = {
  fontSize: '0.42rem',
  fontWeight: 600,
  color: '#94a3b8',
  letterSpacing: '0.3px',
  textTransform: 'uppercase' as const,
  marginTop: '1px'
};

const iconBtn = {
  background: 'none',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const signInBtnStyle = {
  background: '#0f172a',
  color: '#fff',
  border: 'none', 
  padding: '10px 20px',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer'
};

const profileBtnStyle = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
};
