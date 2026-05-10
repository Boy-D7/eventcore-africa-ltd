'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Header from '@/components/Header'
import AuthModal from '@/components/AuthModal'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Sync Auth State with Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f6fb', fontFamily: 'system-ui, sans-serif' }}>

        {/* AUTHENTICATION MODAL */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {/* 1. OVERLAY (Blurred background when menu is open) */}
        {isOpen && <div onClick={() => setIsOpen(false)} style={overlayStyle} />}

        {/* 2. SIDEBAR NAVIGATION */}
        <nav style={{ ...sidebarStyle, left: isOpen ? '0' : '-320px' }}>
          
          {/* UPDATED EVENTCORE AFRICA LIMITED BRANDING */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', lineHeight: 1, color: '#0f172a' }}>
                EVENTCORE
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', color: '#2563eb', marginTop: '2px' }}>
                AFRICA LIMITED
              </span>
              <span style={{ fontSize: '0.45rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '3px' }}>
                A Digital Event Infrastructure
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏠 Home</Link>
            <Link href="/events" onClick={() => setIsOpen(false)} style={navLinkStyle}>📅 Events</Link>
            <Link href="/admin/booth" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏪 Booth Agent</Link>

            <Link href="/scanner" onClick={() => setIsOpen(false)} style={navLinkStyle}>📷 Gate Scanner</Link>

            {/* ADMIN DASHBOARD LINK (Highlighted for Admin usage) */}
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)} 
              style={{ ...navLinkStyle, background: '#eff6ff', color: '#1e40af', marginTop: '12px', border: '1px solid #dbeafe' }}
            >
              📈 Admin Dashboard
            </Link>
          </div>

          {/* SIDEBAR FOOTER (User Status) */}
          <div style={sidebarFooter}>
            {user ? (
              <>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px' }}>Logged in as</p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', wordBreak: 'break-all' }}>{user.email}</p>
                <button onClick={() => supabase.auth.signOut()} style={logoutBtn}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} style={loginBtn}>Login to Admin</button>
            )}
          </div>
        </nav>

        {/* 3. DYNAMIC HEADER */}
        <Header 
          user={user} 
          onMenuClick={() => setIsOpen(true)} 
          onAuthClick={() => setIsAuthOpen(true)} 
        />

        {/* 4. MAIN PAGE CONTENT */}
        <main style={{ paddingTop: '80px', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
          {children}
        </main>

      </body>
    </html>
  )
}

// --- Layout Styles ---
const sidebarStyle: React.CSSProperties = { 
  position: 'fixed', top: 0, bottom: 0, width: '280px', background: '#fff', 
  zIndex: 2000, transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', padding: '24px', 
  display: 'flex', flexDirection: 'column', boxShadow: '10px 0 30px rgba(0,0,0,0.05)'
};

const overlayStyle: React.CSSProperties = { 
  position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.3)', 
  backdropFilter: 'blur(6px)', zIndex: 1000 
};

const closeBtnStyle = { background: 'none', border: 'none', fontSize: '1.4rem', color: '#94a3b8', cursor: 'pointer', padding: 0, marginTop: '-4px' };

const navLinkStyle = { 
  padding: '14px 18px', borderRadius: '16px', color: '#334155', 
  textDecoration: 'none', fontWeight: 600, background: '#f8fafc', 
  display: 'block', fontSize: '0.95rem' 
};

const sidebarFooter = { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9' };

const logoutBtn = { color: '#ef4444', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.9rem' };

const loginBtn = { color: '#2563eb', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.9rem' };
