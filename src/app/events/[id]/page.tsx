'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getEvent() {
      const { data } = await supabase.from('events').select('*').eq('id', id).single()
      if (data) setEvent(data)
      setLoading(false)
    }
    getEvent()
  }, [id])

  if (loading) return <div style={loaderStyle}>Fetching details...</div>
  if (!event) return <div style={loaderStyle}>Event not found.</div>

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {/* Hero Image */}
      <div style={heroSection}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} style={heroImage} />
        ) : (
          <div style={heroPlaceholder}>🏆 {event.title}</div>
        )}
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>{event.title}</h1>
        <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '24px' }}>📍 {event.location}</p>

        <div style={infoGrid}>
          <div style={infoBox}>📅 <strong>Date</strong><br/>{event.date}</div>
          <div style={infoBox}>⏰ <strong>Time</strong><br/>{event.time}</div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontWeight: 800 }}>About this Event</h3>
          <p style={{ lineHeight: '1.6', color: '#334155' }}>
            {event.description || "Join us for an electrifying match at Dedza Stadium. Ensure you secure your tickets early to avoid last-minute queues."}
          </p>
        </div>

        {/* Floating Bottom Bar for Mobile */}
        <div style={bottomBar}>
          <Link href={`/checkout/${event.id}`} style={{ width: '100%' }}>
            <button style={buyBtnLarge}>Buy Tickets Now</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- Styles ---
const heroSection = { width: '100%', height: '260px', background: '#0f172a' };
const heroImage = { width: '100%', height: '100%', objectFit: 'cover' as const };
const heroPlaceholder = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 900 };
const infoGrid = { display: 'flex', gap: '12px' };
const infoBox = { flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '16px', fontSize: '0.9rem' };
const bottomBar = { position: 'fixed' as const, bottom: 0, left: 0, right: 0, padding: '20px', background: '#fff', borderTop: '1px solid #e2e8f0', maxWidth: '480px', margin: '0 auto' };
const buyBtnLarge = { width: '100%', padding: '18px', borderRadius: '18px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' };
const loaderStyle = { padding: '50px', textAlign: 'center' as const, fontWeight: 700 };
