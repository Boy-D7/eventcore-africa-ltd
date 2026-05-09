'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f6fb', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* 1. BLUR OVERLAY - Only shows when menu is open */}
        {isOpen && (
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 }} 
          />
        )}

        {/* 2. SIDEBAR - Correctly hidden at -280px until isOpen is true */}
        <nav style={{ 
          position: 'fixed', top: 0, bottom: 0, width: '280px', 
          background: '#fff', zIndex: 1001, transition: '0.3s ease', 
          padding: '24px', boxShadow: '10px 0 30px rgba(0,0,0,0.1)',
          left: isOpen ? '0' : '-300px' // Completely moves it off-screen
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏠 Home</Link>
            <Link href="/events" onClick={() => setIsOpen(false)} style={navLinkStyle}>📅 Events</Link>
            <Link href="/booth" onClick={() => setIsOpen(false)} style={navLinkStyle}>🏪 Booth Agent</Link>
            <Link href="/scanner" onClick={() => setIsOpen(false)} style={navLinkStyle}>📷 Gate Scanner</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} style={navLinkStyle}>📈 Admin Dashboard</Link>
          </div>
        </nav>

        {/* 3. FIXED HEADER */}
        <nav style={headerStyle}>
          <div style={headerContent}>
            <button onClick={() => setIsOpen(true)} style={hamburgerBtn}>☰</button>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <button style={signInBtnStyle}>Sign In</button>
          </div>
        </nav>

        {/* 4. MAIN CONTENT - Responsive Padding */}
        <main style={{ 
          paddingTop: '80px', 
          minHeight: '100vh',
          maxWidth: '100%',
          overflowX: 'hidden' 
        }}>
          {children}
        </main>

      </body>
    </html>
  )
}

// --- Styles for Proper Responsiveness ---
const headerStyle: React.CSSProperties = {
  position: 'fixed', top: 0, width: '100%', background: 'rgba(255,255,255,0.95)', 
  backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', zIndex: 100, height: '64px', 
  display: 'flex', alignItems: 'center'
};

const headerContent: React.CSSProperties = {
  maxWidth: '480px', margin: '0 auto', width: '100%', padding: '0 16px', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const navLinkStyle = {
  padding: '14px 18px', borderRadius: '16px', color: '#1e293b', 
  textDecoration: 'none', fontWeight: 600, background: '#f8fafc',
  fontSize: '0.95rem'
};

const hamburgerBtn = {
  background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', padding: '8px'
};

const signInBtnStyle = {
  background: '#0f172a', color: '#fff', border: 'none', 
  padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem'
};
