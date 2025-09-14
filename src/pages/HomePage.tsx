import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className="hero-section" style={{ 
        textAlign: 'center', 
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>
          Welcome to BookMeHere
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9' }}>
          Professional booking system for modern businesses
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/book" className="btn btn-primary" style={{ 
            backgroundColor: 'white', 
            color: '#667eea',
            fontSize: '1.125rem',
            padding: '1rem 2rem'
          }}>
            Book Now
          </Link>
          <Link to="/services" className="btn btn-outline" style={{ 
            borderColor: 'white', 
            color: 'white',
            fontSize: '1.125rem',
            padding: '1rem 2rem'
          }}>
            View Services
          </Link>
        </div>
      </div>

      <div className="features-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div className="card">
          <h3>🎯 Easy Booking</h3>
          <p>Book appointments in just a few clicks with our intuitive interface.</p>
        </div>
        <div className="card">
          <h3>👨‍💼 Expert Masters</h3>
          <p>Choose from our team of professional masters with verified skills.</p>
        </div>
        <div className="card">
          <h3>📱 Mobile Friendly</h3>
          <p>Access and book from any device with our responsive design.</p>
        </div>
      </div>
    </div>
  );
};

