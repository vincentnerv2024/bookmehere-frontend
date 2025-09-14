import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Service, Master, CustomerData } from '../types';

interface BookingData {
  service: Service;
  master: Master;
  date: string;
  time: string;
  customer: CustomerData;
}

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as BookingData;

  const handleGoHome = (): void => {
    navigate('/');
  };

  const handleBookAnother = (): void => {
    navigate('/booking');
  };

  if (!booking) {
    return (
      <div className="container">
        <div className="error-state">
          <h1>Oops!</h1>
          <p>No booking information found.</p>
          <button onClick={handleGoHome} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const getContactMethodDisplay = (preference: string): string => {
    const methods: Record<string, string> = {
      'phone_call': '📞 Phone Call',
      'sms': '💬 SMS',
      'whatsapp': '📱 WhatsApp',
      'telegram': '✈️ Telegram',
      'viber': '💜 Viber',
      'messenger': '💬 Messenger',
      'gmail': '📧 Gmail'
    };
    return methods[preference] || preference;
  };

  return (
    <div className="container">
      <div className="thank-you-container">
        <div className="thank-you-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          <h1 className="thank-you-title">Thank You!</h1>
          <p className="thank-you-subtitle">
            Your booking has been confirmed. We'll contact you soon to finalize the details.
          </p>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            
            <div className="summary-item">
              <div className="summary-label">Service:</div>
              <div className="summary-value">{booking.service.name}</div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Master:</div>
              <div className="summary-value">{booking.master.name}</div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Date:</div>
              <div className="summary-value">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Time:</div>
              <div className="summary-value">{booking.time}</div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Contact Method:</div>
              <div className="summary-value">
                {getContactMethodDisplay(booking.customer.contact_preference)}
              </div>
            </div>

            {booking.customer.notes && (
              <div className="summary-item">
                <div className="summary-label">Notes:</div>
                <div className="summary-value">{booking.customer.notes}</div>
              </div>
            )}
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>We'll contact you via your preferred method to confirm the appointment</li>
              <li>You'll receive a reminder 24 hours before your appointment</li>
              <li>If you need to make changes, please contact us directly</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button onClick={handleBookAnother} className="btn btn-secondary">
              Book Another Service
            </button>
            <button onClick={handleGoHome} className="btn btn-primary">
              Go Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .thank-you-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .thank-you-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .success-icon {
          margin-bottom: 2rem;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 2.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: checkmarkAnimation 0.6s ease-in-out;
        }

        @keyframes checkmarkAnimation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .thank-you-title {
          color: #1f2937;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .thank-you-subtitle {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .booking-summary {
          background: #f9fafb;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .booking-summary h3 {
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.25rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-weight: 600;
          color: #374151;
        }

        .summary-value {
          color: #6b7280;
          text-align: right;
        }

        .next-steps {
          background: #eff6ff;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .next-steps h3 {
          color: #1e40af;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1.25rem;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .next-steps li {
          color: #1e40af;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .next-steps li:before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .error-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error-state h1 {
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .error-state p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .thank-you-container {
            padding: 1rem;
          }

          .thank-you-card {
            padding: 2rem;
          }

          .thank-you-title {
            font-size: 2rem;
          }

          .checkmark {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .summary-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .summary-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};
