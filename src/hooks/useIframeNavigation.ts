
import { useEffect, useRef } from 'react';

/**
 * Hook that provides functionality to communicate the application's height 
 * to a parent iframe container. Height updates are sent:
 * - When explicitly called via sendHeight()
 * - On window horizontal resize (width changes)
 */
export const useIframeNavigation = () => {
  const isInIframe = window !== window.parent;
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastWidthRef = useRef<number>(window.innerWidth);
  
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

  // Listen for horizontal resize events only
  useEffect(() => {
    // Don't do anything if not in an iframe
    if (!isInIframe) return;
    
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      
      // Only send height if the width changed (horizontal resize)
      if (currentWidth !== lastWidthRef.current) {
        lastWidthRef.current = currentWidth;
        debouncedSendHeight();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [isInIframe]);
  
  return { sendHeight };
};
