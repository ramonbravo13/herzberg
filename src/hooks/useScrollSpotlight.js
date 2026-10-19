import { useEffect, useRef, useState, useCallback } from 'react';
import { useSpotlight } from '../contexts/SpotlightContext';

// Singleton compartido de IntersectionObserver para máximo rendimiento y mínimo consumo de memoria
let sharedObserver = null;
const targetListeners = new Map();

function getSharedObserver() {
  if (typeof window === 'undefined') return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const listener = targetListeners.get(entry.target);
          if (listener) {
            listener(entry.isIntersecting, entry);
          }
        });
      },
      {
        root: null, // Viewport del navegador
        // Franja central: margen superior -12% (bajo el header sticky) e inferior -16%
        rootMargin: '-12% 0px -16% 0px',
        threshold: 0, // Se activa en cuanto entra a la franja de lectura central
      }
    );
  }
  return sharedObserver;
}

/**
 * Hook para efecto "Focus on Scroll" (Spotlight).
 * Detecta si el elemento está en la franja central del viewport
 * utilizando un IntersectionObserver compartido.
 */
export function useScrollSpotlight() {
  const elementRef = useRef(null);
  const [isInViewportCenter, setIsInViewportCenter] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { spotlightEnabled } = useSpotlight();

  // Función de actualización memorizada para el listener del observer
  const handleIntersection = useCallback((isIntersecting) => {
    setIsInViewportCenter(isIntersecting);
  }, []);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof window === 'undefined') return;

    // Comprobación inicial síncrona para evitar saltos visuales (jank / flash)
    try {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const topBoundary = vh * 0.12;
      const bottomBoundary = vh * 0.84;
      const initiallyInBand = rect.bottom > topBoundary && rect.top < bottomBoundary;
      setIsInViewportCenter(initiallyInBand);
    } catch {
      // Fallback seguro
    }

    const observer = getSharedObserver();
    if (!observer) return;

    targetListeners.set(node, handleIntersection);
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      targetListeners.delete(node);
    };
  }, [handleIntersection]);

  // Si el modo spotlight está deshabilitado por el usuario, el elemento está centrado,
  // o el usuario coloca el cursor encima (hover), se muestra al 100%
  const isFocused = !spotlightEnabled || isInViewportCenter || isHovered;

  return {
    ref: elementRef,
    isFocused,
    spotlightEnabled,
    setIsHovered,
    isHovered,
  };
}
