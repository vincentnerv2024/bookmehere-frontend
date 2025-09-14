import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

interface Booking {
  id: number;
  service_name: string;
  master_name: string;
  date: string;
  time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string;
  created_at: string;
}

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUserLogin();
    fetchUserBookings();
  }, []);

  const checkUserLogin = () => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userSession));
  };

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all bookings since we don't have user-specific filtering yet
      const response = await axios.get(getApiUrl(API_ENDPOINTS.BOOKINGS));
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      {/* Header */}
      <div className="booking-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
              My Bookings
            </h1>
            <p className="section-subtitle">
              Welcome back, {user?.username}! Manage your appointments here.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/booking')}
              className="btn btn-primary"
            >
              Book New Appointment
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="booking-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>No Bookings Yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            You haven't made any bookings yet. Book your first appointment!
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="btn btn-primary"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
                    {booking.service_name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                    <strong>Master:</strong> {booking.master_name}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                    <strong>Date:</strong> {formatDate(booking.date)}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                    <strong>Time:</strong> {formatTime(booking.time)}
                  </p>
                  {booking.notes && (
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Booked on {formatDate(booking.created_at)}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid #e5e7eb' 
              }}>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => {
                    // TODO: Implement edit booking
                    toast.info('Edit booking feature coming soon!');
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline"
                  style={{ 
                    fontSize: '0.875rem', 
                    padding: '0.5rem 1rem',
                    borderColor: '#ef4444',
                    color: '#ef4444'
                  }}
                  onClick={() => {
                    // TODO: Implement cancel booking
                    toast.info('Cancel booking feature coming soon!');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};