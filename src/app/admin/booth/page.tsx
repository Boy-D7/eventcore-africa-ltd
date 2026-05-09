'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PurchaseModal from '@/components/PurchaseModal'

export default function BoothAgentPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (data) setEvents(data);
    }
    fetchEvents();
  }, []);

  // Filter events based on search (e.g., searching for "Dynamos")
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={title}>Booth Agent Terminal</h1>
        <div style={badge}>Cashless Only</div>
      </header>

      <div style={searchWrapper}>
        <input 
          type="text" 
          placeholder="Search match or event..." 
          style={searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={grid}>
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            style={card} 
            onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }}
          >
            <div style={imageBox}>
              {event.image_url ? (
                <img src={event.image_url} alt="" style={img} />
              ) : (
                <div style={placeholder}>⚽ {event.title.split(' ')[0]}</div>
              )}
            </div>
            <div style={cardContent}>
              <h3 style={eventTitle}>{event.title}</h3>
              <p style={eventMeta}>📍 {event.location}</p>
              <p style={eventMeta}>📅 {event.date}</p>
            </div>
          </div>
        ))}
      </div>

      <PurchaseModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

// --- Styles ---
const container = { padding: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const title = { fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' };
const badge = { background: '#2563eb', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 };
const searchWrapper = { marginBottom: '24px' };
const searchInput = { width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' };
const card = { background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' };
const imageBox = { height: '110px', background: '#f1f5f9' };
const img = { width: '100%', height: '100%', objectFit: 'cover' as const };
const placeholder = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#94a3b8' };
const cardContent = { padding: '12px' };
const eventTitle = { margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' };
const eventMeta = { margin: '4px 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 };
