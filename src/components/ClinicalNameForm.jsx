import React, { useState } from 'react';
import { Stethoscope, AlertTriangle } from 'lucide-react';

export default function ClinicalNameForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Stethoscope size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Información Requerida por la NOM-035</h2>
        
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-sm text-orange-800 mb-6 flex gap-3">
          <AlertTriangle className="shrink-0 text-orange-600" size={20} />
          <p>
            De acuerdo a tus respuestas sobre eventos difíciles en el entorno de trabajo, la normativa federal (NOM-035-STPS) establece que <strong>tu centro de trabajo debe brindarte apoyo y canalización médica o psicológica gratuita.</strong>
          </p>
        </div>

        <p className="text-slate-600 text-sm mb-6 text-center">
          Para que Recursos Humanos pueda dar seguimiento estrictamente confidencial a tu caso, por favor proporciona tu nombre completo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Ej. Juan Pérez García"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? 'Guardando...' : 'Enviar y Finalizar'}
            </button>
          </div>
        </form>
        
        <p className="text-xs text-slate-400 text-center mt-6">
          Si decides cancelar, tus respuestas de esta sesión no serán guardadas para proteger el proceso.
        </p>
      </div>
    </div>
  );
}
