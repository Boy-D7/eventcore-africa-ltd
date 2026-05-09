'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PurchaseModal from '@/components/PurchaseModal'
import { Menu, Bell } from 'lucide-react'

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('00d 00h 00m');

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
      {/* --- NAVBAR --- */}
      <nav style={navStyle}>
        <Menu size={28} color="#0f172a" style={{ cursor: 'pointer' }} />
        <div style={logoContainer}>
          <span style={logoMain}>EVENTCORE</span>
          <span style={logoSub}>AFRICA LIMITED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Bell size={22} color="#64748b" style={{ cursor: 'pointer' }} />
          <button style={signInBtn}>Sign In</button>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      {heroEvent && (
        <div style={{...heroBannerStyle, backgroundImage: `url(${heroEvent.image_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop'})`}}>
          <div style={bannerOverlay}></div>
          <div style={bannerContent}>
            <div style={bannerLabel}>NEXT MATCH · {heroEvent.location?.toUpperCase()}</div>
            <h2 style={bannerTitle}>{heroEvent.title}</h2>
            <div style={bannerMeta}>
              <span>📅 {new Date(heroEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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

      {/* --- CATEGORY PILLS --- */}
      <div style={categoryRow}>
        <div style={catPill}>📍 Dedza Council Stadium</div>
        <div style={catPill}>Churches</div>
        <div style={catPill}>Weddings</div>
        <div style={catPill}>Concerts</div>
      </div>

      <main style={{ padding: '0 16px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '32px 0 16px' }}>
          <h2 style={sectionTitleStyle}>Upcoming Events</h2>
          <Link href="/events" style={viewAllLinkStyle}>View All ❯</Link>
        </div>

        <div style={gridStyle}>
          {upcomingEvents.map((event) => (
            <div key={event.id} style={{...cardStyle, backgroundImage: `url(${event.image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'})`}}>
              <div style={cardContent}>
                <span style={badgeStyle}>⚽ {event.category || 'Football'}</span>
                <h4 style={cardTitleStyle}>{event.title}</h4>
                <p style={cardInfoStyle}>📍 {event.location} · {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · 2,450 sold</p>

                <button style={cardBuyBtn} onClick={() => openModal(event)}>
                  🎫 Buy Now
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

// --- Premium Styles ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' };

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f1f5f9' };
const logoContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const logoMain = { fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 };
const logoSub = { fontWeight: 700, fontSize: '0.6rem', color: '#2563eb', letterSpacing: '1px' };
const signInBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' };

const heroBannerStyle: React.CSSProperties = { margin: '20px 16px', padding: '32px 24px', borderRadius: '32px', position: 'relative', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '280px', display: 'flex', alignItems: 'flex-end', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const bannerOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(30,58,138,0.95) 100%)', zIndex: 1 };
const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2, width: '100%' };
const bannerLabel = { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', opacity: 0.9, marginBottom: '12px' };
const bannerTitle = { fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.1 };
const bannerMeta = { display: 'flex', gap: '15px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 500 };
const countdownStyle = { background: 'rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '18px', fontWeight: 700, backdropFilter: 'blur(10px)', fontSize: '0.85rem' };
const heroBuyBtn = { background: '#fff', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };

const categoryRow = { display: 'flex', gap: '10px', overflowX: 'auto' as const, padding: '0 16px', margin: '10px 0', scrollbarWidth: 'none' as const };
const catPill = { background: '#eff6ff', color: '#1e40af', padding: '10px 18px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' as const };

const sectionTitleStyle = { fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 };
const viewAllLinkStyle = { color: '#2563eb', textDecoration: 'none', fontSize: '1rem', fontWeight: 700 };

const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const cardStyle: React.CSSProperties = { borderRadius: '32px', overflow: 'hidden', position: 'relative', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' };
const cardContent: React.CSSProperties = { background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 100%)', padding: '24px', color: 'white' };
const badgeStyle = { background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px', display: 'inline-block', backdropFilter: 'blur(4px)' };
const cardTitleStyle = { fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0' };
const cardInfoStyle = { opacity: 0.8, fontSize: '0.85rem', margin: '0 0 16px 0', fontWeight: 500 };
const cardBuyBtn = { background: '#fff', color: '#2563eb', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', width: 'fit-content', minWidth: '140px' };
