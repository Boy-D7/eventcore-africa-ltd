'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          ticket_tiers (*)
        `)
        .eq('is_active', true);
      
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <div className="app" style={{ fontFamily: 'Inter, sans-serif', maxWidth: '480px', margin: '0 auto', background: 'white', minHeight: '100vh' }}>
      <header style={{ padding: '18px 20px', borderBottom: '1px solid #f0f3f9', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', lineHeight: 1 }}>EVENTCORE</div>
          <div style={{ fontSize: '0.6rem', fontWight: 600, letterSpacing: '3px', color: '#2563eb' }}>AFRICA LIMITED</div>
        </div>
      </header>

      <main style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Upcoming Events</h2>
        
        {loading ? (
          <p>Connecting to Dedza Stadium...</p>
        ) : events.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px' }}>
            <p style={{ color: '#64748b' }}>No live matches found in database.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} style={{ 
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(${event.image_url})`,
              backgroundSize: 'cover',
              borderRadius: '24px',
              padding: '20px',
              marginBottom: '16px',
              color: 'white',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>{event.title}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '12px' }}>{event.location} · {new Date(event.date).toLocaleDateString()}</p>
              <button style={{ 
                background: 'white', color: '#2563eb', border: 'none', 
                padding: '12px 20px', borderRadius: '60px', fontWeight: 700 
              }}>
                Buy Now
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
