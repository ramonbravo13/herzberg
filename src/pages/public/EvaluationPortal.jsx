import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import Chat from '../../components/Chat';

export default function EvaluationPortal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const org = await dbService.getOrganizationByToken(token);
        if (org) {
          setOrganization(org);
        } else {
          setError('Enlace de evaluación inválido o expirado.');
        }
      } catch (err) {
        setError('Error al cargar la evaluación.');
      }
    };
    if (token) {
      fetchOrg();
    }
  }, [token]);

  const handleComplete = async (results) => {
    try {
      await dbService.saveEvaluation(organization.id, results);
      setCompleted(true);
    } catch (err) {
      console.error("Error guardando evaluación:", err);
      alert("Hubo un error al guardar tus respuestas. Por favor, contacta a soporte.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Error</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Cargando...</div>;
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-green-100">
          <div className="text-green-500 mb-4 text-4xl">✅</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">¡Gracias por tu participación!</h1>
          <p className="text-slate-600">
            Tus respuestas han sido registradas de forma confidencial para <strong>{organization.name}</strong>.
            Puedes cerrar esta ventana.
          </p>
        </div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 h-screen">
        <Chat onComplete={handleComplete} onExit={() => setStarted(false)} organizationName={organization.name} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Evaluación de Satisfacción Laboral</h1>
          <h2 className="text-lg font-medium text-primary mb-6">{organization.name}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Bienvenido a la entrevista conversacional basada en la teoría de los dos factores de Herzberg. 
            Esta evaluación toma aproximadamente 10 minutos y es estrictamente confidencial.
          </p>
          
          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Comenzar Evaluación
          </button>
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-center text-slate-500">
          Tus respuestas serán analizadas de manera agregada para mejorar la experiencia del empleado en {organization.name}.
        </div>
      </div>
    </div>
  );
}
