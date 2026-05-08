import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Fetch events directly from Supabase
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)

  if (error) {
    return <div style={{ padding: '20px' }}>Database Error: {error.message}</div>
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <header style={{ padding: '24px 20px', background: '#fff' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>EventCore Africa</h1>
        <p style={{ color: '#64748b' }}>Live Events at Dedza Stadium</p>
      </header>

      <main style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Upcoming Events</h2>
        
        {events && events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} style={{ background: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 800 }}>{event.category.toUpperCase()}</div>
              <h3 style={{ fontSize: '1.2rem', margin: '4px 0' }}>{event.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{event.location} • {event.date}</p>
              <button style={{ width: '100%', marginTop: '12px', padding: '12px', background: '#0f172a', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none' }}>
                Buy Ticket
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: '#64748b' }}>No events available right now.</p>
        )}
      </main>
    </div>
  )
}
