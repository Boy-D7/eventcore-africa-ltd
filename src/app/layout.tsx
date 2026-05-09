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

  // Sync Auth State
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
        
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {/* 1. OVERLAY */}
        {isOpen && <div onClick={() => setIsOpen(false)} style={overlayStyle} />}

        {/* 2. SIDEBAR */}
        <nav style={{ ...sidebarStyle, left: isOpen ? '0' : '-320px' }}>
          <div style={sidebarHeader}>
            <div style={{ fontWeight: 900 }}>MENU</div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏠 Home</Link>
            <Link href="/events" onClick={() => setIsOpen(false)} style={navLinkStyle}>📅 Events</Link>
            <Link href="/booth" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏪 Booth Agent</Link>
            <Link href="/scanner" onClick={() => setIsOpen(false)} style={navLinkStyle}>📷 Gate Scanner</Link>
          </div>

          {/* DYNAMIC USER INFO (No more static names!) */}
          <div style={sidebarFooter}>
            {user ? (
              <>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px' }}>Logged in as</p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>{user.email}</p>
                <button onClick={() => supabase.auth.signOut()} style={logoutBtn}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} style={loginBtn}>Login to Account</button>
            )}
          </div>
        </nav>

        {/* 3. DYNAMIC HEADER */}
        <Header 
          user={user} 
          onMenuClick={() => setIsOpen(true)} 
          onAuthClick={() => setIsAuthOpen(true)} 
        />

        <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

// --- Styles ---
const sidebarStyle: React.CSSProperties = { 
  position: 'fixed', top: 0, bottom: 0, width: '280px', background: '#fff', 
  zIndex: 2000, transition: '0.3s ease', padding: '24px', display: 'flex', flexDirection: 'column' 
};

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 };
const sidebarHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '32px' };
const sidebarFooter = { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9' };
const navLinkStyle = { padding: '14px 18px', borderRadius: '12px', color: '#1e293b', textDecoration: 'none', fontWeight: 600, background: '#f8fafc', display: 'block' };
const logoutBtn = { color: '#ef4444', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 };
const loginBtn = { color: '#2563eb', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 };
