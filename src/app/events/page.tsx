'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PurchaseModal from '@/components/PurchaseModal' // Import the new component

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... (Keep your existing useEffect fetch logic)

  const handleBuyClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      {/* ... (Your existing events map) */}
      <button onClick={() => handleBuyClick(event)} style={buyBtnStyle}>
        Buy Ticket Now
      </button>

      {/* Render the Component */}
      <PurchaseModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
