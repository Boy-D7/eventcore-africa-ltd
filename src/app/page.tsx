'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PurchaseModal from '@/components/PurchaseModal';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // NEW: State to track which event is being purchased
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true);

        if (data) setEvents(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Premium Header */}
      <header style={{ padding: '24px 20px', borderBottom: '1px solid #f0f3f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1 }}>EVENTCORE</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', color: '#2563eb', marginTop: '4px' }}>AFRICA LIMITED</div>
        </div>
        <button style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}>Sign In</button>
      </header>

      <main style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.02em' }}>Upcoming Events</h2>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Connecting to Dedza Stadium...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', fontWeight: 500 }}>No live matches currently scheduled.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} style={{ 
              position: 'relative',
              background: '#1e293b',
              borderRadius: '28px',
              padding: '24px',
              marginBottom: '20px',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Overlay for readability */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.95) 100%)',
                zIndex: 1
              }}></div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                   <span style={{ background: '#2563eb', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>Live Pilot</span>
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>{event.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px', fontWeight: 500 }}>
                  {event.location} • {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                
                {/* UPDATED: Button now opens the modal and passes a default price */}
                <button 
                  onClick={() => setSelectedEvent({ ...event, price: 3500 })}
                  style={{ 
                    width: '100%',
                    background: '#fff', color: '#2563eb', border: 'none', 
                    padding: '16px', borderRadius: '18px', fontWeight: 800,
                    fontSize: '1rem', cursor: 'pointer'
                  }}
                >
                  Buy Ticket
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* NEW: Purchase Modal logic */}
      {selectedEvent && (
        <PurchaseModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
