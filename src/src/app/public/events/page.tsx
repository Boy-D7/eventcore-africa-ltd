'use client'
import { useState } from 'react';
import { routePayment } from '@/core/payments/routing';

export default function EventCard({ eventId, title }: { eventId: string, title: string }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const phone = prompt("Enter your TNM or Airtel number:");
    if (!phone) return;

    setLoading(true);
    // This sends the request to our Core Engine
    const result = await routePayment(phone, 3500, eventId);
    
    if (result.success) {
      alert("STK Push Sent! Check your phone to enter your PIN.");
    } else {
      alert("Error: " + result.message);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleBuy} disabled={loading} className="buy-btn">
      {loading ? "Processing..." : "Buy Ticket"}
    </button>
  );
}
