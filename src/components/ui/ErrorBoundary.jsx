import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó un error en un gráfico:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-100 rounded-2xl w-full h-full min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
             <AlertTriangle className="text-red-500" size={24} />
          </div>
          <h3 className="text-red-800 font-bold mb-1">Error al cargar este componente</h3>
          <p className="text-red-600/90 text-sm text-center max-w-xs">Un error inesperado impidió procesar los datos de este gráfico. El resto del dashboard sigue activo.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
