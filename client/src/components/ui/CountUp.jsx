import { useState, useEffect, useRef } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const CountUp = ({ start = 0, end, duration = 2, decimals = 0, suffix = '' }) => {
  const [value, setValue] = useState(start);
  const rafRef = useRef();

  useEffect(() => {
    const from = Number(start);
    const to = Number(end);
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      const eased = easeOutCubic(progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, end, duration]);

  return <>{value.toFixed(decimals)}{suffix}</>;
};

export default CountUp;
