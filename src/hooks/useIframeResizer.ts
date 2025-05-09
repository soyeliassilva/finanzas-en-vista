
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIframeNavigation } from './useIframeNavigation';

/**
 * @deprecated Use useIframeNavigation instead
 * 
 * Hook that communicates the application's height to a parent iframe container
 * using the postMessage API. It sends height updates on:
 * - Initial load
 * - Window resize
 * - Route changes
 * - Content mutations (using ResizeObserver)
 */
export const useIframeResizer = () => {
  // Simply forward to the new hook
  const { sendHeight } = useIframeNavigation();
  return { sendHeight };
};
