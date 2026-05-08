'use client'
import React, { useState } from 'react'

export default function Home() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-logo">
          <span className="logo-main">EVENTCORE</span>
          <span className="logo-sub">AFRICA LIMITED</span>
        </div>
        <button className="signin-btn">Sign In</button>
      </header>

      <main className="page active">
         <div className="event-types-note">
           <i className="fas fa-map-pin"></i> Dedza Council Stadium Pilot
         </div>
         <h2 className="section-title">Upcoming Events</h2>
         {/* We will add your event cards here next */}
         <div className="event-card" style={{backgroundImage: "url('https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg')"}}>
            <div className="event-card-content">
                <h4>Dynamos vs Silver Strikers</h4>
                <p>Dedza Stadium · May 15</p>
                <button className="buy-btn">Buy Now</button>
            </div>
         </div>
      </main>
    </div>
  )
}
