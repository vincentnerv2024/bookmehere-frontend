import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className="hero-section" style={{ 
        textAlign: 'center', 
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
        color: 'white',
        borderRadius: '16px',
        marginBottom: '3rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 className="hero-title">
          Welcome to BookMeHere
        </h1>
        <p className="hero-subtitle">
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
        <div className="booking-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem' }}>Easy Booking</h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Book appointments in just a few clicks with our intuitive interface.</p>
        </div>
        <div className="booking-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💼</div>
          <h3 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem' }}>Expert Masters</h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Choose from our team of professional masters with verified skills.</p>
        </div>
        <div className="booking-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h3 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '1rem' }}>Mobile Friendly</h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Access and book from any device with our responsive design.</p>
        </div>
      </div>
    </div>
  );
};

