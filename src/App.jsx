import React, { useState } from 'react';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';

const generateMockData = (count) => {
  const deptos = ["Ventas", "IT", "Recursos Humanos", "Operaciones", "Marketing"];
  const antiguedades = ["Menos de 1 año", "1–3 años", "4–7 años", "8–15 años", "Más de 15 años"];
  const niveles = ["Operativo", "Técnico", "Administrativo", "Coordinación", "Directivo"];
  const fortalezas = [
    "El buen ambiente de trabajo y los compañeros",
    "La flexibilidad de horario",
    "El trabajo en equipo",
    "Los retos constantes",
    "El liderazgo de mi jefe"
  ];
  const mejoras = [
    "Mejorar los salarios",
    "Más oportunidades de crecimiento y promociones",
    "Mejorar las instalaciones",
    "Más comunicación entre áreas",
    "Reducir la carga laboral en temporada alta"
  ];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomScore = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const data = [];
  for(let i=0; i<count; i++) {
    data.push({
      departamento: randomItem(deptos),
      antiguedad: randomItem(antiguedades),
      nivel_puesto: randomItem(niveles),
      respuestas: {
        logro_1: randomScore(3, 5), logro_2: randomScore(3, 5), logro_3: randomScore(2, 5),
        reconocimiento_1: randomScore(2, 4), reconocimiento_2: randomScore(3, 5), reconocimiento_3: randomScore(1, 4),
        trabajo_1: randomScore(3, 5), trabajo_2: randomScore(4, 5), trabajo_3: randomScore(3, 5),
        responsabilidad_1: randomScore(2, 5), responsabilidad_2: randomScore(3, 5), responsabilidad_3: randomScore(2, 4),
        crecimiento_1: randomScore(2, 4), crecimiento_2: randomScore(3, 5), crecimiento_3: randomScore(2, 5),
        promocion_1: randomScore(1, 3), promocion_2: randomScore(1, 4), promocion_3: randomScore(2, 4),
        salario_1: randomScore(2, 4), salario_2: randomScore(2, 4), salario_3: randomScore(1, 4),
        supervision_1: randomScore(3, 5), supervision_2: randomScore(3, 5), supervision_3: randomScore(3, 5),
        politicas_1: randomScore(2, 4), politicas_2: randomScore(2, 5), politicas_3: randomScore(2, 4),
        relaciones_1: randomScore(4, 5), relaciones_2: randomScore(4, 5), relaciones_3: randomScore(3, 5),
        condiciones_1: randomScore(3, 5), condiciones_2: randomScore(3, 5), condiciones_3: randomScore(2, 5),
        seguridad_1: randomScore(3, 5), seguridad_2: randomScore(3, 5), seguridad_3: randomScore(2, 5),
        satisfaccion_global: randomScore(3, 5),
        compromiso: randomScore(4, 5),
        permanencia: randomScore(3, 5),
        enps: randomScore(6, 10)
      },
      comentarios: {
        fortaleza: randomItem(fortalezas),
        mejora: randomItem(mejoras)
      }
    });
  }
  return data;
};

function App() {
  const [started, setStarted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [apiKeyError, setApiKeyError] = useState(false);

  const startEvaluation = () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setApiKeyError(true);
      return;
    }
    setStarted(true);
  };

  const handleComplete = (data) => {
    setResultData(data);
  };

  if (resultData) {
    return <Dashboard data={resultData} />;
  }

  if (started) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 h-screen">
        <Chat onComplete={handleComplete} />
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
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Evaluación de Satisfacción Laboral</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Bienvenido a la entrevista conversacional basada en la teoría de los dos factores de Herzberg. 
            Esta evaluación toma aproximadamente 10 minutos y es confidencial.
          </p>
          
          {apiKeyError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm text-left border border-red-100">
              <strong className="block font-semibold mb-1">Falta la API Key</strong>
              No se encontró VITE_GEMINI_API_KEY en las variables de entorno. Por favor, configura tu archivo .env y reinicia el servidor.
            </div>
          )}

          <button 
            onClick={startEvaluation}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Comenzar Evaluación
          </button>
          
          <button 
            onClick={() => handleComplete(generateMockData(50))}
            className="w-full mt-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            Probar Dashboard (50 Personas Ficticias)
          </button>
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-center text-slate-500">
          Tus respuestas serán analizadas de manera agregada para mejorar la experiencia del empleado.
        </div>
      </div>
    </div>
  );
}

export default App;
