'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PurchaseModal from '@/components/PurchaseModal'
import { Menu, Bell, Calendar, Clock, MapPin, Ticket } from 'lucide-react'

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image_url: string;
  category: string;
  is_active: boolean;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('00d 00h 00m');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Optimized Fetching
  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: true });

        if (error) throw error;
        if (data) setEvents(data);
      } catch (err) {
        console.error("Database connection error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const heroEvent = events.length > 0 ? events[0] : null;
  const upcomingEvents = events.slice(1, 5);

  // 2. Cross-Browser Resilient Timer (Fixes NaN Error)
  const calculateTime = useCallback(() => {
    if (!heroEvent) return;

    // Use space instead of 'T' and slashes instead of dashes for Safari/Mobile support
    const datePart = heroEvent.date.replace(/-/g, '/');
    const timePart = heroEvent.time || '00:00:00';
    const eventDateTime = new Date(`${datePart} ${timePart}`);
    
    const now = new Date();
    const diff = eventDateTime.getTime() - now.getTime();

    if (isNaN(eventDateTime.getTime())) {
      setTimeLeft('TBD');
      return;
    }

    if (diff <= 0) {
      setTimeLeft('Live Now');
    } else {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    }
  }, [heroEvent]);

  useEffect(() => {
    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [calculateTime]);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <p style={{fontWeight: 600, color: '#2563eb'}}>Loading EventCore...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* --- FIXED NAVBAR (Fixes Double Header/Scrolling Conflict) --- */}
      <nav style={navStyle}>
        <Menu size={24} color="#0f172a" style={{ cursor: 'pointer' }} />
        <div style={logoContainer}>
          <div style={logoRow}>
            <span style={logoBlack}>EVENT</span>
            <span style={logoBlue}>CORE</span>
          </div>
          <span style={logoSub}>AFRICA LIMITED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
          <button style={signInBtn}>Login</button>
        </div>
      </nav>

      {heroEvent ? (
        <div style={{...heroBannerStyle, backgroundImage: `url(${heroEvent.image_url})`}}>
          <div style={bannerOverlay}></div>
          <div style={bannerContent}>
            <div style={bannerLabel}>FEATURED EVENT · {heroEvent.location?.toUpperCase()}</div>
            <h2 style={bannerTitle}>{heroEvent.title}</h2>
            <div style={bannerMeta}>
              <span style={metaItem}><Calendar size={14} /> {new Date(heroEvent.date).toLocaleDateString('en-GB')}</span>
              <span style={metaItem}><Clock size={14} /> {heroEvent.time?.substring(0, 5)}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={countdownStyle}>⏳ {timeLeft}</div>
              <button style={heroBuyBtn} onClick={() => openModal(heroEvent)}>
                <Ticket size={16} /> Get Tickets
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={emptyHeroStyle}>Stay tuned for more matches at Dedza Stadium.</div>
      )}

      {/* --- CATEGORY PILLS --- */}
      <div style={categoryRow}>
        <div style={catPillActive}><MapPin size={14} /> Dedza Stadium</div>
        <div style={catPill}>Football</div>
        <div style={catPill}>Music</div>
        <div style={catPill}>Churches</div>
      </div>

      <main style={{ padding: '0 16px 40px' }}>
        <div style={sectionHeader}>
          <h2 style={sectionTitleStyle}>Upcoming</h2>
          <Link href="/events" style={viewAllLinkStyle}>See all ❯</Link>
        </div>

        <div style={gridStyle}>
          {upcomingEvents.map((event) => (
            <div key={event.id} style={{...cardStyle, backgroundImage: `url(${event.image_url})`}}>
              <div style={cardContent}>
                <span style={badgeStyle}>⚽ {event.category || 'Sports'}</span>
                <h4 style={cardTitleStyle}>{event.title}</h4>
                <p style={cardInfoStyle}>{event.location} · {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                <button style={cardBuyBtn} onClick={() => openModal(event)}>
                  <Ticket size={14} /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL GUARD (Prevents Crashing) --- */}
      {isModalOpen && selectedEvent && (
        <PurchaseModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}

// --- PRODUCTION STYLES ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' as const };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: 'rgba(255,255,255,0.95)', position: 'sticky' as const, top: 0, zIndex: 1000, backdropFilter: 'blur(8px)' };
const logoContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const logoRow = { display: 'flex', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.5px' };
const logoBlack = { color: '#0f172a' };
const logoBlue = { color: '#2563eb' };
const logoSub = { fontWeight: 700, fontSize: '0.55rem', color: '#2563eb', letterSpacing: '1.5px', marginTop: '1px' };
const signInBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' };

const heroBannerStyle: React.CSSProperties = { margin: '16px', padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '280px', display: 'flex', alignItems: 'flex-end' };
const bannerOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.95) 100%)', zIndex: 1 };
const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2, width: '100%' };
const bannerLabel = { fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', opacity: 0.8, marginBottom: '6px' };
const bannerTitle = { fontSize: '1.75rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.1 };
const bannerMeta = { display: 'flex', gap: '12px', marginBottom: '20px', fontSize: '0.85rem', opacity: 0.9 };
const metaItem = { display: 'flex', alignItems: 'center', gap: '4px' };
const countdownStyle = { background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '14px', fontWeight: 700, backdropFilter: 'blur(10px)', fontSize: '0.8rem' };
const heroBuyBtn = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' };

const categoryRow = { display: 'flex', gap: '8px', overflowX: 'auto' as const, padding: '0 16px', margin: '16px 0', scrollbarWidth: 'none' as const };
const catPillActive = { background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' as const };
const catPill = { background: '#f8fafc', color: '#64748b', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #f1f5f9', whiteSpace: 'nowrap' as const };

const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 12px' };
const sectionTitleStyle = { fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 };
const viewAllLinkStyle = { color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 };

const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const cardStyle: React.CSSProperties = { borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundSize: 'cover', backgroundPosition: 'center' };
const cardContent: React.CSSProperties = { background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, transparent 100%)', padding: '20px', color: 'white' };
const badgeStyle = { background: 'rgba(37,99,235,0.3)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, marginBottom: '8px', display: 'inline-block', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' };
const cardTitleStyle = { fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' };
const cardInfoStyle = { opacity: 0.7, fontSize: '0.75rem', margin: '0 0 12px 0' };
const cardBuyBtn = { background: '#fff', color: '#0f172a', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' };

const emptyHeroStyle = { margin: '16px', padding: '40px', borderRadius: '24px', background: '#f8fafc', color: '#64748b', textAlign: 'center' as const, fontSize: '0.9rem' };
