
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
  const { getCurrentStep } = useHeightManager();
  
  useEffect(() => {
    // Only send the init message once when the app loads
    if (!initSentRef.current && window !== window.parent) {
      initSentRef.current = true;
      
      // First send the init message
      sendHeight('init');
      
      // Then send the current step height (with small delay to avoid conflicts)
      setTimeout(() => {
        const currentStep = getCurrentStep();
        sendHeight(currentStep);
      }, 100);
      
      // Log initialization
      console.log('App initialized, sent initial height update');
    }
  }, [sendHeight, getCurrentStep]);
  
  return { initialized: initSentRef.current };
};
