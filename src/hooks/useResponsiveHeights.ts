
import { useState, useEffect, useRef } from 'react';

export const useResponsiveHeights = (calculationPerformed: boolean) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryHeight, setSummaryHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const resizeTimeoutRef = useRef<number | null>(null);
  const previousHeightRef = useRef<number | null>(null);

  // Effect to measure and set the summary height with improved debouncing
  useEffect(() => {
    if (!calculationPerformed || !summaryRef.current) return;
    
    const updateHeight = () => {
      if (summaryRef.current) {
        setIsResizing(true);
        
        // Clear any existing timeout
        if (resizeTimeoutRef.current) {
          window.clearTimeout(resizeTimeoutRef.current);
        }
        
        // Set a timeout to avoid rapid updates
        resizeTimeoutRef.current = window.setTimeout(() => {
          const height = summaryRef.current?.offsetHeight || 400;
          
          // Only update if height has changed significantly (more than 10px)
          // This helps break potential feedback loops
          if (previousHeightRef.current === null || 
              Math.abs(previousHeightRef.current - height) > 10) {
            previousHeightRef.current = height;
            setSummaryHeight(height);
          }
          
          setIsResizing(false);
          resizeTimeoutRef.current = null;
        }, 250); // Longer timeout for more stability
      }
    };

    // Initial measurement
    updateHeight();
    
    // Setup resize observer for dynamic height changes
    const resizeObserver = new ResizeObserver(() => {
      if (!isResizing) {
        updateHeight();
      }
    });
    
    resizeObserver.observe(summaryRef.current);
    
    // Window resize handler
    const handleResize = () => {
      if (!isResizing) {
        updateHeight();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (summaryRef.current) {
        resizeObserver.unobserve(summaryRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      // Clear timeout if component unmounts
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculationPerformed, isResizing]);

  return { summaryRef, summaryHeight };
};
