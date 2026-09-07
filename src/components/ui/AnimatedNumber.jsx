import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedNumber({ value, duration = 1.5, format = (v) => Math.round(v) }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        setCurrentValue(v);
      }
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{format(currentValue)}</span>;
}
