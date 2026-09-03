import React, { useMemo } from 'react';

export default function AmbientPetals({ count = 22 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${7 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 5}s`,
      drift: `${(Math.random() - 0.5) * 160}px`,
      size: `${12 + Math.random() * 12}px`,
      opacity: 0.25 + Math.random() * 0.35,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, [count]);

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="floating-petal"
          style={{
            left: p.left,
            width: p.size,
            height: `calc(${p.size} * 1.4)`,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            '--petal-drift': p.drift,
            opacity: p.opacity,
            transform: `rotate(${p.rotation})`,
          }}
        />
      ))}
    </div>
  );
}
