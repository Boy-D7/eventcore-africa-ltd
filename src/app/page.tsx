'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log("Checking Supabase connection...");
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          console.error("Supabase Error:", error);
          setDebugError(error.message);
        } else {
          console.log("Data received:", data);
          setEvents(data || []);
        }
      } catch (err: any) {
        setDebugError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>EVENTCORE AFRICA</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {loading ? (
          <p>Connecting to Dedza Stadium...</p>
        ) : debugError ? (
          <p style={{ color: 'red' }}>Error: {debugError}</p>
        ) : events.length === 0 ? (
          <p>No active matches found. Check Supabase RLS.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} style={{ padding: '20px', background: '#f4f4f4', borderRadius: '15px', marginBottom: '10px' }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{event.title}</h2>
              <p>{event.location} · {new Date(event.date).toDateString()}</p>
              <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                Buy Ticket
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
