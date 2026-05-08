'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function getEvents() {
      const { data } = await supabase.from('events').select('*');
      if (data) setEvents(data);
    }
    getEvents();
  }, []);

  return (
    <main className="page active">
      <h2 className="section-title">Live Match Tickets</h2>
      {events.map((event) => (
        <div key={event.id} className="event-card">
           <h4>{event.title}</h4>
           <p>{event.location} · {event.date}</p>
           <button className="buy-btn">Buy Now (Mobile Money)</button>
        </div>
      ))}
    </main>
  );
}
