'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Smartphone, ChevronLeft, Loader2, CheckCircle2, Store } from 'lucide-react'

export default function BoothAgentPage() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<'EVENTS' | 'TIERS' | 'PAYMENT'>('EVENTS')
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [selectedTier, setSelectedTier] = useState<any>(null)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'IDLE' | 'WAITING_STK' | 'SUCCESS'>('IDLE')
  const [ticketHash, setTicketHash] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').eq('is_active', true)
    if (data) setEvents(data)
  }

  async function handleSelectEvent(event: any) {
    setSelectedEvent(event)
    const { data } = await supabase.from('ticket_tiers').select('*').eq('event_id', event.id)
    if (data) setTiers(data)
    setStep('TIERS')
  }

  const triggerSTK = async () => {
    if (phone.length < 10) return alert("Enter valid phone number")
    setLoading(true)
    setStatus('WAITING_STK')

    const { data: tx, error } = await supabase.from('transactions').insert({
      phone_number: phone,
      amount: selectedTier.price_mwk,
      provider: phone.startsWith('088') ? 'TNM' : 'AIRTEL',
      status: 'PENDING',
      external_ref: `BTH-${Math.random().toString(36).substring(7).toUpperCase()}`
    }).select().single()

    if (error) {
      alert("Payment failed")
      setLoading(false)
      return
    }

    const subscription = supabase
      .channel(`tx-${tx.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'transactions', filter: `id=eq.${tx.id}` }, 
      async (payload) => {
        if (payload.new.status === 'SUCCESS') {
          subscription.unsubscribe()
          await issueTicket()
        }
      }).subscribe()
  }

  const issueTicket = async () => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase()
    setTicketHash(hash)
    await supabase.from('tickets').insert({
      event_id: selectedEvent.id,
      tier_id: selectedTier.id,
      ticket_hash: hash,
      customer_phone: phone,
      status: 'valid'
    })
    setStatus('SUCCESS')
    setLoading(false)
    setTimeout(() => window.print(), 800)
  }

  if (!mounted) return null

  return (
    <div style={containerStyle}>
      <div className="no-print">
        <div style={headerStyle}>
          {step !== 'EVENTS' && (
            <button onClick={() => setStep(step === 'TIERS' ? 'EVENTS' : 'TIERS')} style={backBtn}>
              <ChevronLeft size={20} />
            </button>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>BOOTH TERMINAL</span>
            <span style={{ fontSize: '0.6rem', color: '#2563eb', fontWeight: 700 }}>EVENTCORE AFRICA LTD</span>
          </div>
        </div>

        {step === 'EVENTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map(ev => (
              <div key={ev.id} onClick={() => handleSelectEvent(ev)} style={eventCard}>
                <div style={{ ...imgStyle, backgroundImage: `url(${ev.image_url})` }} />
                <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{ev.title}</h3>
                  <button style={actionBtn}>Select</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'TIERS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tiers.map(t => (
              <div key={t.id} onClick={() => { setSelectedTier(t); setStep('PAYMENT'); }} style={tierCard}>
                <span>{t.name}</span>
                <strong>MK {t.price_mwk}</strong>
              </div>
            ))}
          </div>
        )}

        {step === 'PAYMENT' && (
          <div style={payCard}>
            <p>Customer: <strong>{phone || '...'}</strong></p>
            <input type="tel" placeholder="099..." value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            <button onClick={triggerSTK} disabled={loading} style={loading ? { ...payBtn, opacity: 0.5 } : payBtn}>
              {loading ? <Loader2 className="spin" /> : 'Process Payment'}
            </button>
            {status === 'SUCCESS' && <div style={{ color: 'green', marginTop: '10px' }}>Payment Confirmed! Printing...</div>}
          </div>
        )}
      </div>

      <div className="print-area">
        <center style={{ width: '58mm', fontFamily: 'monospace' }}>
          <h2>EVENTCORE AFRICA</h2>
          <hr />
          <h3>{selectedEvent?.title}</h3>
          <p>{selectedTier?.name}</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketHash}`} width="120" />
          <h1>{ticketHash}</h1>
          <p>{new Date().toLocaleString()}</p>
        </center>
      </div>

      <style jsx>{`
        @media screen { .print-area { display: none; } }
        @media print { .no-print { display: none; } .print-area { display: block; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const containerStyle = { maxWidth: '480px', margin: '0 auto', padding: '16px' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' };
const backBtn = { background: '#fff', border: '1px solid #ddd', padding: '8px', borderRadius: '8px' };
const eventCard = { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const imgStyle = { height: '100px', backgroundSize: 'cover', backgroundPosition: 'center' };
const actionBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px' };
const tierCard = { background: '#fff', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', border: '1px solid #eee' };
const payCard = { background: '#fff', padding: '20px', borderRadius: '16px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' };
const payBtn = { width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700 };
