import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { AppDataProvider } from './context/AppDataContext';

// Core Pages
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Transport Pages
import TransportListPage from './pages/transport/TransportListPage';
import TransportDetailPage from './pages/transport/TransportDetailPage';
import TransportTrackPage from './pages/transport/TransportTrackPage';

// Graduation & Research Hub Page
import GraduationHubPage from './pages/graduation/GraduationHubPage';

// Materials & Printing Pages (استنساخ وتقارير - بدون خانة الملازم)
import MaterialsPage from './pages/materials/MaterialsPage';
import CartPage from './pages/materials/CartPage';

// Tools Pages
import PastExamsPage from './pages/tools/PastExamsPage';
import GPACalculatorPage from './pages/tools/GPACalculatorPage';
import StudentJobsPage from './pages/tools/StudentJobsPage';
import StudentDiscountsPage from './pages/tools/StudentDiscountsPage';

export default function App() {
  return (
    <AppProvider>
      <AppDataProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Dashboard & Profile */}
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Campus Transport Lines */}
              <Route path="/transport" element={<TransportListPage />} />
              <Route path="/transport/:id" element={<TransportDetailPage />} />
              <Route path="/transport/track/:id" element={<TransportTrackPage />} />

              {/* Graduation & Research Hub */}
              <Route path="/graduation" element={<GraduationHubPage />} />

              {/* Printing & Reports (استنساخ وتقارير) */}
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Smart Student Utilities */}
              <Route path="/exams" element={<PastExamsPage />} />
              <Route path="/gpa" element={<GPACalculatorPage />} />
              <Route path="/jobs" element={<StudentJobsPage />} />
              <Route path="/discounts" element={<StudentDiscountsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AppDataProvider>
    </AppProvider>
  );
}
