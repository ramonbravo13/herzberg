import React from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BarChart3, User } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || (user.role !== 'empresarial' && user.role !== 'corporativo' && user.role !== 'admin')) {
    return <div className="p-8 text-center text-red-500 font-bold">Acceso Denegado.</div>;
  }

  if (user.requiresPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800">
                Dashboard {user.role === 'corporativo' && 'Corporativo'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <User size={16} />
                {user.name || user.email}
              </div>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-lg transition-colors border border-indigo-100"
                >
                  Volver al Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
