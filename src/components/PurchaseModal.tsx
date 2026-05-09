'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import QRCode from "react-qr-code"

interface PurchaseModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ event, isOpen, onClose }: PurchaseModalProps) {
  const [qty, setQty] = useState(1);
  const [network, setNetwork] = useState<'mpamba' | 'airtel' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketHash, setTicketHash] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in to buy a ticket");
        return;
      }

      // Call Edge Function for payment & ticket generation
      const { data, error } = await supabase.functions.invoke('generate-ticket', {
        body: { 
          eventId: event.id, 
          userId: user.id,
          phone: phoneNumber,
          network: network
        }
      });

      if (error) throw error;
      if (data?.ticketHash) setTicketHash(data.ticketHash);
      
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed or was cancelled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{ticketHash ? 'Your Ticket' : event.title}</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={body}>
          {!ticketHash ? (
            <>
              <p style={subLabel}>Select Payment Network</p>
              <div style={networkRow}>
                <button 
                  onClick={() => setNetwork('airtel')} 
                  style={{...netBtn, borderColor: network === 'airtel' ? '#e11d48' : '#e2e8f0'}}
                >
                  🔴 Airtel Money
                </button>
                <button 
                  onClick={() => setNetwork('mpamba')} 
                  style={{...netBtn, borderColor: network === 'mpamba' ? '#2563eb' : '#e2e8f0'}}
                >
                  🔵 TNM Mpamba
                </button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <p style={subLabel}>Phone Number</p>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  style={numberInput} 
                  placeholder="088..." 
                />
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading || !network || phoneNumber.length < 10}
                style={{
                  ...finalBuyBtn,
                  opacity: (loading || !network || phoneNumber.length < 10) ? 0.6 : 1
                }}
              >
                {loading ? 'Processing...' : `Pay MK ${(qty * (event.price || 3500)).toLocaleString()}`}
              </button>
            </>
          ) : (
            <div style={qrContainer}>
              <div style={qrWrapper}>
                <QRCode value={ticketHash} size={180} />
              </div>
              <h3 style={hashDisplay}>{ticketHash}</h3>
              <p style={instructionText}>Present this QR code at {event.location} for scanning.</p>
              <button onClick={onClose} style={doneBtn}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Styles matching your UI Reference ---
const overlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modal: React.CSSProperties = { background: '#fff', borderRadius: '32px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const header = { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const body = { padding: '24px' };
const closeBtn = { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' };
const subLabel = { fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' };
const networkRow = { display: 'flex', gap: '10px' };
const netBtn = { flex: 1, padding: '12px', borderRadius: '14px', border: '2px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' };
const numberInput = { width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' };
const finalBuyBtn = { width: '100%', marginTop: '20px', padding: '18px', borderRadius: '18px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' };
const qrContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const qrWrapper = { background: '#f8fafc', padding: '16px', borderRadius: '24px', marginBottom: '16px' };
const hashDisplay = { margin: '0 0 8px 0', fontSize: '1.1rem', letterSpacing: '1px' };
const instructionText = { textAlign: 'center' as const, fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' };
const doneBtn = { width: '100%', padding: '16px', borderRadius: '16px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700 };
