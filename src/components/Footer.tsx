import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BookMeHere</h3>
          <p>Your trusted booking platform for professional services.</p>
          <p>Book appointments with expert masters in just a few clicks.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/booking">Book Now</a></li>
            <li><a href="/admin">Admin Panel</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Need help? Contact us anytime.</p>
          <p>We're here to make your booking experience seamless.</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 BookMeHere. All rights reserved.</p>
      </div>
    </footer>
  );
};
