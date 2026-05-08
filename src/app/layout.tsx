import './globals.css'

export const metadata = {
  title: 'EventCore Africa | Secure Digital Ticketing',
  description: 'A secure digital event infrastructure for Africa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f6fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* GLOBAL NAVIGATION HEADER */}
        <nav style={navStyle}>
          <div style={navContent}>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button title="Notifications" style={iconBtnStyle}>🔔</button>
              <button style={signInBtnStyle}>Sign In</button>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '70px' }}>
          {children}
        </main>

        {/* SOCIAL & NAVIGATION FOOTER */}
        <footer style={footerStyle}>
          <div style={socialRow}>
            <span style={socialIcon}>𝕏</span>
            <span style={socialIcon}>FB</span>
            <span style={socialIcon}>IG</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '12px' }}>
            © 2024 EventCore Africa Limited. Secure Infrastructure.
          </div>
        </footer>

      </body>
    </html>
  )
}

// --- Layout Styles ---
const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  width: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid #e2e8f0',
  zIndex: 1000,
  height: '60px',
  display: 'flex',
  alignItems: 'center'
};

const navContent: React.CSSProperties = {
  maxWidth: '480px',
  margin: '0 auto',
  width: '100%',
  padding: '0 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  padding: '4px'
};

const signInBtnStyle: React.CSSProperties = {
  background: '#0f172a',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer'
};

const footerStyle: React.CSSProperties = {
  background: '#fff',
  padding: '30px 20px',
  borderTop: '1px solid #e2e8f0',
  textAlign: 'center'
};

const socialRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  fontSize: '0.9rem',
  fontWeight: 800,
  color: '#64748b'
};

const socialIcon: React.CSSProperties = { cursor: 'pointer' };
