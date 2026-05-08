import { supabase } from '@/lib/supabase'

export default async function Home() {
  // 1. Fetch live events from your Supabase 'events' table
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true });

  return (
    <div style={containerStyle}>
      {/* Brand Header */}
      <header style={headerStyle}>
        <div style={badgeStyle}>SECURE DIGITAL INFRASTRUCTURE</div>
        <h1 style={titleStyle}>EventCore Africa<span style={{color: '#2563eb'}}>.</span></h1>
        <p style={subtitleStyle}>Reliable ticketing for Dedza Stadium and beyond.</p>
      </header>

      <main style={{ padding: '0 20px 40px' }}>
        <h2 style={sectionTitleStyle}>Live & Upcoming</h2>
        
        {error && <p style={{color: 'red'}}>Connection Error: {error.message}</p>}

        <div style={gridStyle}>
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} style={cardStyle}>
                <div style={categoryBadgeStyle}>{event.category.toUpperCase()}</div>
                <h3 style={eventTitleStyle}>{event.title}</h3>
                
                <div style={infoRowStyle}>
                  <span style={iconStyle}>📍</span>
                  <span>{event.location}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={iconStyle}>📅</span>
                  <span>{new Date(event.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}</span>
                </div>

                <button style={buttonStyle}>
                  Secure Ticket
                </button>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <p>Scanning for upcoming events...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// --- Professional UI Styles based on EventCore Design Guidelines ---
const containerStyle = {
  maxWidth: '480px',
  margin: '0 auto',
  background: '#f8fafc',
  minHeight: '100vh',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  color: '#0f172a'
};

const headerStyle = {
  padding: '40px 20px 30px',
  background: '#fff',
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '24px'
};

const badgeStyle = {
  fontSize: '0.65rem',
  fontWeight: 800,
  color: '#2563eb',
  letterSpacing: '0.15em',
  marginBottom: '8px'
};

const titleStyle = {
  fontSize: '1.8rem',
  fontWeight: 900,
  margin: 0,
  letterSpacing: '-0.02em'
};

const subtitleStyle = {
  color: '#64748b',
  fontSize: '0.95rem',
  marginTop: '4px'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 800,
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const gridStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px'
};

const cardStyle = {
  background: '#fff',
  padding: '24px',
  borderRadius: '24px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};

const categoryBadgeStyle = {
  display: 'inline-block',
  padding: '4px 10px',
  background: '#eff6ff',
  color: '#2563eb',
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 700,
  marginBottom: '12px'
};

const eventTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  margin: '0 0 12px 0',
  lineHeight: 1.3
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#64748b',
  fontSize: '0.9rem',
  marginBottom: '6px'
};

const iconStyle = { fontSize: '1rem' };

const buttonStyle = {
  width: '100%',
  marginTop: '20px',
  padding: '16px',
  background: '#0f172a',
  color: '#fff',
  borderRadius: '16px',
  fontWeight: 700,
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer'
};

const emptyStateStyle = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  background: '#fff',
  borderRadius: '24px',
  color: '#64748b',
  border: '1px dashed #cbd5e1'
};
