import { useState, useEffect } from 'react';
import { Product, GoalType } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook that handles product data loading and processing
 */
export const useProductsLoader = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [availableGoals, setAvailableGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) {
        throw productsError;
      }
      
      if (!productsData || productsData.length === 0) {
        throw new Error('No products found in the database');
      }
      
      const transformedProducts: Product[] = productsData.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        description: item.product_description,
        yield: Number(item.product_annual_yield),
        yield5PlusYears: item.product_annual_yield_5_plus_years ? Number(item.product_annual_yield_5_plus_years) : undefined,
        yield10PlusYears: item.product_annual_yield_10_plus_years ? Number(item.product_annual_yield_10_plus_years) : undefined,
        
        // Original properties (for backward compatibility)
        minInitialDeposit: Number(item.product_initial_contribution_min),
        maxInitialDeposit: item.product_initial_contribution_max ? Number(item.product_initial_contribution_max) : undefined,
        minMonthlyDeposit: Number(item.product_monthly_contribution_min),
        maxMonthlyDeposit: item.product_monthly_contribution_max ? Number(item.product_monthly_contribution_max) : undefined,
        minTerm: item.product_duration_months_min ? Number(item.product_duration_months_min) / 12 : 1,
        maxTotalContribution: item.product_total_contribution_max ? Number(item.product_total_contribution_max) : undefined,
        
        // Supabase column names (added to match the updated Product interface)
        product_initial_contribution_min: Number(item.product_initial_contribution_min),
        product_initial_contribution_max: item.product_initial_contribution_max ? Number(item.product_initial_contribution_max) : undefined,
        product_monthly_contribution_min: Number(item.product_monthly_contribution_min),
        product_monthly_contribution_max: item.product_monthly_contribution_max ? Number(item.product_monthly_contribution_max) : undefined,
        product_duration_months_min: item.product_duration_months_min ? Number(item.product_duration_months_min) : undefined,
        product_total_contribution_max: item.product_total_contribution_max ? Number(item.product_total_contribution_max) : undefined,
        
        goal: item.product_goal,
        taxation: item.product_tax_treatment,
        disclaimer: item.product_disclaimer,
        url: item.product_url,
        conditions: item.product_conditions,
        terms: item.product_terms,
        product_yield_description: item.product_yield_description
      }));
      
      // Store raw products from Supabase
      setRawProducts(transformedProducts);
      setLoading(false);
      
    } catch (error: any) {
      setError(error.message || 'Error loading products');
      setLoading(false);
      toast.error('Error al cargar los productos. Por favor, intente nuevamente.');
    }
  };

  // Sort goals by priority
  const processGoals = (products: Product[]) => {
    const goals = Array.from(new Set(products.map(p => p.goal)));
    
    // Order goals according to the specified priority
    const orderedGoals = [...goals].sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        "Ahorrar y tener mi dinero disponible": 0,
        "Ahorrar disfrutando de ventajas fiscales": 1,
        "Ahorrar para cuando llegue la jubilación": 2,
        "Ahorrar invirtiendo con más riesgo": 3
      };
      
      // If both goals are in the priority list, sort by their priority
      if (a in priorityOrder && b in priorityOrder) {
        return priorityOrder[a] - priorityOrder[b];
      }
      
      // If only one goal is in the priority list, it comes first
      if (a in priorityOrder) return -1;
      if (b in priorityOrder) return 1;
      
      // If neither is in the priority list, maintain original order
      return goals.indexOf(a) - goals.indexOf(b);
    });
    
    setAvailableGoals(orderedGoals);
  };

  // Set processed products
  const setProcessedProducts = (products: Product[]) => {
    setAllProducts(products);
    processGoals(products);
  };
  
  return {
    allProducts,
    rawProducts,
    availableGoals,
    loading,
    error,
    fetchProducts,
    setProcessedProducts
  };
};
