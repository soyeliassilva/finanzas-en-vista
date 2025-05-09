
import { useCallback } from 'react';
import { Product } from '../types';
import { parseProductOverrides, applyOverridesToProducts, getCurrentUrlParams } from '../utils/urlParamsUtils';

/**
 * Hook for applying URL parameter overrides to products
 */
export const useProductOverrides = () => {
  // Apply product overrides from URL parameters
  const applyProductOverrides = useCallback((rawProducts: Product[]): Product[] => {
    if (rawProducts.length === 0) return [];
    
    // Get URL parameters
    const urlParams = getCurrentUrlParams();
    
    // Parse product overrides from URL
    const overrides = parseProductOverrides(urlParams);
    
    console.log('URL Parameters:', urlParams);
    console.log('Parsed Overrides:', overrides);
    
    // Apply overrides to products
    const processedProducts = applyOverridesToProducts(rawProducts, overrides);
    
    // Log the first product before and after overrides for debugging
    if (rawProducts.length > 0 && processedProducts.length > 0) {
      console.log('First product before override:', rawProducts[0]);
      console.log('First product after override:', processedProducts[0]);
    }
    
    return processedProducts;
  }, []);
  
  return { applyProductOverrides };
};
