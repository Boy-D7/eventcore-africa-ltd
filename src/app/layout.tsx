'use client' // Necessary for the interactive menu
import { useState } from 'react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false); // State for the Hamburger menu

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f6fb', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* SIDEBAR OVERLAY (The blur effect when menu is open) */}
        {isOpen && (
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }} 
          />
        )}

        {/* SIDEBAR MENU (From your premium design) */}
        <nav style={{ ...sidebarStyle, left: isOpen ? '0' : '-280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>✕</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏠 Home</Link>
            <Link href="/events" onClick={() => setIsOpen(false)} style={navLinkStyle}>📅 Events</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} style={navLinkStyle}>📈 Admin Dashboard</Link>
            <Link href="/scanner" onClick={() => setIsOpen(false)} style={navLinkStyle}>📷 Gate Scanner</Link>
          </div>
        </nav>

        {/* TOP NAVIGATION (Your existing nav upgraded with hamburger) */}
        <nav style={navStyle}>
          <div style={navContent}>
            <button onClick={() => setIsOpen(true)} style={hamburgerStyle}>☰</button>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <button style={signInBtnStyle}>Sign In</button>
          </div>
        </nav>

        <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>

        <footer style={footerStyle}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', fontWeight: 700, color: '#64748b' }}>
            <span>TWITTER</span> <span>FACEBOOK</span> <span>INSTAGRAM</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2026 EventCore Africa Limited. Secure Infrastructure.</p>
        </footer>
      </body>
    </html>
  )
}

// --- NEW SIDEBAR STYLES ---
const sidebarStyle: React.CSSProperties = {
  position: 'fixed', top: 0, width: '280px', height: '100%', 
  background: '#fff', zIndex: 1001, transition: '0.3s ease-in-out', 
  padding: '24px', boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
};

const navLinkStyle = {
  padding: '14px 18px', borderRadius: '12px', color: '#1e293b', 
  textDecoration: 'none', fontWeight: 600, background: '#f8fafc'
};

const hamburgerStyle = { background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', padding: '0 10px' };

// --- YOUR EXISTING STYLES ---
const navStyle: React.CSSProperties = { position: 'fixed', top: 0, width: '100%', background: '#fff', borderBottom: '1px solid #e2e8f0', zIndex: 100, height: '64px', display: 'flex', alignItems: 'center' };
const navContent: React.CSSProperties = { maxWidth: '480px', margin: '0 auto', width: '100%', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const signInBtnStyle = { background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' };
const footerStyle = { padding: '40px 20px', textAlign: 'center' as const, background: '#fff', borderTop: '1px solid #e2e8f0' };
