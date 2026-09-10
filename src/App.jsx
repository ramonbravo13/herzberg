import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Portals (Keep these eager for fast initial load)
import LandingPage from './pages/public/LandingPage';
import EvaluationPortal from './pages/public/EvaluationPortal';
import Login from './pages/auth/Login';
import SubscriptionExpired from './pages/public/SubscriptionExpired';

// Auth (Lazy)
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const ForceChangePassword = React.lazy(() => import('./pages/auth/ForceChangePassword'));

// Admin (Lazy)
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const OrganizationsManager = React.lazy(() => import('./pages/admin/OrganizationsManager'));
const UsersManager = React.lazy(() => import('./pages/admin/UsersManager'));

// Dashboard (Lazy - heaviest)
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const DashboardOverview = React.lazy(() => import('./pages/dashboard/DashboardOverview'));

function FallbackLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<FallbackLoader />}>
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
