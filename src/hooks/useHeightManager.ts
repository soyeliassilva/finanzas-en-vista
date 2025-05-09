
import { useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIframeResizer } from './useIframeResizer';
import { StepName } from '../types/heightTypes';

/**
 * Hook that centralizes iframe height management
 */
export const useHeightManager = () => {
  const location = useLocation();
  const { sendHeight } = useIframeResizer();
  const prevPathRef = useRef<string>(location.pathname);
  const heightUpdatedRef = useRef<Record<StepName, boolean>>({
    init: false,
    goal_selection: false,
    product_selection: false,
    simulation_form: false,
    simulation_results: false
  });

  // Determine current step based on location path
  const getCurrentStep = useCallback((): StepName => {
    const path = location.pathname;
    if (path === '/') return 'goal_selection';
    if (path === '/productos') return 'product_selection';
    if (path.includes('/simulacion/form')) return 'simulation_form';
    if (path.includes('/simulacion/results')) return 'simulation_results';
    return 'goal_selection';
  }, [location.pathname]);
  
  // Handle iframe height updates with a centralized function
  const updateIframeHeight = useCallback((specifiedStep?: StepName) => {
    // Use provided step or determine from current route
    const stepToUse = specifiedStep || getCurrentStep();
    
    if (window !== window.parent) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Only send height update if we haven't sent it for this step/path already,
        // or if it's explicitly being forced with a specifiedStep
        if (specifiedStep || location.pathname !== prevPathRef.current || !heightUpdatedRef.current[stepToUse]) {
          sendHeight(stepToUse);
          
          // Update the tracking refs
          prevPathRef.current = location.pathname;
          heightUpdatedRef.current[stepToUse] = true;
        }
      }, 50);
    }
  }, [getCurrentStep, sendHeight, location.pathname]);
  
  // Reset height update tracking for a specific step
  const resetHeightUpdated = useCallback((step: StepName) => {
    heightUpdatedRef.current[step] = false;
  }, []);
  
  // Reset all height update tracking
  const resetAllHeightUpdated = useCallback(() => {
    Object.keys(heightUpdatedRef.current).forEach(key => {
      heightUpdatedRef.current[key as StepName] = false;
    });
  }, []);
  
  return {
    getCurrentStep,
    updateIframeHeight,
    resetHeightUpdated,
    resetAllHeightUpdated
  };
};
