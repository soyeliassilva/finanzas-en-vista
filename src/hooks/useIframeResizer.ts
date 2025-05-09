
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - When explicitly called (navigation events)
 * 
 * Optimized to:
 * - Include step name alongside height in messages
 * - Only send height if it or step has changed from previous value
 * - Prevent duplicate messages with the same step and height
 * - Support an initial "init" message on first load
 */
export const useIframeResizer = () => {
  const isInIframe = window !== window.parent;
  const lastSentHeightRef = useRef<number>(0); // Track last sent height
  const lastSentStepRef = useRef<string | null>(null); // Track last sent step
  const lastSentTimeRef = useRef<Record<string, number>>({}); // Track when messages were sent
  const debounceTimeoutRef = useRef<number | null>(null);

  // Send the current height to the parent window if it has changed
  const sendHeight = useCallback((step?: string) => {
    if (!isInIframe) return;
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      window.clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set a small debounce timeout to prevent rapid fire updates
    debounceTimeoutRef.current = window.setTimeout(() => {
      try {
        const height = document.body.scrollHeight;
        const actualStep = step || 'not specified';
        const messageKey = `${height}-${actualStep}`;
        const now = Date.now();
        
        // Only send if:
        // 1. This is the first time we're sending for this step, or
        // 2. The height has changed significantly since last time for this step, or
        // 3. It's been more than 500ms since we sent for this step
        const lastSentTime = lastSentTimeRef.current[actualStep] || 0;
        const timeSinceLastSent = now - lastSentTime;
        const isSameStep = lastSentStepRef.current === actualStep;
        const heightDiff = Math.abs(height - lastSentHeightRef.current);
        
        // Special case for "init" step - always send
        const isInitStep = actualStep === 'init';
        
        const shouldSend = isInitStep || 
                          !isSameStep || 
                          heightDiff > 10 ||
                          timeSinceLastSent > 500;
        
        if (shouldSend) {
          const message = { height, step: actualStep };
          window.parent.postMessage(message, '*');
          console.log(`Sent height update: ${height}px, step: ${actualStep}`);
          
          // Update tracking refs
          lastSentHeightRef.current = height;
          lastSentStepRef.current = actualStep;
          lastSentTimeRef.current[actualStep] = now;
        }
      } catch (error) {
        console.error('Error sending height message:', error);
      } finally {
        debounceTimeoutRef.current = null;
      }
    }, 50); // Small debounce to group changes
  }, [isInIframe]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
  // Return the function for manual calls
  return { sendHeight };
};
