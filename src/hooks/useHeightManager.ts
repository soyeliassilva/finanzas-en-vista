
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
  const lastStepSentRef = useRef<StepName | null>(null);
  const heightUpdatedRef = useRef<Record<StepName, boolean>>({
    init: false,
    goal_selection: false,
    product_selection: false,
    simulation_form: false,
    simulation_results: false
  });

  // Determine current step based on location path with more precise matching
  const getCurrentStep = useCallback((): StepName => {
    const path = location.pathname;
    
    // More specific routes first
    if (path.includes('/simulacion/results')) return 'simulation_results';
    if (path.includes('/simulacion/form')) return 'simulation_form';
    if (path === '/productos') return 'product_selection';
    if (path === '/') return 'goal_selection';
    
    // Default fallback (should rarely happen)
    return 'init';
  }, [location.pathname]);
  
  // Handle iframe height updates with a centralized function
  const updateIframeHeight = useCallback((specifiedStep?: StepName) => {
    // Use provided step or determine from current route
    const stepToUse = specifiedStep || getCurrentStep();
    
    if (window !== window.parent) {
      // Prevent sending goal_selection height during transitions
      if (!specifiedStep && stepToUse === 'goal_selection' && 
          prevPathRef.current !== '/' && prevPathRef.current !== '') {
        console.log('Skipping automatic goal_selection height during transition');
        return;
      }
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Track the current path for next time
        const currentPath = location.pathname;
        
        // Check if this is an explicit height update request or if the path/step has changed
        const isExplicitUpdate = !!specifiedStep;
        const pathChanged = currentPath !== prevPathRef.current;
        const stepChanged = lastStepSentRef.current !== stepToUse;
        
        if (isExplicitUpdate || pathChanged || stepChanged || !heightUpdatedRef.current[stepToUse]) {
          console.log(`Sending height for ${stepToUse} (${isExplicitUpdate ? 'explicit' : 'auto'})`);
          sendHeight(stepToUse);
          
          // Update tracking refs
          prevPathRef.current = currentPath;
          lastStepSentRef.current = stepToUse;
          heightUpdatedRef.current[stepToUse] = true;
        }
      }, 100); // Increased delay to ensure proper sequencing
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
