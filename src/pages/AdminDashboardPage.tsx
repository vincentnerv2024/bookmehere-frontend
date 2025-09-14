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

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [admin, setAdmin] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    checkAdminLogin();
    fetchAllBookings();
  }, []);

  const checkAdminLogin = () => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/login');
      return;
    }
    setAdmin(JSON.parse(adminSession));
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
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
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      // TODO: Implement API endpoint for updating booking status
      toast.info('Update booking status feature coming soon!');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      // TODO: Implement API endpoint for deleting bookings
      toast.info('Delete booking feature coming soon!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading bookings...</div>
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
              Admin Dashboard
            </h1>
            <p className="section-subtitle">
              Manage all bookings and business operations
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-primary"
            >
              Business Settings
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

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Bookings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Confirmed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
              {bookings.filter(b => b.status.toLowerCase() === 'pending').length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pending</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="booking-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '500', color: '#374151' }}>Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="booking-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>No Bookings Found</h3>
          <p style={{ color: '#6b7280' }}>
            {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
                    {booking.service_name}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Master:</strong> {booking.master_name}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Date:</strong> {formatDate(booking.date)}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Time:</strong> {formatTime(booking.time)}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Customer:</strong> {booking.customer_name}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Phone:</strong> {booking.customer_phone}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Email:</strong> {booking.customer_email}
                    </p>
                  </div>
                  {booking.notes && (
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem', marginTop: '0.5rem' }}>
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
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                >
                  Confirm
                </button>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline"
                  style={{ 
                    fontSize: '0.875rem', 
                    padding: '0.5rem 1rem',
                    borderColor: '#ef4444',
                    color: '#ef4444'
                  }}
                  onClick={() => deleteBooking(booking.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
