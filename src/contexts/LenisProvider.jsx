import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Lenis from 'lenis';

import LenisContext from './LenisContext';

export const LenisProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  const startLenis = useCallback(() => {
    lenis?.start();
  }, [lenis]);

  const stopLenis = useCallback(() => {
    lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const handleClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Allow external links or non-anchor links
      if (href === '#' || href.startsWith('#') === false) return;

      lenis.scrollTo(href, {
        offset: 0, // Optional offset
        duration: 1.5, // Optional duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optional easing
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [lenis]);

  useEffect(() => {
    const newLenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(newLenis);

    function raf(time) {
      newLenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      newLenis.destroy();
      setLenis(null);
    };
  }, []);

  const contextValue = useMemo(() => ({
    lenis,
    start: startLenis,
    stop: stopLenis,
  }), [lenis, startLenis, stopLenis]);

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
};