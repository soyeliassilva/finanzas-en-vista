
import { useCallback, useRef, useEffect } from 'react';
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
  const isInitialLoadRef = useRef<boolean>(true);
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
    console.log(`[useHeightManager] getCurrentStep called for path: ${path}`);
    
    // More specific routes first
    if (path.includes('/simulacion/results')) {
      console.log('[useHeightManager] Determined step: simulation_results');
      return 'simulation_results';
    }
    if (path.includes('/simulacion/form')) {
      console.log('[useHeightManager] Determined step: simulation_form');
      return 'simulation_form';
    }
    if (path === '/productos') {
      console.log('[useHeightManager] Determined step: product_selection');
      return 'product_selection';
    }
    if (path === '/') {
      console.log('[useHeightManager] Determined step: goal_selection');
      return 'goal_selection';
    }
    
    // Default fallback (should rarely happen)
    console.log('[useHeightManager] Determined step: init (fallback)');
    return 'init';
  }, [location.pathname]);
  
  // Effect to track initial load state
  useEffect(() => {
    // Set isInitialLoad to false after first render
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
  }, []);
  
  // Handle iframe height updates with a centralized function
  const updateIframeHeight = useCallback((specifiedStep?: StepName, immediate: boolean = false) => {
    // Use provided step or determine from current route
    const stepToUse = specifiedStep || getCurrentStep();
    
    console.log(`[useHeightManager] updateIframeHeight called:`, {
      specifiedStep,
      stepToUse,
      immediate,
      currentPath: location.pathname,
      prevPath: prevPathRef.current,
      isInitialLoad: isInitialLoadRef.current,
      timestamp: new Date().toISOString()
    });
    
    if (window !== window.parent) {
      // Prevent sending goal_selection height during initial load
      if (!specifiedStep && stepToUse === 'goal_selection' && isInitialLoadRef.current) {
        console.log('[useHeightManager] ❌ BLOCKED: goal_selection during initial load');
        return;
      }
      
      // Prevent sending goal_selection height during transitions
      if (!specifiedStep && stepToUse === 'goal_selection' && 
          prevPathRef.current !== '/' && prevPathRef.current !== '') {
        console.log('[useHeightManager] ❌ BLOCKED: goal_selection during transition');
        return;
      }
      
      // Use optimized delays based on step and context
      const getDelay = () => {
        if (immediate) return 0;
        // Longer delay only for results step to prevent wiggling
        if (stepToUse === 'simulation_results') return 500;
        // Shorter delays for responsive interactions
        return 100;
      };
      
      const delay = getDelay();
      console.log(`[useHeightManager] Setting timeout with delay: ${delay}ms for step: ${stepToUse}`);
      
      setTimeout(() => {
        // Track the current path for next time
        const currentPath = location.pathname;
        
        // Check if this is an explicit height update request or if the path/step has changed
        const isExplicitUpdate = !!specifiedStep;
        const pathChanged = currentPath !== prevPathRef.current;
        const stepChanged = lastStepSentRef.current !== stepToUse;
        
        console.log(`[useHeightManager] Timeout executed - decision factors:`, {
          isExplicitUpdate,
          pathChanged,
          stepChanged,
          heightUpdatedForStep: heightUpdatedRef.current[stepToUse],
          currentPath,
          prevPath: prevPathRef.current,
          lastStepSent: lastStepSentRef.current
        });
        
        if (isExplicitUpdate || pathChanged || stepChanged || !heightUpdatedRef.current[stepToUse]) {
          console.log(`[useHeightManager] ✅ CALLING sendHeight for step: ${stepToUse}`);
          sendHeight(stepToUse, immediate);
          
          // Update tracking refs
          prevPathRef.current = currentPath;
          lastStepSentRef.current = stepToUse;
          heightUpdatedRef.current[stepToUse] = true;
        } else {
          console.log(`[useHeightManager] ❌ SKIPPED: conditions not met for step: ${stepToUse}`);
        }
      }, delay);
    } else {
      console.log('[useHeightManager] Not in iframe, skipping height update');
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
