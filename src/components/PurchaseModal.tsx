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
  const [ticketHash, setTicketHash] = useState<string | null>(null); // To store the slug

  if (!isOpen || !event) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please sign in to buy a ticket");
        return;
      }

      // 2. Call your Edge Function
      const { data, error } = await supabase.functions.invoke('generate-ticket', {
        body: { 
          eventId: event.id, 
          userId: user.id 
        }
      });

      if (error) throw error;

      // 3. Store the hash/slug returned from the function
      if (data?.ticketHash) {
        setTicketHash(data.ticketHash);
      }
    } catch (err) {
      console.error("Payment/Generation error:", err);
      alert("Failed to generate ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2 style={{ margin: 0 }}>{ticketHash ? 'Your Ticket' : 'Get Your Ticket'}</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={body}>
          {!ticketHash ? (
            // --- SHOW PAYMENT FORM ---
            <>
              <p style={eventLabel}>{event.title}</p>
              {/* ... (Your existing Qty and Network buttons) ... */}
              
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
                {loading ? 'Processing...' : `Pay MK ${(qty * 5000).toLocaleString()}`}
              </button>
            </>
          ) : (
            // --- SHOW QR CODE (The Generated Ticket) ---
            <div style={qrContainer}>
              <div style={qrWrapper}>
                <QRCode value={ticketHash} size={180} />
              </div>
              <h3 style={hashDisplay}>{ticketHash}</h3>
              <p style={instructionText}>Present this QR code at Dedza Stadium for scanning.</p>
              
              <button onClick={onClose} style={doneBtn}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Added Styles ---
const qrContainer = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '20px 0' };
const qrWrapper = { background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const hashDisplay = { marginTop: '15px', letterSpacing: '2px', fontWeight: 900, color: '#0f172a' };
const instructionText = { textAlign: 'center' as const, fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' };
const doneBtn = { width: '100%', padding: '16px', borderRadius: '14px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700 };
