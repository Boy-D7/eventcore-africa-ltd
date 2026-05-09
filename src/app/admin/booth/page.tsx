'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PurchaseModal from '@/components/PurchaseModal' // Import your existing modal
import { ChevronLeft, LayoutGrid, Printer, Smartphone } from 'lucide-react'

export default function BoothAgentPage() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastTicket, setLastTicket] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').eq('is_active', true)
    if (data) setEvents(data)
  }

  // This function runs when the PurchaseModal completes a sale
  const handleBoothSuccess = (ticketData: any) => {
    setLastTicket(ticketData)
    setIsModalOpen(false)
    // Trigger the dedicated booth print layer
    setTimeout(() => window.print(), 500)
  }

  if (!mounted) return null

  return (
    <div style={boothLayout}>
      {/* 1. AGENT DASHBOARD LAYER */}
      <div className="no-print">
        <div style={header}>
          <span style={badge}>OFFICIAL BOOTH</span>
          <h1 style={title}>Dedza Stadium Terminal</h1>
        </div>

        <div style={grid}>
          {events.map(ev => (
            <div key={ev.id} onClick={() => { setSelectedEvent(ev); setIsModalOpen(true); }} style={eventCard}>
               <div style={{...img, backgroundImage: `url(${ev.image_url})`}} />
               <div style={info}>
                 <h3>{ev.title}</h3>
                 <button style={issueBtn}>Issue Ticket</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SHARED PURCHASE MODAL */}
      {isModalOpen && (
        <PurchaseModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          mode="BOOTH" // We pass a mode so the modal knows this is an agent sale
          onSuccess={handleBoothSuccess} 
        />
      )}

      {/* 3. DEDICATED PRINT LAYER (Invisible on screen) */}
      <div className="print-only">
        <center style={{ width: '58mm', fontFamily: 'monospace' }}>
          <h2 style={printHeader}>EVENTCORE AFRICA</h2>
          <hr />
          <p><strong>{selectedEvent?.title}</strong></p>
          <p>{lastTicket?.tier_name}</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${lastTicket?.hash}`} width="130" />
          <h1 style={{fontSize: '22px'}}>{lastTicket?.hash}</h1>
          <p>{new Date().toLocaleString()}</p>
          <p>--- KEEP FOR ENTRY ---</p>
        </center>
      </div>

      <style jsx>{`
        @media screen { .print-only { display: none; } }
        @media print {
          .no-print { display: none; }
          .print-only { display: block; position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}

// --- STYLES ---
const boothLayout = { maxWidth: '480px', margin: '0 auto', padding: '20px', background: '#f1f5f9', minHeight: '100vh' };
const header = { marginBottom: '20px' };
const badge = { background: '#2563eb', color: '#fff', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 900 };
const title = { fontSize: '1.4rem', fontWeight: 900, marginTop: '8px' };
const grid = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };
const eventCard = { background: '#fff', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const img = { height: '120px', backgroundSize: 'cover', backgroundPosition: 'center' };
const info = { padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const issueBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700 };
const printHeader = { margin: 0, fontSize: '18px' };
