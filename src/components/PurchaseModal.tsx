'use client'
import { useState } from 'react'

interface PurchaseModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ event, isOpen, onClose }: PurchaseModalProps) {
  const [qty, setQty] = useState(1);
  const ticketPrice = 5000; // Example price

  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Get Your Ticket</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={body}>
          <p style={eventLabel}>{event.title}</p>
          
          <div style={qtyRow}>
            <span>Quantity</span>
            <div style={qtyControls}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}>-</button>
              <span style={{ fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={qtyBtn}>+</button>
            </div>
          </div>

          <div style={totalRow}>
            <span>Total Amount</span>
            <strong style={{ color: '#2563eb' }}>MK {(qty * ticketPrice).toLocaleString()}</strong>
          </div>

          <div style={paymentSection}>
            <p style={subLabel}>Select Payment Method</p>
            <div style={paymentGrid}>
              <button style={payOption}>Mpamba</button>
              <button style={payOption}>Airtel Money</button>
            </div>
          </div>

          <button style={finalBuyBtn} onClick={() => alert('Redirecting to payment...')}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Component Styles ---
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 };
const modal: React.CSSProperties = { width: '100%', background: '#fff', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px', maxWidth: '480px', margin: '0 auto' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const closeBtn = { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontWeight: 800 };
const eventLabel = { fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', marginBottom: '20px' };
const qtyRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 0', borderBottom: '1px solid #f1f5f9' };
const qtyControls = { display: 'flex', alignItems: 'center', gap: '15px' };
const qtyBtn = { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800 };
const totalRow = { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, margin: '20px 0' };
const paymentSection = { marginTop: '20px' };
const subLabel = { fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: '12px' };
const paymentGrid = { display: 'flex', gap: '10px', marginBottom: '24px' };
const payOption = { flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'none', fontWeight: 700 };
const finalBuyBtn = { width: '100%', padding: '18px', borderRadius: '18px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '1rem' };
