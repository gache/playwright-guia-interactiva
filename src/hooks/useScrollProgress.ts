import { useEffect, useState } from 'react';

export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const total = document.body.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return pct;
}
