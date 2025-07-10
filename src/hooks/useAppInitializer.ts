
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
    console.log(`[useAppInitializer] Effect triggered - initSent: ${initSentRef.current}, isInIframe: ${window !== window.parent}`);
    
    // Only send the init message once when the app loads
    if (!initSentRef.current && window !== window.parent) {
      console.log('[useAppInitializer] Setting initSent to true and starting initialization');
      initSentRef.current = true;
      
      // Add a delay to ensure DOM is fully rendered before calculating height
      setTimeout(() => {
        console.log(`[useAppInitializer] Timeout triggered - document.readyState: ${document.readyState}`);
        
        // Ensure document is ready before sending height
        if (document.readyState === 'complete') {
          console.log('[useAppInitializer] Document ready - sending init height immediately');
          sendHeight('init');
        } else {
          console.log('[useAppInitializer] Document not ready - adding load listener');
          // Wait for document to be ready
          const handleLoad = () => {
            console.log('[useAppInitializer] Load event fired - sending init height');
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
