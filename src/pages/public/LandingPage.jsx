import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Brain, BarChart3, Shield, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Herzberg AI
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLoginClick}
                className="group relative px-6 py-2.5 font-semibold text-white rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:shadow-xl flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">{user ? 'Ir al Dashboard' : 'Ingresar'}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Decorative background blobs */}
          <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-fuchsia-400 rounded-full animate-[spin_20s_linear_infinite]" style={{ animationDuration: '30s' }}></div>
          </div>
          
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              Plataforma Inteligente de Evaluación
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
              Mide el Clima Laboral con <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Inteligencia Artificial</span>
            </h1>
            
            <p className="mt-4 text-xl sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Descubre de forma automatizada y precisa qué motiva a tus colaboradores aplicando la teoría de Herzberg potenciada por Gemini.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoginClick}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
              >
                Acceso Corporativo
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">¿Por qué usar Herzberg AI?</h2>
            <p className="mt-4 text-lg text-slate-500">Nuestra plataforma lleva las encuestas tradicionales al siguiente nivel.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Entrevistas con IA</h3>
              <p className="text-slate-600 leading-relaxed">
                Un chatbot inteligente conversa con el trabajador, simulando una entrevista humana empática y extrayendo los factores clave de motivación.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Analítica en Tiempo Real</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualiza los resultados en potentes dashboards organizacionales. Compara los factores de higiene vs factores motivacionales instantáneamente.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Privado y Seguro</h3>
              <p className="text-slate-600 leading-relaxed">
                El acceso corporativo y empresarial está estrictamente delimitado para proteger la confidencialidad de la información de tu organización.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain size={24} className="text-indigo-500" />
            <span className="font-bold text-xl text-white">Herzberg AI</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Plataforma de Evaluación Organizacional. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
