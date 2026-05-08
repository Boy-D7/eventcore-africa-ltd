'use client'
import React, { useState } from 'react';
import { routePayment } from '@/core/payments/routing';

interface Props {
  event: { id: string; title: string; price: number };
  onClose: () => void;
}

export default function PurchaseModal({ event, onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'input' | 'processing' | 'success'>('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('processing');

    try {
      const result = await routePayment(phone, event.price, event.id);
      if (result.success) {
        setStatus('success');
      } else {
        alert(result.message);
        setStatus('input');
      }
    } catch (err) {
      alert("Payment failed to initiate");
      setStatus('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
        
        {status === 'input' && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '8px', fontWeight: 800 }}>Confirm Ticket</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>{event.title}</p>
            
            <label style={labelStyle}>PHONE NUMBER (AIRTEL / TNM)</label>
            <input 
              type="tel" 
              placeholder="099... or 088..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={inputStyle}
            />
            
            <button type="submit" style={payBtnStyle}>
              Pay MK {event.price.toLocaleString()}
            </button>
          </form>
        )}

        {status === 'processing' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner"></div>
            <h4 style={{ marginTop: '16px' }}>Check your phone</h4>
            <p style={{ color: '#64748b' }}>Enter your PIN to complete purchase</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem' }}>✅</div>
            <h4 style={{ marginTop: '16px' }}>Request Sent!</h4>
            <p style={{ color: '#64748b' }}>Your ticket will be issued once payment is confirmed.</p>
            <button onClick={onClose} style={payBtnStyle}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles based on your premium UI
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalStyle: React.CSSProperties = { background: 'white', width: '100%', maxWidth: '400px', borderRadius: '28px', padding: '30px', position: 'relative' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '1.1rem', marginBottom: '20px', outline: 'none' };
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' };
const payBtnStyle: React.CSSProperties = { width: '100%', background: '#2563eb', color: 'white', padding: '18px', borderRadius: '18px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' };
const closeBtnStyle: React.CSSProperties = { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' };
