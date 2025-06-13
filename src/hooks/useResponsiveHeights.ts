
import { useState, useEffect, useRef } from 'react';

export const useResponsiveHeights = (calculationPerformed: boolean) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryHeight, setSummaryHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const resizeTimeoutRef = useRef<number | null>(null);
  const previousHeightRef = useRef<number | null>(null);

  // Effect to measure and set the summary height with improved debouncing
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
        
        // Set a timeout to avoid rapid updates
        resizeTimeoutRef.current = window.setTimeout(() => {
          const height = summaryRef.current?.offsetHeight || 400;
          
          // Only update if height has changed significantly (more than 20px)
          // This helps break potential feedback loops
          if (previousHeightRef.current === null || 
              Math.abs(previousHeightRef.current - height) > 20) {
            previousHeightRef.current = height;
            setSummaryHeight(height);
          }
          
          setIsResizing(false);
          setIsUpdating(false);
          resizeTimeoutRef.current = null;
        }, 500); // Longer timeout for more stability
      }
    };

    // Initial measurement
    updateHeight();
    
    // Setup resize observer for dynamic height changes - only if not updating
    const resizeObserver = new ResizeObserver(() => {
      if (!isResizing && !isUpdating) {
        updateHeight();
      }
    });
    
    if (summaryRef.current) {
      resizeObserver.observe(summaryRef.current);
    }
    
    // Window resize handler with debouncing
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
