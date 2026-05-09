'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image_url?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) return <div style={loaderStyle}>Loading EventCore Feed...</div>;

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '24px' }}>
        Upcoming Events
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {events.length > 0 ? events.map((event) => (
          <div key={event.id} style={eventCard}>
            {/* Clickable Image/Header for Details */}
            <Link href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
              <div style={imagePlaceholder}>
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} style={imageStyle} />
                ) : (
                  <div style={fallbackImage}>⚽ Match Day</div>
                )}
              </div>
              
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 style={eventTitle}>{event.title}</h3>
                <div style={infoRow}>
                  <span>📍 {event.location}</span>
                  <span>📅 {event.date}</span>
                </div>
              </div>
            </Link>

            {/* Direct Buy Button */}
            <div style={{ padding: '0 16px 16px' }}>
              <Link href={`/checkout/${event.id}`} style={{ textDecoration: 'none' }}>
                <button style={buyBtnStyle}>
                  Secure Ticket
                </button>
              </Link>
            </div>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No events found. Check back later!</p>
        )}
      </div>
    </div>
  )
}

// --- Styles ---
const eventCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0'
};

const imagePlaceholder = {
  width: '100%',
  height: '180px',
  background: '#f1f5f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' as const };

const fallbackImage = { fontWeight: 800, color: '#94a3b8', fontSize: '1.2rem' };

const eventTitle = { margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' };

const infoRow = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginTop: '8px', 
  fontSize: '0.85rem', 
  color: '#64748b',
  fontWeight: 600
};

const buyBtnStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '16px',
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  fontWeight: 800,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: '0.2s ease',
  boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
};

const loaderStyle = { padding: '40px', textAlign: 'center' as const, fontWeight: 700, color: '#64748b' };
