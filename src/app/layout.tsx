export const metadata = {
  title: 'EventCore Africa | Secure Digital Infrastructure',
  description: 'Digital ticketing for Dedza Stadium and beyond.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f6fb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* Navigation Infrastructure */}
        <nav style={navStyle}>
          <div style={navContent}>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>
              EVENT<span style={{ color: '#2563eb' }}>CORE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button title="Notifications" style={iconBtnStyle}>🔔</button>
              <button style={signInBtnStyle}>Sign In</button>
            </div>
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>

        {/* Social Footer */}
        <footer style={footerStyle}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', fontWeight: 700, color: '#64748b' }}>
            <span>TWITTER</span> <span>FACEBOOK</span> <span>INSTAGRAM</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2024 EventCore Africa Limited. All Rights Reserved.</p>
        </footer>

      </body>
    </html>
  )
}

// Infrastructure Styles
const navStyle: React.CSSProperties = {
  position: 'fixed', top: 0, width: '100%', background: '#fff', 
  borderBottom: '1px solid #e2e8f0', zIndex: 1000, height: '64px', 
  display: 'flex', alignItems: 'center'
};

const navContent: React.CSSProperties = {
  maxWidth: '480px', margin: '0 auto', width: '100%', 
  padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const signInBtnStyle = {
  background: '#0f172a', color: '#fff', border: 'none', 
  padding: '8px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer'
};

const iconBtnStyle = { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' };

const footerStyle = { padding: '40px 20px', textAlign: 'center' as const, background: '#fff', borderTop: '1px solid #e2e8f0' };
