import { useEffect, useRef, useState } from 'react';

// Helper to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

export function useScrollRestoration(key: string) {
  const [isRestoring, setIsRestoring] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const attemptRef = useRef(0);
  const maxAttempts = 5;

  useEffect(() => {
    // Only run in browser environment
    if (!isBrowser()) return;
    
    setIsRestoring(true);
    
    try {
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
        
        // Don't remove the stored position until we've successfully restored
        // This ensures we can try again if the page refreshes before restoration completes
        if (Math.abs(window.scrollY - targetScroll) <= 10) {
          sessionStorage.removeItem(`scroll_${key}`);
        }
      } else {
        setIsRestoring(false);
      }

      // Save scroll position before page unload or navigation
      const handleBeforeUnload = () => {
        scrollPositionRef.current = window.scrollY;
        try {
          if (scrollPositionRef.current > 0) {
            sessionStorage.setItem(`scroll_${key}`, scrollPositionRef.current.toString());
          }
        } catch (error) {
          console.error('Failed to save scroll position:', error);
        }
      };

      // Save scroll position when user navigates away
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          handleBeforeUnload();
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } catch (error) {
      console.error('Error in scroll restoration:', error);
      setIsRestoring(false);
      return () => {};
    }
  }, [key]);

  return { isRestoring };
} 