import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Portals
import LandingPage from './pages/public/LandingPage';
import EvaluationPortal from './pages/public/EvaluationPortal';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ForceChangePassword from './pages/auth/ForceChangePassword';
import SubscriptionExpired from './pages/public/SubscriptionExpired';

// Admin
import AdminLayout from './layouts/AdminLayout';
import OrganizationsManager from './pages/admin/OrganizationsManager';
import UsersManager from './pages/admin/UsersManager';

// Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/evaluate/:token" element={<EvaluationPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ForceChangePassword />} />
          <Route path="/expired" element={<SubscriptionExpired />} />

          {/* Portal Privado (Dashboard) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
          </Route>

          {/* Panel Administrativo */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/organizations" replace />} />
            <Route path="organizations" element={<OrganizationsManager />} />
            <Route path="users" element={<UsersManager />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
                <p className="text-slate-600 mb-4">Página no encontrada</p>
                <button onClick={() => window.history.back()} className="text-primary hover:underline">
                  Volver
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
