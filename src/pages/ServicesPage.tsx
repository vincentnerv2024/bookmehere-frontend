import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Service, BusinessSettings, ApiResponse } from '../types';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    id: 1,
    currency: 'USD',
    currency_symbol: '$',
    business_name: 'BookMeHere',
    business_phone: '',
    business_email: '',
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchServices();
    fetchBusinessSettings();
  }, []);

  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl(API_ENDPOINTS.SERVICES);
      console.log('Environment variables:', {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        PROD: import.meta.env.PROD,
        MODE: import.meta.env.MODE
      });
      console.log('Fetching services from:', apiUrl);
      const response = await axios.get<ApiResponse<Service[]>>(apiUrl);
      console.log('Services response:', response.data);
      setServices(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to load services:', err);
      console.error('Error details:', err.response?.data);
      console.error('Full error:', err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessSettings = async (): Promise<void> => {
    try {
      const response = await axios.get<ApiResponse<BusinessSettings>>(getApiUrl(API_ENDPOINTS.SERVICE_SETTINGS));
      setBusinessSettings(response.data.data || businessSettings);
    } catch (err) {
      console.error('Failed to load business settings:', err);
    }
  };

  const handleBookNow = (serviceId: number): void => {
    navigate(`/booking/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Our Services</h1>
      <p className="section-subtitle">
        Professional services tailored to your needs
      </p>

      {services.length === 0 ? (
        <div className="no-services">
          <h3>No services available</h3>
          <p>Please check back later or contact us for more information.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              {service.image_path && (
                <img
                  src={`http://localhost:3001${service.image_path}?v=${service.updated_at}`}
                  alt={service.name}
                  className="service-image"
                />
              )}
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">
                  {service.description || 'Professional service tailored to your needs'}
                </p>
                <div className="service-details">
                  <div className="service-price">
                    <span className="price">{businessSettings.currency_symbol}{service.price}</span>
                    <span className="duration">{service.duration} min</span>
                  </div>
                  <button
                    onClick={() => handleBookNow(service.id)}
                    className="btn btn-primary book-now-btn"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-services {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .no-services h3 {
          margin-bottom: 1rem;
          color: #374151;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .service-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .service-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .service-content {
          padding: 1.5rem;
        }

        .service-name {
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .service-description {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .service-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-price {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price {
          color: #059669;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .duration {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .book-now-btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .book-now-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .service-details {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .book-now-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

