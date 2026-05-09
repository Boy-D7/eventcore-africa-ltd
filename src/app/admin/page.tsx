'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [eventName, setEventName] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch real revenue from your 'tickets' table if it exists
  useEffect(() => {
    const fetchRevenue = async () => {
      const { data, error } = await supabase.from('tickets').select('price');
      if (!error && data) {
        const total = data.reduce((sum, item) => sum + (item.price || 0), 0);
        setRevenue(total);
      }
    };
    fetchRevenue();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('events').insert([
      { 
        title: eventName, 
        location: venue, 
        date: date, 
        time: time,
        status: 'Upcoming' 
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Event Published Successfully!");
      setEventName('');
      setVenue('');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Admin</h1>
        <p style={{ color: '#64748b' }}>Manage events and track earnings</p>
      </header>

      {/* REVENUE CARD */}
      <div style={statsCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</p>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#059669', margin: '8px 0' }}>
              MK {revenue.toLocaleString()}
            </h2>
          </div>
          <div style={iconBadge}>💰</div>
        </div>
        <div style={trendBadge}>+8.4% this month</div>
      </div>

      {/* CREATE EVENT FORM */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Add New Event</h3>
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={inputGroup}>
            <label style={labelStyle}>Event Title</label>
            <input 
              type="text" 
              placeholder="e.g. Dynamos vs Silver Strikers" 
              style={inputStyle}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Venue</label>
            <input 
              type="text" 
              placeholder="e.g. Dedza Stadium" 
              style={inputStyle}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}>Time</label>
              <input type="time" style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <button type="submit" disabled={loading} style={createBtn}>
            {loading ? 'Publishing...' : '🚀 Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles ---
const statsCard: React.CSSProperties = {
  background: '#fff', padding: '28px', borderRadius: '32px', 
  boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9'
};

const iconBadge = { fontSize: '1.5rem', background: '#f0fdf4', padding: '12px', borderRadius: '16px' };

const trendBadge = {
  display: 'inline-block', background: '#dcfce7', color: '#166534', 
  padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700
};

const inputGroup = { display: 'flex', flexDirection: 'column' as const, gap: '6px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginLeft: '4px' };

const inputStyle = {
  width: '100%', padding: '16px 20px', borderRadius: '18px', border: '2px solid #f1f5f9', 
  fontSize: '1rem', outline: 'none', background: '#f8fafc', transition: '0.2s',
  boxSizing: 'border-box' as const
};

const createBtn = {
  background: '#0f172a', color: 'white', padding: '18px', borderRadius: '20px',
  border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: '12px',
  boxShadow: '0 10px 20px rgba(15,23,42,0.2)'
};
