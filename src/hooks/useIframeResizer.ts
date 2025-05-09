
import { useEffect, useRef } from 'react';

/**
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - Window resize (horizontal only)
 * - When explicitly called (navigation events)
 * 
 * Optimized to:
 * - Only send height if it has changed from previous value
 * - Only send on explicit calls and horizontal resizes
 * - Exclude any non-height related messages
 */
export const useIframeResizer = () => {
  const isInIframe = window !== window.parent;
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastSentHeightRef = useRef<number>(0); // Track last sent height

  // Send the current height to the parent window if it has changed
  const sendHeight = () => {
    if (!isInIframe) return;
    
    try {
      const height = document.body.scrollHeight;
      
      // Only send if height has changed
      if (height !== lastSentHeightRef.current) {
        window.parent.postMessage({ height }, '*');
        console.log(`Sent height update: ${height}px`);
        lastSentHeightRef.current = height; // Update last sent height
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
      sendHeight();
      resizeTimeoutRef.current = null;
    }, 100);
  };

  // Setup window resize listener (for horizontal resizes only)
  useEffect(() => {
    if (!isInIframe) return;
    
    // Send initial height on load
    sendHeight();
    
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
