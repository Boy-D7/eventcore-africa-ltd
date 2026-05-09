import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true });

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.15em', marginBottom: '8px' }}>
          SECURE DIGITAL INFRASTRUCTURE
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Live & Upcoming</h1>
      </header>

      {error && <p style={{ color: 'red' }}>Connection Error: {error.message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {events && events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'inline-block', padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '12px' }}>
                {event.category.toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 12px 0' }}>{event.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0' }}>📍 {event.location}</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0' }}>📅 {new Date(event.date).toLocaleDateString()}</p>
              <button style={{ width: '100%', marginTop: '20px', padding: '16px', background: '#0f172a', color: '#fff', borderRadius: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Secure Ticket
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '40px', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
            Scanning for upcoming events...
          </p>
        )}
      </div>
    </div>
  )
}
