'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PurchaseModal from '@/components/PurchaseModal'

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('00d 00h 00m');
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const heroEvent = events.length > 0 ? events[0] : null;
  const upcomingEvents = events.slice(1, 4); 

  useEffect(() => {
    if (!heroEvent) return;
    const timer = setInterval(() => {
      const eventDateTime = new Date(`${heroEvent.date}T${heroEvent.time || '00:00:00'}`);
      const now = new Date();
      const diff = eventDateTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Live Now');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${d}d ${h}h ${m}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [heroEvent]);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div style={containerStyle}>
      {/* --- HERO BANNER --- */}
      {heroEvent && (
        <div style={{...heroBannerStyle, backgroundImage: `url(${heroEvent.image_url || ''})`}}>
          <div style={bannerOverlay}></div>
          <div style={bannerContent}>
            <div style={bannerLabel}>Next Match · {heroEvent.location}</div>
            <h2 style={bannerTitle}>{heroEvent.title}</h2>
            <div style={bannerMeta}>
              <span>📅 {new Date(heroEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              <span>⏰ {heroEvent.time?.substring(0, 5)}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={countdownStyle}>⏳ {timeLeft}</div>
              <button style={heroBuyBtn} onClick={() => openModal(heroEvent)}>
                🎫 Buy Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ padding: '0 16px 40px' }}>
        {/* Header with View All Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px' }}>
          <h2 style={{ ...sectionTitleStyle, margin: 0 }}>Upcoming Events</h2>
          <Link href="/events" style={viewAllLinkStyle}>
            View All ❯
          </Link>
        </div>

        <div style={gridStyle}>
          {upcomingEvents.map((event) => (
            <div key={event.id} style={{...cardStyle, backgroundImage: `url(${event.image_url || ''})`}}>
              <div style={cardContent}>
                <span style={badgeStyle}>{event.category || 'Event'}</span>
                <h4 style={cardTitleStyle}>{event.title}</h4>
                <p style={cardInfoStyle}>📍 {event.location} · {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                
                <button style={cardBuyBtn} onClick={() => openModal(event)}>
                  Buy Ticket Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PurchaseModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

// --- Styles ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh' };
const heroBannerStyle: React.CSSProperties = { margin: '16px', padding: '24px 20px', borderRadius: '32px', position: 'relative', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '240px' };
const bannerOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(15,43,94,0.9) 0%, rgba(26,74,158,0.7) 100%)', zIndex: 1 };
const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2 };
const bannerLabel = { fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', opacity: 0.8, marginBottom: '8px' };
const bannerTitle = { fontSize: '1.7rem', fontWeight: 800, margin: '0 0 10px 0' };
const bannerMeta = { display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '0.9rem', opacity: 0.9 };
const countdownStyle = { background: 'rgba(255,255,255,0.2)', padding: '10px 14px', borderRadius: '16px', fontWeight: 600, backdropFilter: 'blur(8px)', fontSize: '0.85rem' };

const heroBuyBtn = { background: '#fff', color: '#1a4a9e', border: 'none', padding: '10px 18px', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' };

const sectionTitleStyle = { fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' };
const viewAllLinkStyle = { color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 };

const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };
const cardStyle: React.CSSProperties = { borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundSize: 'cover', backgroundPosition: 'center' };
const cardContent: React.CSSProperties = { background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', padding: '20px', color: 'white' };
const badgeStyle = { background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, marginBottom: '8px', display: 'inline-block' };
const cardTitleStyle = { fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' };
const cardInfoStyle = { opacity: 0.8, fontSize: '0.8rem', margin: '0 0 12px 0' };

const cardBuyBtn = { background: '#2563eb', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' };
