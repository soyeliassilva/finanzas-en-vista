
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - Window resize
 * - Route changes
 * - Content mutations (using ResizeObserver)
 */
export const useIframeResizer = () => {
  const location = useLocation();
  const isInIframe = window !== window.parent;
  const resizeTimeoutRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Send the current height to the parent window
  const sendHeight = () => {
    if (!isInIframe) return;
    
    try {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ height }, '*');
      console.log(`Sent height update: ${height}px`);
    } catch (error) {
      console.error('Error sending height message:', error);
    }
  };

  // Debounced version of sendHeight to avoid excessive updates
  const debouncedSendHeight = () => {
    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      sendHeight();
      resizeTimeoutRef.current = null;
    }, 100);
  };

  // Setup resize observer and window resize listener
  useEffect(() => {
    // Don't do anything if not in an iframe
    if (!isInIframe) return;
    
    // Initial height calculation and send
    sendHeight();
    
    // Setup resize observer for content changes
    observerRef.current = new ResizeObserver(debouncedSendHeight);
    observerRef.current.observe(document.body);
    
    // Handle window resize events
    const handleResize = () => debouncedSendHeight();
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [isInIframe]);
  
  // Send height update when route changes
  useEffect(() => {
    // Wait for DOM to update after route change
    const routeChangeTimer = setTimeout(() => {
      sendHeight();
    }, 300);
    
    return () => clearTimeout(routeChangeTimer);
  }, [location.pathname]);
  
  // Provide the sendHeight function for manual triggers
  return { sendHeight };
};
