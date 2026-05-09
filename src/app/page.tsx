import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true });

  return (
    <div style={containerStyle}>
      {/* Hero Banner from your HTML UX */}
      <div style={heroBannerStyle}>
        <div style={bannerOverlay}></div>
        <div style={bannerContent}>
          <div style={bannerLabel}>Next match · Dedza Stadium</div>
          <h2 style={bannerTitle}>Dynamos vs Silver Strikers</h2>
          <div style={bannerMeta}>
            <span>📅 15 May 2026</span>
            <span>⏰ 14:30</span>
          </div>
          <div style={countdownStyle}>⏳ Live Infrastructure Ready</div>
        </div>
      </div>

      <main style={{ padding: '0 16px 40px' }}>
        <h2 style={sectionTitleStyle}>Upcoming Events</h2>
        
        {error && <p style={{color: 'red'}}>Database Error: {error.message}</p>}

        <div style={gridStyle}>
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} style={cardStyle}>
                <div style={cardContent}>
                  {/* SAFETY GUARD: This fix prevents the 'toUpperCase' build error */}
                  <span style={badgeStyle}>
                    {event.category ? event.category.toUpperCase() : 'EVENT'}
                  </span>
                  
                  <h4 style={cardTitleStyle}>{event.title}</h4>
                  
                  <p style={cardInfoStyle}>
                    📍 {event.location} · {new Date(event.date).toLocaleDateString('en-GB')}
                  </p>
                  
                  <button style={buyBtnStyle}>
                    Secure Ticket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <p>Scanning for live events at Dedza Stadium...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// --- Premium UI Styles from your HTML Reference ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh' };

const heroBannerStyle: React.CSSProperties = {
  margin: '16px', padding: '24px 20px', borderRadius: '32px', position: 'relative',
  overflow: 'hidden', backgroundImage: "url('https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg')",
  backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '220px'
};

const bannerOverlay: React.CSSProperties = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'linear-gradient(135deg, rgba(15,43,94,0.85) 0%, rgba(26,74,158,0.7) 100%)', zIndex: 1
};

const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2 };
const bannerLabel = { fontSize: '0.8rem', textTransform: 'uppercase' as const, letterSpacing: '2px', opacity: 0.9, marginBottom: '8px' };
const bannerTitle = { fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 12px 0' };
const bannerMeta = { display: 'flex', gap: '20px', fontWeight: 500, marginBottom: '20px', fontSize: '0.9rem' };
const countdownStyle = { background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '40px', display: 'inline-block', fontWeight: 600, backdropFilter: 'blur(4px)' };

const sectionTitleStyle = { fontSize: '1.5rem', fontWeight: 700, margin: '24px 0 16px', letterSpacing: '-0.02em' };
const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };

const cardStyle: React.CSSProperties = {
  borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '180px',
  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  backgroundImage: "url('https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg')",
  backgroundSize: 'cover', backgroundPosition: 'center'
};

const cardContent: React.CSSProperties = {
  position: 'relative', background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
  padding: '20px', width: '100%', color: 'white'
};

const badgeStyle = { background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', marginBottom: '8px', display: 'inline-block' };
const cardTitleStyle = { fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px 0' };
const cardInfoStyle = { opacity: 0.9, fontSize: '0.85rem', margin: '0 0 12px 0' };

const buyBtnStyle = {
  background: 'white', color: '#2563eb', border: 'none', padding: '12px 20px',
  borderRadius: '60px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
};

const emptyStateStyle = { padding: '40px 20px', textAlign: 'center' as const, background: '#f8fafc', borderRadius: '24px', color: '#64748b', border: '1px dashed #cbd5e1' };
