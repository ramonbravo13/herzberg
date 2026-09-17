import React from 'react';
import { MessageSquare, Heart, CheckCircle2, FileText, Map, LayoutDashboard, History, Target } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <MessageSquare size={24} />,
      title: "Encuestas conversacionales",
      desc: "Evaluaciones mediante chat interactivo."
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Clima laboral",
      desc: "Obtén una visión general de la percepción de tu equipo."
    },
    {
      icon: <Heart size={24} />,
      title: "Herzberg",
      desc: "Analiza motivadores y factores de higiene."
    },
    {
      icon: <FileText size={24} />,
      title: "NOM-035",
      desc: "Organiza y visualiza resultados relacionados con factores de riesgo psicosocial."
    },
    {
      icon: <Map size={24} />,
      title: "Zonas",
      desc: "Segmenta resultados por áreas, departamentos o sucursales."
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: "Dashboard",
      desc: "Visualiza métricas y resultados en un solo lugar."
    },
    {
      icon: <History size={24} />,
      title: "Periodos",
      desc: "Conserva y consulta evaluaciones históricas."
    },
    {
      icon: <Target size={24} />,
      title: "Participación",
      desc: "Define metas y observa el avance de la evaluación."
    }
  ];

  return (
    <section id="funcionalidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Todo lo que necesitas en una plataforma</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors group">
              <div className="text-slate-400 group-hover:text-teal-600 mb-4 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
