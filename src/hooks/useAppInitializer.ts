
import { useEffect, useRef } from 'react';
import { useIframeResizer } from './useIframeResizer';

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
      
      // Send the init message
      sendHeight('init');
      
      // Log initialization
      console.log('App initialized, sent initial height update');
    }
  }, [sendHeight]);
  
  return { initialized: initSentRef.current };
};
