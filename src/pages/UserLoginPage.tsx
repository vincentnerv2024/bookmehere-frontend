import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(getApiUrl(API_ENDPOINTS.USER_LOGIN), formData);
      
      if (response.data.success) {
        toast.success('Login successful!');
        // Store user session info
        localStorage.setItem('userSession', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        toast.error('Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="booking-card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            User Login
          </h1>
          <p className="section-subtitle">
            Access your bookings and manage your appointments
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Demo credentials:
          </p>
          <div style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#374151'
          }}>
            <p><strong>Username:</strong> user</p>
            <p><strong>Password:</strong> user123</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
