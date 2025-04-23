
import { useState, useEffect } from "react";

/**
 * Returns an override map: { [productId]: { [col]: value } }
 * from query params like ?{productId}-{column}=value
 * 
 * This hook will re-evaluate when the URL search params change
 */
export function useProductOverrides(): Record<string, Record<string, string>> {
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  
  useEffect(() => {
    const updateOverrides = () => {
      if (typeof window === "undefined") return;
      
      const params = new URLSearchParams(window.location.search);
      const newOverrides: Record<string, Record<string, string>> = {};

      // Log all params for debugging
      console.log("[useProductOverrides] All URL params:", Object.fromEntries(params.entries()));

      params.forEach((value, key) => {
        // Updated regex to match UUID format and handle column names
        const match = key.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-(.+)$/i);
        
        if (match) {
          const productId = match[1];
          const column = match[2];
          
          if (!newOverrides[productId]) {
            newOverrides[productId] = {};
          }
          
          newOverrides[productId][column] = value;
          console.log(`[useProductOverrides] Found override for product ${productId}:`, {
            column,
            value,
            fullKey: key
          });
        } else {
          console.log(`[useProductOverrides] Param ${key} didn't match expected format`);
        }
      });
      
      const hasOverrides = Object.keys(newOverrides).length > 0;
      if (hasOverrides) {
        console.log("[useProductOverrides] Detected overrides in URL:", newOverrides);
      } else {
        console.log("[useProductOverrides] No overrides detected in URL");
      }
      
      setOverrides(newOverrides);
    };

    // Initial overrides update
    updateOverrides();

    // Listen for URL changes
    window.addEventListener('popstate', updateOverrides);
    
    // Listen for manual URL changes via history.pushState/replaceState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      updateOverrides();
    };
    
    window.history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      updateOverrides();
    };

    return () => {
      window.removeEventListener('popstate', updateOverrides);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return overrides;
}
