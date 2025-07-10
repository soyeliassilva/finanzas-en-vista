
import { useEffect, useRef } from 'react';
import { useIframeResizer } from './useIframeResizer';
import { useHeightManager } from './useHeightManager';

/**
 * Hook that handles initial app setup, including sending the initial height updates
 * This ensures we properly send the 'init' message once on app load
 */
export const useAppInitializer = () => {
  const initSentRef = useRef<boolean>(false);
  const { sendHeight } = useIframeResizer();
  
  useEffect(() => {
    // Only send the init message once when the app loads
    if (!initSentRef.current && window !== window.parent) {
      initSentRef.current = true;
      
      // Add a delay to ensure DOM is fully rendered before calculating height
      setTimeout(() => {
        // Ensure document is ready before sending height
        if (document.readyState === 'complete') {
          sendHeight('init');
        } else {
          // Wait for document to be ready
          const handleLoad = () => {
            sendHeight('init');
            window.removeEventListener('load', handleLoad);
          };
          window.addEventListener('load', handleLoad);
        }
      }, 150);
    }
  }, [sendHeight]);
  
  return { initialized: initSentRef.current };
};
