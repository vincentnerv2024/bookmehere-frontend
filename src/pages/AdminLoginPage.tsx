import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export const AdminLoginPage: React.FC = () => {
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
      const response = await axios.post(getApiUrl(API_ENDPOINTS.ADMIN_LOGIN), formData);
      
      if (response.data.success) {
        toast.success('Login successful!');
        // Store admin session info
        localStorage.setItem('adminSession', JSON.stringify(response.data.user));
        navigate('/admin');
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
    <div className="container">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg admin-login-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="admin-credentials">
            <h4>Default Credentials:</h4>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>

      <style>{`
        .admin-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .admin-login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          width: 100%;
          max-width: 400px;
        }

        .admin-login-title {
          text-align: center;
          margin-bottom: 0.5rem;
          color: #1f2937;
          font-size: 2rem;
        }

        .admin-login-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
        }

        .form-input {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .admin-login-btn {
          width: 100%;
          padding: 0.875rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #f3f4f6;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .admin-credentials {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .admin-credentials h4 {
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .admin-credentials p {
          margin: 0.25rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .admin-login-container {
            padding: 1rem;
          }

          .admin-login-card {
            padding: 2rem;
          }

          .admin-login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

