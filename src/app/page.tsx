'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PurchaseModal from '@/components/PurchaseModal'
import { Menu, Bell, Calendar, Clock, MapPin, Ticket } from 'lucide-react'

// Defined Interface for better type safety
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
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const heroEvent = events.length > 0 ? events[0] : null;
  const upcomingEvents = events.slice(1, 5); 

  useEffect(() => {
    if (!heroEvent) return;
    
    const calculateTime = () => {
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
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Update every minute for performance
    return () => clearInterval(timer);
  }, [heroEvent]);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div style={{...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* --- NAVBAR --- */}
      <nav style={navStyle}>
        <Menu size={28} color="#0f172a" style={{ cursor: 'pointer' }} />
        <div style={logoContainer}>
          <div style={logoRow}>
            <span style={logoBlack}>EVENT</span>
            <span style={logoBlue}>CORE</span>
          </div>
          <span style={logoSub}>AFRICA LIMITED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Bell size={22} color="#64748b" style={{ cursor: 'pointer' }} />
          <button style={signInBtn}>Sign In</button>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      {heroEvent ? (
        <div style={{...heroBannerStyle, backgroundImage: `url(${heroEvent.image_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop'})`}}>
          <div style={bannerOverlay}></div>
          <div style={bannerContent}>
            <div style={bannerLabel}>NEXT MATCH · {heroEvent.location?.toUpperCase()}</div>
            <h2 style={bannerTitle}>{heroEvent.title}</h2>
            <div style={bannerMeta}>
              <span style={metaItem}><Calendar size={14} /> {new Date(heroEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span style={metaItem}><Clock size={14} /> {heroEvent.time?.substring(0, 5)}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={countdownStyle}>⏳ {timeLeft}</div>
              <button style={heroBuyBtn} onClick={() => openModal(heroEvent)}>
                <Ticket size={18} /> Buy Ticket
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <p>No upcoming events found.</p>
        </div>
      )}

      {/* --- CATEGORY PILLS --- */}
      <div style={categoryRow}>
        <div style={catPillActive}><MapPin size={14} /> Dedza Council Stadium</div>
        <div style={catPill}>Churches</div>
        <div style={catPill}>Weddings</div>
        <div style={catPill}>Concerts</div>
      </div>

      <main style={{ padding: '0 16px 40px' }}>
        <div style={sectionHeader}>
          <h2 style={sectionTitleStyle}>Upcoming Events</h2>
          <Link href="/events" style={viewAllLinkStyle}>View All ❯</Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div style={gridStyle}>
            {upcomingEvents.map((event) => (
              <div key={event.id} style={{...cardStyle, backgroundImage: `url(${event.image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'})`}}>
                <div style={cardContent}>
                  <span style={badgeStyle}>⚽ {event.category || 'Football'}</span>
                  <h4 style={cardTitleStyle}>{event.title}</h4>
                  <p style={cardInfoStyle}>📍 {event.location} · {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>

                  <button style={cardBuyBtn} onClick={() => openModal(event)}>
                    <Ticket size={16} /> Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={noUpcomingEventsStyle}>More events coming soon...</div>
        )}
      </main>

      {selectedEvent && (
        <PurchaseModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}

// --- Enhanced Styles ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#fff', position: 'sticky' as const, top: 0, zIndex: 100 };
const logoContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const logoRow = { display: 'flex', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px', lineHeight: 1 };
const logoBlack = { color: '#0f172a' };
const logoBlue = { color: '#2563eb' };
const logoSub = { fontWeight: 700, fontSize: '0.6rem', color: '#2563eb', letterSpacing: '1px', marginTop: '2px' };
const signInBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' };

const heroBannerStyle: React.CSSProperties = { margin: '16px', padding: '24px', borderRadius: '32px', position: 'relative', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '300px', display: 'flex', alignItems: 'flex-end' };
const bannerOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(30,58,138,0.95) 100%)', zIndex: 1 };
const bannerContent: React.CSSProperties = { position: 'relative', zIndex: 2, width: '100%' };
const bannerLabel = { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', opacity: 0.9, marginBottom: '8px' };
const bannerTitle = { fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.1 };
const bannerMeta = { display: 'flex', gap: '15px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 500 };
const metaItem = { display: 'flex', alignItems: 'center', gap: '4px' };
const countdownStyle = { background: 'rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '18px', fontWeight: 700, backdropFilter: 'blur(10px)', fontSize: '0.85rem' };
const heroBuyBtn = { background: '#fff', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' };

const categoryRow = { display: 'flex', gap: '10px', overflowX: 'auto' as const, padding: '0 16px', margin: '12px 0', scrollbarWidth: 'none' as const };
const catPillActive = { background: '#eff6ff', color: '#1e40af', padding: '10px 18px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #dbeafe', whiteSpace: 'nowrap' as const, display: 'flex', alignItems: 'center', gap: '6px' };
const catPill = { background: '#fff', color: '#64748b', padding: '10px 18px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, border: '1px solid #f1f5f9', whiteSpace: 'nowrap' as const };

const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '32px 0 16px' };
const sectionTitleStyle = { fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 };
const viewAllLinkStyle = { color: '#2563eb', textDecoration: 'none', fontSize: '1rem', fontWeight: 700 };

const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '24px' };
const cardStyle: React.CSSProperties = { borderRadius: '32px', overflow: 'hidden', position: 'relative', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundSize: 'cover', backgroundPosition: 'center' };
const cardContent: React.CSSProperties = { background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, transparent 100%)', padding: '24px', color: 'white' };
const badgeStyle = { background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px', display: 'inline-block', backdropFilter: 'blur(4px)' };
const cardTitleStyle = { fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0' };
const cardInfoStyle = { opacity: 0.8, fontSize: '0.85rem', margin: '0 0 16px 0', fontWeight: 500 };
const cardBuyBtn = { background: '#fff', color: '#2563eb', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', width: 'fit-content', minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

const emptyStateStyle = { margin: '16px', padding: '40px', borderRadius: '32px', border: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontWeight: 500 };
const noUpcomingEventsStyle = { padding: '20px', textAlign: 'center' as const, color: '#94a3b8', fontSize: '0.9rem' };
