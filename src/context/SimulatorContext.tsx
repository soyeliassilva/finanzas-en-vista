
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoalType, Product, SimulationResult } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parseProductOverrides, applyOverridesToProducts, getCurrentUrlParams } from '../utils/urlParamsUtils';

// Type definition for the form values
export type SimulationFormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

interface SimulatorContextType {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  allProducts: Product[];
  availableGoals: GoalType[];
  loading: boolean;
  error: string | null;
  // New simulation state
  productInputs: Record<string, SimulationFormValues>;
  setProductInputs: React.Dispatch<React.SetStateAction<Record<string, SimulationFormValues>>>;
  simulationResults: SimulationResult[];
  setSimulationResults: React.Dispatch<React.SetStateAction<SimulationResult[]>>;
  calculationPerformed: boolean;
  setCalculationPerformed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [availableGoals, setAvailableGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // New simulation state
  const [productInputs, setProductInputs] = useState<Record<string, SimulationFormValues>>({});
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  
  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    setSelectedProducts([]);
    // Reset simulation state when goal changes
    setProductInputs({});
    setSimulationResults([]);
    setCalculationPerformed(false);
  };
  
  // Apply product overrides from URL parameters
  const applyProductOverrides = () => {
    if (rawProducts.length === 0) return;
    
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
    
    // Set the modified products
    setAllProducts(processedProducts);
    
    // If there are selected products, update them with overrides as well
    if (selectedProducts.length > 0) {
      const updatedSelectedProducts = selectedProducts.map(selectedProduct => {
        const updatedProduct = processedProducts.find(p => p.id === selectedProduct.id);
        return updatedProduct || selectedProduct;
      }).filter(product => {
        // Filter out any products that may have been hidden by URL params
        return processedProducts.some(p => p.id === product.id);
      });
      
      setSelectedProducts(updatedSelectedProducts);
    }
    
    // Also update product goals based on processed products
    const goals = Array.from(new Set(processedProducts.map(p => p.goal)));
    
    // Order goals according to the specified priority
    const orderedGoals = [...goals].sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        "Disponibilidad": 0,
        "Fiscalidad": 1,
        "Jubilación": 2,
        "Inversión": 3
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
        terms: item.product_terms
      }));
      
      // Store raw products from Supabase
      setRawProducts(transformedProducts);

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message || 'Error loading products');
      setLoading(false);
      toast.error('Error al cargar los productos. Por favor, intente nuevamente.');
    }
  };
  
  // Effect to fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Effect to apply URL parameter overrides whenever raw products change
  useEffect(() => {
    applyProductOverrides();
  }, [rawProducts]);
  
  const value = {
    selectedGoal,
    setSelectedGoal: handleGoalChange,
    selectedProducts,
    setSelectedProducts,
    allProducts,
    availableGoals,
    loading,
    error,
    // Expose simulation state
    productInputs,
    setProductInputs,
    simulationResults,
    setSimulationResults,
    calculationPerformed,
    setCalculationPerformed
  };
  
  return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
