import { useEffect, useRef, useState } from 'react';

export function useScrollRestoration(key: string) {
  const [isRestoring, setIsRestoring] = useState(true);
  const scrollPositionRef = useRef<number>(0);
  const attemptRef = useRef(0);
  const maxAttempts = 5;

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll_${key}`);
    
    if (savedPosition) {
      const targetScroll = parseInt(savedPosition);
      
      const restoreScroll = () => {
        if (attemptRef.current >= maxAttempts) {
          setIsRestoring(false);
          return;
        }

        // Use RAF to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, targetScroll);
          
          // Check if we reached the target position
          if (Math.abs(window.scrollY - targetScroll) > 10 && attemptRef.current < maxAttempts) {
            attemptRef.current++;
            // Try again in 100ms
            setTimeout(restoreScroll, 100);
          } else {
            setIsRestoring(false);
          }
        });
      };

      // Initial delay to allow content to render
      setTimeout(restoreScroll, 100);
      
      // Cleanup stored position
      sessionStorage.removeItem(`scroll_${key}`);
    } else {
      setIsRestoring(false);
    }

    const handleBeforeUnload = () => {
      scrollPositionRef.current = window.scrollY;
      sessionStorage.setItem(`scroll_${key}`, scrollPositionRef.current.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key]);

  return { isRestoring };
} 