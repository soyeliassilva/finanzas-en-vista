
import { Product } from "../types";

export type ProductOverride = {
  productId: string;
  field: string;
  value: any;
  hidden: boolean;
};

// Mapping between Supabase column names and Product interface properties
const fieldMapping: Record<string, string> = {
  'product_annual_yield': 'yield',
  'product_annual_yield_5_plus_years': 'yield5PlusYears',
  'product_annual_yield_10_plus_years': 'yield10PlusYears',
  'product_initial_contribution_min': 'minInitialDeposit',
  'product_initial_contribution_max': 'maxInitialDeposit',
  'product_monthly_contribution_min': 'minMonthlyDeposit',
  'product_monthly_contribution_max': 'maxMonthlyDeposit',
  'product_duration_months_min': 'minTerm',
  'product_total_contribution_max': 'maxTotalContribution',
  'product_name': 'name',
  'product_description': 'description',
  'product_tax_treatment': 'taxation',
  'product_disclaimer': 'disclaimer',
  'product_url': 'url',
  'product_conditions': 'conditions',
  'product_terms': 'terms',
  'product_goal': 'goal'
};

// Parse URL parameters to extract product overrides
export const parseProductOverrides = (searchParams: string): ProductOverride[] => {
  const params = new URLSearchParams(searchParams);
  const overrides: ProductOverride[] = [];
  
  // Parse each parameter
  params.forEach((value, key) => {
    // Check if the parameter follows the product override format: <productId>-<field>=<value>
    const match = key.match(/^([a-zA-Z0-9-]+)-(.+)$/);
    
    if (match) {
      const [, productId, field] = match;
      
      // Handle the hidden parameter specially
      if (field === 'hidden' && value.toLowerCase() === 'yes') {
        overrides.push({
          productId,
          field: '',
          value: null,
          hidden: true
        });
      } 
      // Handle normal field overrides
      else if (field !== 'hidden') {
        // Convert value to appropriate type based on field name
        const typedValue = convertValueToType(field, value);
        
        overrides.push({
          productId,
          field,
          value: typedValue,
          hidden: false
        });
      }
    }
  });
  
  return overrides;
};

// Convert string values from URL to appropriate types based on field name
const convertValueToType = (field: string, value: string): any => {
  // Numeric fields that should be converted to numbers
  const numericFields = [
    'product_annual_yield',
    'product_annual_yield_5_plus_years',
    'product_annual_yield_10_plus_years',
    'product_initial_contribution_min',
    'product_initial_contribution_max',
    'product_monthly_contribution_min',
    'product_monthly_contribution_max',
    'product_duration_months_min',
    'product_total_contribution_max',
    'yield',
    'yield5PlusYears',
    'yield10PlusYears',
    'minInitialDeposit',
    'maxInitialDeposit',
    'minMonthlyDeposit',
    'maxMonthlyDeposit',
    'minTerm',
    'maxTotalContribution'
  ];
  
  // Convert to number if field is numeric
  if (numericFields.includes(field)) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? value : numValue;
  }
  
  // Return string value for all other fields
  return value;
};

// Apply overrides to products
export const applyOverridesToProducts = (products: Product[], overrides: ProductOverride[]): Product[] => {
  if (!overrides.length) return products;
  
  // First, filter out hidden products
  const hiddenProductIds = overrides
    .filter(override => override.hidden)
    .map(override => override.productId);

  console.log('Applying overrides:', overrides);
  console.log('Hiding products:', hiddenProductIds);
  
  // Apply field overrides to remaining products
  return products
    .filter(product => !hiddenProductIds.includes(product.id))
    .map(product => {
      // Find all overrides that apply to this product
      const productOverrides = overrides.filter(
        override => override.productId === product.id && !override.hidden
      );
      
      if (productOverrides.length === 0) {
        return product;
      }
      
      // Apply all overrides to the product
      const overriddenProduct = { ...product };
      
      productOverrides.forEach(override => {
        // Map field name from Supabase column to Product property
        const productField = fieldMapping[override.field] || override.field;
        
        // Log override application for debugging
        console.log(`Applying override for product ${product.id}:`, {
          originalField: override.field,
          mappedField: productField,
          value: override.value
        });
        
        // Try to apply both to mapped field and original field
        if (productField in overriddenProduct) {
          (overriddenProduct as any)[productField] = override.value;
          console.log(`Successfully applied override to field '${productField}'`);
        } else if (override.field in overriddenProduct) {
          (overriddenProduct as any)[override.field] = override.value;
          console.log(`Successfully applied override to original field '${override.field}'`);
        } else {
          console.warn(`Failed to apply override: field '${override.field}' not found in product`);
        }

        // Special handling for product_annual_yield -> yield conversion
        if (override.field === 'product_annual_yield') {
          overriddenProduct.yield = override.value;
          console.log(`Applied product_annual_yield override to 'yield' property:`, override.value);
        }
      });
      
      return overriddenProduct;
    });
};

// Get the current URL parameters
export const getCurrentUrlParams = (): string => {
  return window.location.search;
};

// Preserve URL parameters during navigation
export const preserveUrlParams = (targetPath: string): string => {
  const currentParams = window.location.search;
  
  if (!currentParams) {
    return targetPath;
  }
  
  // If target path already has parameters, append current ones
  if (targetPath.includes('?')) {
    return `${targetPath}&${currentParams.substring(1)}`;
  }
  
  // Otherwise add parameters with ?
  return `${targetPath}${currentParams}`;
};
