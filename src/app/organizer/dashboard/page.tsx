'use client'
import React, { useState } from 'react';
// Using relative path to solve the "Module not found" build error
import { createEvent } from '../../actions/events'; 

export default function OrganizerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      await createEvent(formData);
      setShowForm(false);
      alert("Event Created and Live!");
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui' }}>
      {/* Organizer Header */}
      <header style={{ padding: '24px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.1em' }}>ORGANIZER PORTAL</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Dedza Stadium Control</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>MK 0.00</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TICKETS SOLD</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>0</div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 700, marginBottom: '20px', cursor: 'pointer' }}
        >
          {showForm ? '✕ Cancel' : '+ Create New Event'}
        </button>

        {/* Create Event Form */}
        {showForm && (
          <form action={handleCreate} style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>Event Details</h3>
            
            <div style={fieldGroup}>
              <label style={labelStyle}>EVENT TITLE</label>
              <input name="title" placeholder="e.g. Silver Strikers vs Wanderers" required style={inputStyle} />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>VENUE</label>
              <input name="location" placeholder="Venue" defaultValue="Dedza Stadium" required style={inputStyle} />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>MATCH DATE</label>
              <input name="date" type="date" required style={inputStyle} />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>CATEGORY</label>
              <select name="category" style={inputStyle}>
                <option value="Football">Football Match</option>
                <option value="Music">Music Concert</option>
                <option value="Church">Church Event</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#0f172a', color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: 700, marginTop: '10px', cursor: 'pointer' }}>
              {loading ? 'Publishing...' : 'Publish to Public Site'}
            </button>
          </form>
        )}

        <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Active Events</h3>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>The system is currently scanning for live matches...</p>
        </div>
      </main>
    </div>
  );
}

// Styles
const fieldGroup = { display: 'flex', flexDirection: 'column' as const, gap: '6px' };
const labelStyle = { fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' };
const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  outline: 'none'
};
