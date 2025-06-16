
import { useState, useEffect, useRef } from 'react';

export const useResponsiveHeights = (calculationPerformed: boolean) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryHeight, setSummaryHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const resizeTimeoutRef = useRef<number | null>(null);
  const previousHeightRef = useRef<number | null>(null);

  // Effect to measure and set the summary height with step-specific stabilization
  useEffect(() => {
    if (!calculationPerformed || !summaryRef.current) return;
    
    const updateHeight = () => {
      if (summaryRef.current && !isUpdating) {
        setIsResizing(true);
        setIsUpdating(true);
        
        // Clear any existing timeout
        if (resizeTimeoutRef.current) {
          window.clearTimeout(resizeTimeoutRef.current);
        }
        
        // Use different timeout based on context - longer only for results to prevent wiggling
        const isResultsStep = window.location.pathname.includes('/simulacion/results');
        const timeout = isResultsStep ? 500 : 100;
        const heightThreshold = isResultsStep ? 20 : 5;
        
        resizeTimeoutRef.current = window.setTimeout(() => {
          const height = summaryRef.current?.offsetHeight || 400;
          
          // Only update if height has changed significantly
          // Use different thresholds based on step
          if (previousHeightRef.current === null || 
              Math.abs(previousHeightRef.current - height) > heightThreshold) {
            previousHeightRef.current = height;
            setSummaryHeight(height);
          }
          
          setIsResizing(false);
          setIsUpdating(false);
          resizeTimeoutRef.current = null;
        }, timeout);
      }
    };

    // Initial measurement
    updateHeight();
    
    // Setup resize observer for dynamic height changes - with step-specific behavior
    const resizeObserver = new ResizeObserver(() => {
      if (!isResizing && !isUpdating) {
        updateHeight();
      }
    });
    
    if (summaryRef.current) {
      resizeObserver.observe(summaryRef.current);
    }
    
    // Window resize handler - more responsive for non-results steps
    const handleResize = () => {
      if (!isResizing && !isUpdating) {
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
  }, [calculationPerformed, isResizing, isUpdating]);

  return { summaryRef, summaryHeight };
};
