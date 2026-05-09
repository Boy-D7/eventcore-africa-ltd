'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PurchaseModal from '@/components/PurchaseModal'

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('Calculating...');
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true }); // Pulls closest events first

      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // 1. Hero Event is the very next one starting
  const heroEvent = events.length > 0 ? events[0] : null;
  // 2. Upcoming Events limits to exactly 3 matches AFTER the Hero event
  const upcomingEvents = events.slice(1, 4); 

  // 3. Live Countdown Logic for Hero Event
  useEffect(() => {
    if (!heroEvent) return;

    const timer = setInterval(() => {
      const eventDateTime = new Date(`${heroEvent.date}T${heroEvent.time || '00:00:00'}`);
      const now = new Date();
      const diff = eventDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Match Started!');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${d}d ${h}h ${m}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [heroEvent]);

  // Click handler to open the modal
  const handleCardClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div style={containerStyle}>
      {/* --- HERO BANNER (Clickable) --- */}
      {heroEvent && (
        <div 
          style={{
            ...heroBannerStyle, 
            backgroundImage: `url(${heroEvent.image_url || 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg'})`,
            cursor: 'pointer' 
          }}
          onClick={() => handleCardClick(heroEvent)}
        >
          <div style={bannerOverlay}></div>
          <div style={bannerContent}>
            <div style={bannerLabel}>Next Match · {heroEvent.location}</div>
            <h2 style={bannerTitle}>{heroEvent.title}</h2>
            <div style={bannerMeta}>
              <span>📅 {new Date(heroEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
              {heroEvent.time && <span>⏰ {heroEvent.time.substring(0, 5)}</span>}
            </div>
            
            <div style={countdownStyle}>⏳ {timeLeft}</div>
          </div>
        </div>
      )}

      <main style={{ padding: '0 16px 40px' }}>
        <h2 style={sectionTitleStyle}>Upcoming Events</h2>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Scanning for live events...</p>
        ) : (
          <div style={gridStyle}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  style={{
                    ...cardStyle, 
                    backgroundImage: `url(${event.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'})`,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCardClick(event)}
                >
                  <div style={cardContent}>
                    <span style={badgeStyle}>
                      {event.category ? event.category.toUpperCase() : 'EVENT'}
                    </span>

                    <h4 style={cardTitleStyle}>{event.title}</h4>

                    <p style={cardInfoStyle}>
                      📍 {event.location} · {new Date(event.date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={emptyStateStyle}>
                <p>No more upcoming events found.</p>
              </div>
            )}
          </div>
        )}

        {/* View All Events Button */}
        {events.length > 4 && (
          <Link href="/events" style={{ textDecoration: 'none' }}>
            <button style={viewAllBtnStyle}>
              View All Events
            </button>
          </Link>
        )}
      </main>

      {/* The Global Purchase Modal */}
      <PurchaseModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

// --- Premium UI Styles ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh' };

const heroBannerStyle: React.CSSProperties = {
  margin: '16px', padding: '24px 20px', borderRadius: '32px', position: 'relative',
  overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '220px',
  transition: 'transform 0.2s ease', // subtle click effect
};

const bannerOverlay: React.CSSProperties = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'linear-gradient(135deg, rgba(15,43,94,0.85) 0%, rgba(26,74,158,0.7) 100%)', zIndex: 1
};

const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2 };
const bannerLabel = { fontSize: '0.8rem', textTransform: 'uppercase' as const, letterSpacing: '2px', opacity: 0.9, marginBottom: '8px', fontWeight: 600 };
const bannerTitle = { fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 12px 0' };
const bannerMeta = { display: 'flex', gap: '20px', fontWeight: 500, marginBottom: '20px', fontSize: '0.9rem' };

const countdownStyle = { background: 'rgba(255,255,255,0.15)', padding: '10px 16px', borderRadius: '40px', display: 'inline-block', fontWeight: 600, backdropFilter: 'blur(4px)', fontSize: '0.9rem' };

const sectionTitleStyle = { fontSize: '1.5rem', fontWeight: 700, margin: '24px 0 16px', letterSpacing: '-0.02em', color: '#0f172a' };
const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };

const cardStyle: React.CSSProperties = {
  borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '180px',
  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  backgroundSize: 'cover', backgroundPosition: 'center',
  transition: 'transform 0.2s ease',
};

const cardContent: React.CSSProperties = {
  position: 'relative', background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
  padding: '20px', width: '100%', color: 'white'
};

const badgeStyle = { background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', marginBottom: '8px', display: 'inline-block' };
const cardTitleStyle = { fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px 0' };
const cardInfoStyle = { opacity: 0.9, fontSize: '0.85rem', margin: '0 0 12px 0' };

const viewAllBtnStyle = {
  width: '100%', padding: '16px', marginTop: '24px', borderRadius: '16px', border: '2px solid #e2e8f0', 
  background: 'transparent', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: '0.2s'
};

const emptyStateStyle = { padding: '40px 20px', textAlign: 'center' as const, background: '#f8fafc', borderRadius: '24px', color: '#64748b', border: '1px dashed #cbd5e1' };
