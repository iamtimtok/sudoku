import { useState, useEffect } from 'react';

function useWindowInnderDemention() {
  // Initialize state with undefined to avoid SSR mismatches
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);

  useEffect(() => {
    // Return early if window is not defined (e.g., during SSR)
    if (typeof window === 'undefined') return;

    const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    // Add event listener on mount
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount to prevent memory leaks
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, height };
}

export default useWindowInnderDemention;