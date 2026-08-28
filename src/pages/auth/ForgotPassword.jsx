import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { dbService } from '../../services/db';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [simulatedLink, setSimulatedLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const token = await dbService.generatePasswordResetToken(email.trim());
      setStatus('success');
      // En un sistema real esto se enviaría por correo. Aquí lo mostramos para efectos de demostración.
      const resetUrl = `${window.location.origin}/reset-password/${token}`;
      setSimulatedLink(resetUrl);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 relative">
        <button
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Recuperar Contraseña</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 text-center">
            {message}
          </div>
        )}

        {status === 'success' ? (
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">¡Correo enviado!</h2>
            <p className="text-slate-600 text-sm mb-6">
              Revisa tu bandeja de entrada. Por ser una versión de prueba, aquí tienes el enlace generado:
            </p>
            <div className="p-3 bg-slate-100 rounded-xl break-all text-xs text-slate-700 mb-6 border border-slate-200">
              <Link to={simulatedLink.replace(window.location.origin, '')} className="text-indigo-600 hover:underline">
                {simulatedLink}
              </Link>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all"
            >
              Volver al Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="ejemplo@empresa.com"
                disabled={status === 'loading'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {status === 'loading' ? 'Procesando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
