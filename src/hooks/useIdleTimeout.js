import { useEffect, useRef } from 'react';

export const useIdleTimeout = (onTimeout, delay = 60000) => {
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onTimeout, delay);
  };

  useEffect(() => {
    // Events that reset the idle timer
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];

    resetTimeout();

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [onTimeout, delay]);

  return resetTimeout;
};
