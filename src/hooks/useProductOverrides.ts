
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

      params.forEach((value, key) => {
        const match = key.match(/^([0-9a-fA-F-]{32,36})-(.+)$/);
        if (match) {
          const productId = match[1];
          const column = match[2];
          if (!newOverrides[productId]) newOverrides[productId] = {};
          newOverrides[productId][column] = value;
          console.log(`[useProductOverrides] Found override for ${productId}, column: ${column}, value: ${value}`);
        }
      });
      
      const hasOverrides = Object.keys(newOverrides).length > 0;
      if (hasOverrides) {
        console.log("[useProductOverrides] Detected overrides in URL:", newOverrides);
      }
      
      setOverrides(newOverrides);
    };

    // Initial overrides update
    updateOverrides();

    // Set up listener for URL changes
    window.addEventListener('popstate', updateOverrides);

    return () => {
      window.removeEventListener('popstate', updateOverrides);
    };
  }, []);

  // Debug whenever overrides change
  useEffect(() => {
    if (Object.keys(overrides).length > 0) {
      console.log("[useProductOverrides] Active overrides:", overrides);
    }
  }, [overrides]);

  return overrides;
}
