import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { ProviderDetailsPage } from './pages/ProviderDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Scroll to top automatically when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// 404 Not Found component
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-extrabold text-2xl mb-4">
      404
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
    <p className="text-slate-500 text-sm mb-6 max-w-sm">
      The page you're searching for does not exist or has been relocated.
    </p>
    <Link
      to="/"
      className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
    >
      Return to Home
    </Link>
  </div>
);

export const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <ScrollToTop />

      {/* Render Navbar on all pages except dedicated full-screen Admin Portal */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Area */}
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/providers/:id" element={<ProviderDetailsPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book/:providerId" element={<BookingPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Render Footer on public/user pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
