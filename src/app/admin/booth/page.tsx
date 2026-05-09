'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Smartphone, Printer, ChevronLeft, Loader2, CheckCircle2, Ticket } from 'lucide-react'

export default function BoothPage() {
  const [step, setStep] = useState<'EVENTS' | 'TIERS' | 'PAYMENT'>('EVENTS')
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [selectedTier, setSelectedTier] = useState<any>(null)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'IDLE' | 'WAITING_STK' | 'SUCCESS'>('IDLE')
  // New state for the ticket code
  const [ticketHash, setTicketHash] = useState('')

  useEffect(() => {
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

  const detectProvider = (num: string) => {
    if (num.startsWith('099') || num.startsWith('098')) return 'AIRTEL'
    if (num.startsWith('088')) return 'TNM'
    return 'AIRTEL' 
  }

  const triggerSTK = async () => {
    if (phone.length < 10) return alert("Enter valid Malawi phone number")
    setLoading(true)
    setStatus('WAITING_STK')

    const { data: tx, error } = await supabase.from('transactions').insert({
      phone_number: phone,
      amount: selectedTier.price_mwk,
      provider: detectProvider(phone),
      status: 'PENDING',
      external_ref: `BTH-${Math.random().toString(36).substring(7).toUpperCase()}`
    }).select().single()

    if (error) {
      alert("Failed to initiate transaction")
      setLoading(false)
      return
    }

    const subscription = supabase
      .channel('booth_payment')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'transactions', filter: `id=eq.${tx.id}` }, 
      async (payload) => {
        if (payload.new.status === 'SUCCESS') {
          subscription.unsubscribe()
          await issueTicket()
        }
      }).subscribe()
  }

  const issueTicket = async () => {
    // Generate the unique 6-character code
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase()
    setTicketHash(hash)

    const { error } = await supabase.from('tickets').insert({
      event_id: selectedEvent.id,
      tier_id: selectedTier.id,
      ticket_hash: hash,
      customer_phone: phone,
      status: 'valid'
    })

    if (!error) {
      setStatus('SUCCESS')
      setLoading(false)
      // Small delay to ensure the QR code image is ready for the printer
      setTimeout(() => window.print(), 800) 
    }
  }

  return (
    <div style={containerStyle}>
      {/* HEADER SECTION */}
      <div style={headerStyle}>
        {step !== 'EVENTS' && (
          <button onClick={() => setStep(step === 'TIERS' ? 'EVENTS' : 'TIERS')} style={backBtn}>
            <ChevronLeft size={20} />
          </button>
        )}
        <div style={brandCol}>
          <span style={mainBrand}>BOOTH AGENT</span>
          <span style={subBrand}>EVENTCORE AFRICA LTD</span>
        </div>
      </div>

      {/* STEP 1: BROWSE EVENTS */}
      {step === 'EVENTS' && (
        <div style={gridStyle}>
          {events.map(ev => (
            <div key={ev.id} onClick={() => handleSelectEvent(ev)} style={eventCard}>
              <div style={{...imgStyle, backgroundImage: `url(${ev.image_url})`}} />
              <div style={cardInfo}>
                <h3 style={eventTitle}>{ev.title}</h3>
                <p style={eventLoc}>{ev.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: SELECT TIER */}
      {step === 'TIERS' && (
        <div style={tierList}>
          <h2 style={sectionTitle}>Select Ticket Type</h2>
          {tiers.map(tier => (
            <div key={tier.id} onClick={() => { setSelectedTier(tier); setStep('PAYMENT'); }} style={tierCard}>
              <div>
                <div style={tierName}>{tier.name}</div>
                <div style={tierCap}>{tier.capacity - (tier.sold_count || 0)} left</div>
              </div>
              <div style={tierPrice}>MK {tier.price_mwk}</div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 3: PAYMENT & PUSH */}
      {step === 'PAYMENT' && (
        <div style={payCard}>
          <div style={summaryBox}>
            <strong>{selectedTier.name}</strong>
            <span>MK {selectedTier.price_mwk}</span>
          </div>

          <label style={labelStyle}>Customer Mobile Number</label>
          <input 
            type="tel" 
            placeholder="099... or 088..." 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            style={inputStyle}
          />

          <button onClick={triggerSTK} disabled={loading} style={loading ? disabledBtn : payBtn}>
            {loading ? <Loader2 className="spin" /> : <Smartphone size={20} />}
            {loading ? 'Confirming PIN...' : 'Push STK Payment'}
          </button>

          {status === 'SUCCESS' && (
            <div style={successBox}>
              <CheckCircle2 size={32} />
              <p>Ticket Issued! Receipt Printing...</p>
              <button 
                onClick={() => {setStep('EVENTS'); setStatus('IDLE'); setPhone(''); setTicketHash('');}} 
                style={resetBtn}
              >
                Next Customer
              </button>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTION PRINT TEMPLATE (Hidden on screen) */}
      <div className="print-area">
        <center style={{ fontFamily: 'monospace', width: '100%', padding: '10px' }}>
          <h2 style={{ margin: 0 }}>EVENTCORE AFRICA</h2>
          <p style={{ fontSize: '10px', margin: '2px 0' }}>Digital Event Infrastructure</p>
          <hr style={{ borderTop: '1px dashed #000' }} />
          
          <h3 style={{ margin: '10px 0 5px' }}>{selectedEvent?.title}</h3>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedTier?.name}</p>
          <p style={{ margin: '0 0 10px' }}>Price: MK {selectedTier?.price_mwk}</p>

          {ticketHash && (
            <div style={{ background: '#fff', padding: '10px', display: 'inline-block' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketHash}`} 
                alt="Ticket QR"
                style={{ width: '130px', height: '130px' }}
              />
            </div>
          )}

          <div style={{ marginTop: '10px', fontSize: '20px', fontWeight: 'bold', border: '1px solid #000', padding: '5px' }}>
            CODE: {ticketHash}
          </div>

          <p style={{ fontSize: '9px', marginTop: '10px' }}>Phone: {phone}</p>
          <p style={{ fontSize: '9px' }}>{new Date().toLocaleString()}</p>
          <p style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '10px' }}>VALID FOR SINGLE ENTRY</p>
        </center>
      </div>

      <style>{`
        @media screen { .print-area { display: none; } }
        @media print { 
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// --- STYLES ---
const containerStyle = { maxWidth: '480px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '16px' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', marginTop: '10px' };
const backBtn = { background: '#fff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer' };
const brandCol = { display: 'flex', flexDirection: 'column' as const };
const mainBrand = { fontWeight: 900, fontSize: '1rem', color: '#0f172a' };
const subBrand = { fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '1px' };
const gridStyle = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };
const eventCard = { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer' };
const imgStyle = { height: '140px', backgroundSize: 'cover', backgroundPosition: 'center' };
const cardInfo = { padding: '16px' };
const eventTitle = { margin: 0, fontSize: '1.1rem', fontWeight: 800 };
const eventLoc = { margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' };
const tierList = { display: 'flex', flexDirection: 'column' as const, gap: '12px' };
const sectionTitle = { fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' };
const tierCard = { background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', cursor: 'pointer' };
const tierName = { fontWeight: 700, color: '#0f172a' };
const tierCap = { fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 };
const tierPrice = { fontWeight: 800, color: '#2563eb' };
const payCard = { background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' };
const summaryBox = { display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', marginBottom: '20px' };
const payBtn = { width: '100%', padding: '16px', borderRadius: '14px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' };
const disabledBtn = { ...payBtn, opacity: 0.6 };
const successBox = { marginTop: '20px', textAlign: 'center' as const, color: '#059669', background: '#f0fdf4', padding: '20px', borderRadius: '16px' };
const resetBtn = { marginTop: '12px', background: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 600 };
