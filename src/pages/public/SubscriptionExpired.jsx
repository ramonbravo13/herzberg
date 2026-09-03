import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function SubscriptionExpired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden text-center p-8 animate-fade-in">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Suscripción Expirada</h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Contacta con tu proveedor del servicio para reactivar tu plataforma de análisis de clima laboral IA.
        </p>

        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
