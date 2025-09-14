import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Service, 
  Master, 
  TimeSlot, 
  BusinessSettings, 
  CustomerData,
  ApiResponse 
} from '../types';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const navigate = useNavigate();

  // All booking state
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    contact_preference: 'phone_call'
  });
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

  useEffect(() => {
    fetchServices();
    fetchBusinessSettings();
  }, []);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      // Pre-select service if coming from service page
      const service = services.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
        fetchMastersForService(service.id);
      }
    }
  }, [serviceId, services]);

  const fetchServices = async (): Promise<void> => {
    try {
      const response = await axios.get<ApiResponse<Service[]>>(getApiUrl(API_ENDPOINTS.SERVICES));
      setServices(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load services');
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

  const fetchMastersForService = async (serviceId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Master[]>>(getApiUrl(API_ENDPOINTS.MASTERS_BY_SERVICE(serviceId)));
      setMasters(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load masters');
      setMasters([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterAvailability = async (masterId: number, date: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<TimeSlot[]>>(getApiUrl(API_ENDPOINTS.MASTER_AVAILABILITY(masterId, date)));
      setTimeSlots(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load time slots');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
    setSelectedMaster(null);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);
    fetchMastersForService(service.id);
  };

  const handleMasterSelect = (master: Master): void => {
    setSelectedMaster(master);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);
  };

  const handleDateSelect = (date: string): void => {
    setSelectedDate(date);
    setSelectedTime('');
    if (selectedMaster) {
      fetchMasterAvailability(selectedMaster.id, date);
    }
  };

  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime) {
      toast.error('Please complete all booking steps');
      return;
    }

    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast.error('Please provide your contact information');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        service_id: selectedService.id,
        master_id: selectedMaster.id,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        booking_date: selectedDate,
        booking_time: selectedTime,
        notes: customerData.notes,
        contact_preference: customerData.contact_preference
      };

      await axios.post(getApiUrl(API_ENDPOINTS.BOOKINGS), bookingData);
      toast.success('Booking confirmed! 🎉');

      setTimeout(() => {
        navigate('/thank-you', { 
          state: { 
            booking: {
              service: selectedService,
              master: selectedMaster,
              date: selectedDate,
              time: selectedTime,
              customer: customerData
            }
          }
        });
      }, 2000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getToday = (): string => new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.875rem' }}>
        Book Your Appointment
      </h1>

      {/* Mobile-first responsive layout */}
      <div className="booking-layout">
        {/* Main Booking Flow */}
        <div className="booking-main">
          {/* Step 1: Service Selection */}
          <div className="booking-card booking-step">
            <div className="step-header">
              <div className="step-number">1</div>
              <h2>Choose Your Service</h2>
            </div>
            
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                >
                  {service.image_path && (
                    <img
                      src={`http://localhost:3001${service.image_path}?v=${service.updated_at}`}
                      alt={service.name}
                      className="service-image"
                    />
                  )}
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">
                    {service.description || 'Professional service'}
                  </p>
                  <div className="service-price">
                    <span className="price">{businessSettings.currency_symbol}{service.price}</span>
                    <span className="duration">{service.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Master Selection */}
          {selectedService && (
            <div className="booking-card booking-step">
              <div className="step-header">
                <div className="step-number">2</div>
                <h2>Choose Your Master</h2>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading masters...</p>
                </div>
              ) : masters.length > 0 ? (
                <div className="masters-grid">
                  {masters.map((master) => (
                    <div
                      key={master.id}
                      onClick={() => handleMasterSelect(master)}
                      className={`master-card ${selectedMaster?.id === master.id ? 'selected' : ''} ${
                        selectedMaster && selectedMaster.id !== master.id ? 'dimmed' : ''
                      }`}
                    >
                      {master.image_path && (
                        <img
                          src={`http://localhost:3001${master.image_path}`}
                          alt={master.name}
                          className="master-image"
                        />
                      )}
                      <h3 className="master-name">{master.name}</h3>
                      <div className="master-rating">
                        <span className="rating">⭐ {master.rating}</span>
                        <span className="reviews">({master.total_reviews} reviews)</span>
                      </div>
                      {master.skills && master.skills.length > 0 && (
                        <div className="master-skills">
                          {master.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill.emoji} {skill.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No masters available for this service</p>
              )}
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {selectedMaster && (
            <div className="booking-card booking-step">
              <div className="step-header">
                <div className="step-number">3</div>
                <h2>Select Date & Time</h2>
              </div>
              
              <div className="datetime-selection">
                {/* Date Selection */}
                <div className="date-section">
                  <label className="form-label">Choose Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={getToday()}
                    className="form-input"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="time-section">
                    <label className="form-label">Available Times:</label>
                    {loading ? (
                      <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading time slots...</p>
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="time-slots-grid">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            className={`time-slot ${slot.available ? 'available' : 'busy'} ${
                              selectedTime === slot.time ? 'selected' : ''
                            }`}
                            disabled={!slot.available}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No available time slots for this date</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Customer Information */}
          {selectedTime && (
            <div className="booking-card booking-step">
              <div className="step-header">
                <div className="step-number">4</div>
                <h2>Your Contact Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="customer-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Contact Method *</label>
                  <select
                    name="contact_preference"
                    value={customerData.contact_preference}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="phone_call">📞 Phone Call</option>
                    <option value="sms">💬 SMS</option>
                    <option value="whatsapp">📱 WhatsApp</option>
                    <option value="telegram">✈️ Telegram</option>
                    <option value="viber">💜 Viber</option>
                    <option value="messenger">💬 Messenger</option>
                    <option value="gmail">📧 Gmail</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={customerData.notes}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Any special requests or notes"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg booking-submit"
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking 🎉'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar - Hidden on mobile, shown on desktop */}
        <div className="booking-sidebar">
          <div className="card booking-summary">
            <h3>Booking Summary</h3>
            
            {selectedService ? (
              <div className="summary-item">
                <div className="service-summary">
                  {selectedService.image_path && (
                    <img
                      src={`http://localhost:3001${selectedService.image_path}?v=${selectedService.updated_at}`}
                      alt={selectedService.name}
                      className="summary-image"
                    />
                  )}
                  <div className="summary-details">
                    <h4>{selectedService.name}</h4>
                    <p className="summary-description">{selectedService.description}</p>
                    <p className="summary-price">
                      {businessSettings.currency_symbol}{selectedService.price} • {selectedService.duration} min
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="summary-placeholder">
                <p>Select a service</p>
              </div>
            )}

            {selectedMaster ? (
              <div className="summary-item">
                <div className="master-summary">
                  {selectedMaster.image_path && (
                    <img
                      src={`http://localhost:3001${selectedMaster.image_path}`}
                      alt={selectedMaster.name}
                      className="summary-image master-image"
                    />
                  )}
                  <div className="summary-details">
                    <h4>{selectedMaster.name}</h4>
                    <p className="summary-rating">
                      ⭐ {selectedMaster.rating} ({selectedMaster.total_reviews} reviews)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="summary-placeholder">
                <p>Select a master</p>
              </div>
            )}

            {(selectedDate || selectedTime) && (
              <div className="summary-item">
                <h4>Appointment Details:</h4>
                {selectedDate && (
                  <p><strong>Date:</strong> {selectedDate}</p>
                )}
                {selectedTime && (
                  <p><strong>Time:</strong> {selectedTime}</p>
                )}
              </div>
            )}

            {selectedService && (
              <div className="summary-total">
                <div className="total-line">
                  <span>Total:</span>
                  <span className="total-price">
                    {businessSettings.currency_symbol}{selectedService.price}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile booking summary - shown at bottom on mobile */}
      {selectedService && (
        <div className="mobile-summary">
          <div className="mobile-summary-content">
            <div className="mobile-summary-details">
              <span className="mobile-service">{selectedService.name}</span>
              {selectedMaster && <span className="mobile-master">• {selectedMaster.name}</span>}
              {selectedDate && <span className="mobile-date">• {selectedDate}</span>}
              {selectedTime && <span className="mobile-time">• {selectedTime}</span>}
            </div>
            <div className="mobile-total">
              {businessSettings.currency_symbol}{selectedService.price}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .booking-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .booking-main {
          order: 1;
        }

        .booking-sidebar {
          order: 2;
        }

        .booking-step {
          margin-bottom: 2rem;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .service-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .service-card.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
        }

        .service-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .service-name {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .service-description {
          color: #6b7280;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .service-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          color: #059669;
          font-weight: 600;
        }

        .duration {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .masters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .master-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
        }

        .master-card.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
        }

        .master-card.dimmed {
          opacity: 0.6;
        }

        .master-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 50%;
          margin: 0 auto 0.75rem auto;
          display: block;
        }

        .master-name {
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .master-rating {
          margin-bottom: 0.75rem;
        }

        .rating {
          font-size: 1rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .reviews {
          color: #6b7280;
          margin-left: 0.5rem;
          font-size: 0.8rem;
        }

        .master-skills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .skill-tag {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 8px;
          font-size: 0.7rem;
          color: #374151;
        }

        .datetime-selection {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .loading-state {
          text-align: center;
          padding: 2rem;
        }

        .no-data {
          text-align: center;
          color: #6b7280;
          padding: 2rem;
        }

        .customer-form {
          display: grid;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .booking-submit {
          width: 100%;
          margin-top: 1rem;
        }

        .booking-summary {
          position: sticky;
          top: 2rem;
        }

        .summary-item {
          margin-bottom: 1.5rem;
        }

        .service-summary,
        .master-summary {
          display: flex;
          gap: 0.75rem;
        }

        .summary-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .summary-image.master-image {
          border-radius: 50%;
        }

        .summary-details {
          flex: 1;
        }

        .summary-details h4 {
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }

        .summary-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .summary-price,
        .summary-rating {
          color: #059669;
          font-weight: 600;
        }

        .summary-placeholder {
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 8px;
          text-align: center;
        }

        .summary-placeholder p {
          margin: 0;
          color: #6b7280;
        }

        .summary-total {
          border-top: 2px solid #e5e7eb;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }

        .total-price {
          font-weight: 700;
          color: #059669;
          font-size: 1.1rem;
        }

        .mobile-summary {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 1rem;
          box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
          z-index: 50;
        }

        .mobile-summary-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mobile-summary-details {
          flex: 1;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .mobile-summary-details span {
          margin-right: 0.5rem;
        }

        .mobile-total {
          font-weight: 700;
          color: #059669;
          font-size: 1.1rem;
        }

        /* Desktop styles */
        @media (min-width: 768px) {
          .booking-layout {
            grid-template-columns: 2fr 1fr;
          }

          .booking-main {
            order: 1;
          }

          .booking-sidebar {
            order: 2;
          }

          .datetime-selection {
            grid-template-columns: 1fr 2fr;
          }

          .form-row {
            grid-template-columns: 1fr 1fr;
          }

          .mobile-summary {
            display: none;
          }
        }

        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .booking-sidebar {
            display: none;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .masters-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          body {
            padding-bottom: 80px; /* Space for mobile summary */
          }
        }
      `}</style>
    </div>
  );
};

