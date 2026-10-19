import React from 'react';
import { useScrollSpotlight } from '../../hooks/useScrollSpotlight';

/**
 * SpotlightBlock
 * Contenedor visual con efecto "Focus on Scroll" optimizado con IntersectionObserver.
 * Atenúa tarjetas secundarias al 30% con un ligero desenfoque (blur de 1.5px) y
 * activa con transición suave de 0.4s la sección en foco central del viewport.
 */
export default function SpotlightBlock({
  children,
  className = '',
  style = {},
  unfocusOpacity = 0.3,
  unfocusBlur = '1.5px',
  unfocusScale = 0.985,
  focusScale = 1,
  transitionDuration = '0.4s',
  id,
}) {
  const { ref, isFocused, spotlightEnabled, setIsHovered } = useScrollSpotlight();

  return (
    <div
      ref={ref}
      id={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isFocused ? 1 : unfocusOpacity,
        filter: isFocused ? 'blur(0px)' : `blur(${unfocusBlur})`,
        transform: isFocused ? `scale(${focusScale})` : `scale(${unfocusScale})`,
        transition: `opacity ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1), filter ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1), transform ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: spotlightEnabled ? 'opacity, filter, transform' : 'auto',
        ...style,
      }}
      className={`spotlight-block relative ${className}`}
    >
      {children}
    </div>
  );
}
