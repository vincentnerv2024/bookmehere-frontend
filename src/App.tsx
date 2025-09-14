import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingPage } from './pages/BookingPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { UserLoginPage } from './pages/UserLoginPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Header />

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/:serviceId" element={<BookingPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/login" element={<UserLoginPage />} />

            {/* User dashboard for customers */}
            <Route path="/dashboard" element={<UserDashboardPage />} />

            {/* Admin dashboard for managing bookings */}
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

            {/* Business dashboard for admins */}
            <Route path="/business" element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

