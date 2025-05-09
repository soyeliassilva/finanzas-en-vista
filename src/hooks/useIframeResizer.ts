
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
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastSentHeightRef = useRef<number>(0); // Track last sent height
  const lastSentStepRef = useRef<string | null>(null); // Track last sent step
  const initialSentRef = useRef<boolean>(false); // Track if initial height was sent
  const sentMessagesMapRef = useRef<Map<string, number>>(new Map()); // Track sent messages to prevent duplicates

  // Send the current height to the parent window if it has changed
  const sendHeight = useCallback((step?: string) => {
    if (!isInIframe) return;
    
    try {
      const height = document.body.scrollHeight;
      const actualStep = step || 'not specified';
      const messageKey = `${height}-${actualStep}`;
      
      // Check if we've sent this exact height+step combination recently
      const lastSentTime = sentMessagesMapRef.current.get(messageKey);
      const now = Date.now();
      const isDuplicate = lastSentTime && (now - lastSentTime < 300); // Prevent duplicates within 300ms
      
      // Only send if height or step has changed and not a duplicate
      const shouldSend = !isDuplicate && 
        (height !== lastSentHeightRef.current || actualStep !== lastSentStepRef.current || actualStep === 'init');

      if (shouldSend) {
        const message = { height, step: actualStep };
        window.parent.postMessage(message, '*');
        console.log(`Sent height update: ${height}px, step: ${actualStep}`);
        
        // Update tracking refs
        lastSentHeightRef.current = height;
        lastSentStepRef.current = actualStep;
        sentMessagesMapRef.current.set(messageKey, now);
        
        // Clean up old messages from the map (older than 1 second)
        if (sentMessagesMapRef.current.size > 10) {
          for (const [key, timestamp] of sentMessagesMapRef.current.entries()) {
            if (now - timestamp > 1000) {
              sentMessagesMapRef.current.delete(key);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending height message:', error);
    }
  }, [isInIframe]);

  // Send initial height message with "init" step
  useEffect(() => {
    if (!isInIframe || initialSentRef.current) return;
    
    // Only send initial height once
    initialSentRef.current = true;
    
    // Send init message first
    sendHeight('init');
  }, [isInIframe, sendHeight]);
  
  // Return the function for manual calls
  return { sendHeight };
};
