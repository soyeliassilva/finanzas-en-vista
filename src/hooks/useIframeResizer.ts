
import { useEffect, useRef, useCallback } from 'react';
import { StepName } from '../types/heightTypes';

/**
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - When explicitly called (navigation events)
 * - Browser resize events
 * - Window zoom changes
 * 
 * Optimized to:
 * - Include step name alongside height in messages
 * - Only send height if it or step has changed from previous value
 * - Prevent duplicate messages with the same step and height
 * - Support an initial "init" message on first load
 * - Use step-specific debouncing for optimal performance
 */
export const useIframeResizer = () => {
  const isInIframe = window !== window.parent;
  const lastSentHeightRef = useRef<number>(0);
  const lastSentStepRef = useRef<StepName | null>(null);
  const lastSentTimeRef = useRef<Record<string, number>>({});
  const debounceTimeoutRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  // Send the current height to the parent window if it has changed
  const sendHeight = useCallback((step: StepName, immediate: boolean = false) => {
    console.log(`[useIframeResizer] sendHeight called - step: ${step}, immediate: ${immediate}, timestamp: ${new Date().toISOString()}`);
    
    if (!isInIframe) {
      console.log('[useIframeResizer] Not in iframe, skipping height send');
      return;
    }
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      console.log('[useIframeResizer] Clearing existing timeout');
      window.clearTimeout(debounceTimeoutRef.current);
    }
    
    // Use step-specific debounce timing
    const getDebounceDelay = (stepName: StepName) => {
      if (immediate) return 0;
      // Use longer delay only for results step to prevent wiggling
      if (stepName === 'simulation_results') return 500;
      // Use shorter delays for responsive interactions
      return 100;
    };
    
    const debounceDelay = getDebounceDelay(step);
    
    console.log(`[useIframeResizer] Setting timeout with delay: ${debounceDelay}ms for step: ${step}`);
    
    debounceTimeoutRef.current = window.setTimeout(() => {
      try {
        const height = document.body.scrollHeight;
        const now = Date.now();
        
        console.log(`[useIframeResizer] Inside timeout - current height: ${height}, step: ${step}`);
        
        // Only send if:
        // 1. This is the first time we're sending for this step, or
        // 2. The height has changed significantly since last time for this step, or
        // 3. It's been more than 500ms since we sent for this step, or
        // 4. This is an immediate update
        const lastSentTime = lastSentTimeRef.current[step] || 0;
        const timeSinceLastSent = now - lastSentTime;
        const isSameStep = lastSentStepRef.current === step;
        const heightDiff = Math.abs(height - lastSentHeightRef.current);
        
        // Special case for "init" step - always send
        const isInitStep = step === 'init';
        
        // Use different thresholds based on step
        const heightThreshold = step === 'simulation_results' ? 20 : 10;
        
        const shouldSend = immediate ||
                          isInitStep || 
                          !isSameStep || 
                          heightDiff > heightThreshold ||
                          timeSinceLastSent > 500;
        
        console.log(`[useIframeResizer] Decision factors:`, {
          immediate,
          isInitStep,
          isSameStep,
          heightDiff,
          heightThreshold,
          timeSinceLastSent,
          lastSentHeight: lastSentHeightRef.current,
          lastSentStep: lastSentStepRef.current,
          shouldSend
        });
        
        if (shouldSend) {
          const message = { height, step };
          console.log(`[useIframeResizer] ✅ SENDING MESSAGE:`, message, `at ${new Date().toISOString()}`);
          window.parent.postMessage(message, '*');
          
          // Update tracking refs
          lastSentHeightRef.current = height;
          lastSentStepRef.current = step;
          lastSentTimeRef.current[step] = now;
        } else {
          console.log(`[useIframeResizer] ❌ SKIPPING MESSAGE - conditions not met for step: ${step}`);
        }
      } catch (error) {
        console.error('[useIframeResizer] Error in sendHeight:', error);
      } finally {
        debounceTimeoutRef.current = null;
      }
    }, debounceDelay);
  }, [isInIframe]);

  // Handle window resize events with debouncing
  useEffect(() => {
    if (!isInIframe) return;

    const handleResize = () => {
      console.log('[useIframeResizer] Window resize event detected');
      
      // Clear any existing resize timeout
      if (resizeTimeoutRef.current) {
        console.log('[useIframeResizer] Clearing existing resize timeout');
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Debounce resize events
      resizeTimeoutRef.current = window.setTimeout(() => {
        // Determine current step and send height
        const getCurrentStep = (): StepName => {
          const path = window.location.pathname;
          if (path.includes('/simulacion/results')) return 'simulation_results';
          if (path.includes('/simulacion/form')) return 'simulation_form';
          if (path === '/productos') return 'product_selection';
          if (path === '/') return 'goal_selection';
          return 'init';
        };
        
        const currentStep = getCurrentStep();
        console.log(`[useIframeResizer] Resize timeout triggered - sending height for step: ${currentStep}`);
        sendHeight(currentStep);
      }, 150); // Quick response for resize events
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [sendHeight]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);
  
  // Return the function for manual calls
  return { sendHeight };
};
