
import { useEffect, useRef } from 'react';

/**
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - Window resize (horizontal only)
 * - When explicitly called (navigation events)
 * 
 * Optimized to:
 * - Include step name alongside height in messages
 * - Only send height if it or step has changed from previous value
 * - Only send on explicit calls and horizontal resizes
 */
export const useIframeResizer = () => {
  const isInIframe = window !== window.parent;
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastSentHeightRef = useRef<number>(0); // Track last sent height
  const lastSentStepRef = useRef<string | null>(null); // Track last sent step

  // Send the current height to the parent window if it has changed
  const sendHeight = (step?: string) => {
    if (!isInIframe) return;
    
    try {
      const height = document.body.scrollHeight;
      const message = step ? { height, step } : { height };
      
      // Only send if height or step has changed
      if (height !== lastSentHeightRef.current || step !== lastSentStepRef.current) {
        window.parent.postMessage(message, '*');
        console.log(`Sent height update: ${height}px, step: ${step || 'not specified'}`);
        lastSentHeightRef.current = height; // Update last sent height
        if (step) lastSentStepRef.current = step; // Update last sent step
      }
    } catch (error) {
      console.error('Error sending height message:', error);
    }
  };

  // Debounced version for window resize events
  const debouncedSendHeight = () => {
    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      sendHeight(lastSentStepRef.current || undefined);
      resizeTimeoutRef.current = null;
    }, 100);
  };

  // Setup window resize listener (for horizontal resizes only)
  useEffect(() => {
    if (!isInIframe) return;
    
    // Send initial height on load
    sendHeight("init");
    
    // Handle window resize events
    const handleResize = () => {
      debouncedSendHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [isInIframe]);
  
  // Return the function for manual calls
  return { sendHeight };
};
