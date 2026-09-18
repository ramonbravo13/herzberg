import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Bot, LogOut } from 'lucide-react';
import { startInterviewChat, sendMessageToBot } from '../gemini';

const MANDATORY_VARS = [
  "logro_1", "logro_2", "logro_3", 
  "reconocimiento_1", "reconocimiento_2", "reconocimiento_3",
  "trabajo_1", "trabajo_2", "trabajo_3",
  "responsabilidad_1", "responsabilidad_2", "responsabilidad_3",
  "crecimiento_1", "crecimiento_2", "crecimiento_3",
  "promocion_1", "promocion_2", "promocion_3",
  "salario_1", "salario_2", "salario_3",
  "supervision_1", "supervision_2", "supervision_3",
  "politicas_1", "politicas_2", "politicas_3",
  "relaciones_1", "relaciones_2", "relaciones_3",
  "condiciones_1", "condiciones_2", "condiciones_3",
  "seguridad_1", "seguridad_2", "seguridad_3",
  "satisfaccion_global", "compromiso", "permanencia", "enps"
];

export default function Chat({ onComplete, onExit, organizationName, expectedHeadcount = 1 }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExit = () => {
    if (window.confirm("¿Estás seguro de que deseas salir? Como no se ha completado la totalidad de las preguntas, no se guardarán tus respuestas.")) {
      if (onExit) onExit();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    // Start chat on mount
    const initChat = async () => {
      setLoading(true);
      try {
        const text = await startInterviewChat(organizationName, expectedHeadcount);
        setMessages([{ role: 'model', text }]);
      } catch (err) {
        setError(err.message || "Error al iniciar el chat");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    setError(null);

    let currentMessages = [...messages, { role: 'user', text: userText }];
    let retryCount = 0;
    const maxRetries = 2;
    let lastUserText = userText;

    while (retryCount <= maxRetries) {
      try {
        const responseText = await sendMessageToBot(lastUserText, currentMessages.slice(0, -1), organizationName, expectedHeadcount);
        
        // Check if response might be a JSON
        if (responseText.includes('{') && responseText.includes('}')) {
          try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              
              if (parsed.respuestas || parsed.diagnostico) {
                // It's trying to be the final JSON. Validate schema.
                const missingVars = MANDATORY_VARS.filter(v => parsed.respuestas && parsed.respuestas[v] === undefined);
                
                if (missingVars.length === 0 && parsed.diagnostico) {
                  onComplete(parsed);
                  return; // Success!
                } else {
                  // Incomplete JSON
                  if (retryCount < maxRetries) {
                     console.warn(`JSON incompleto detectado. Reintentando (${retryCount + 1}/${maxRetries}). Faltan:`, missingVars);
                     lastUserText = `SISTEMA INTERNO: Error de formato. El JSON generado está incompleto. Faltan las siguientes variables en 'respuestas': ${missingVars.join(', ')}. Vuelve a generar ÚNICAMENTE el objeto JSON en crudo con TODAS las variables obligatorias y con el formato estricto solicitado.`;
                     currentMessages = [...currentMessages, { role: 'model', text: responseText }, { role: 'user', text: lastUserText }];
                     retryCount++;
                     continue;
                  }
                }
              }
            }
          } catch (e) {
             // Invalid JSON format
             if (retryCount < maxRetries && (responseText.includes('"logro_1"') || responseText.includes('"diagnostico"'))) {
                console.warn(`JSON inválido detectado. Reintentando (${retryCount + 1}/${maxRetries}). Error:`, e.message);
                lastUserText = `SISTEMA INTERNO: Error de formato. El JSON generado es inválido (Error de parseo). Genera de nuevo ÚNICAMENTE el objeto JSON en crudo, sin texto adicional ni bloques markdown de código.`;
                currentMessages = [...currentMessages, { role: 'model', text: responseText }, { role: 'user', text: lastUserText }];
                retryCount++;
                continue;
             }
          }
        }

        // If it's a normal conversational message, show it and exit loop
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        break;

      } catch (err) {
        console.error(err);
        setError("Hubo un problema de conexión con la IA. Por favor, intenta de nuevo.");
        break; // Stop retries on network error
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-surface rounded-xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight">Asistente Herzberg</h2>
            <p className="text-sm text-primary-100 opacity-90">Evaluación de Experiencia del Empleado</p>
          </div>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
          title="Salir"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm text-center border-b border-red-100">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-sm shadow-sm' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-slate prose-sm max-w-none">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-[15px]">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm">
              <Loader2 className="animate-spin text-primary" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input 
            ref={inputRef}
            autoFocus
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 text-white bg-primary rounded-full hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
