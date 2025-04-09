
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoalType, Product } from '../types';
import { supabase } from '../lib/supabase';

interface SimulatorContextType {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  availableGoals: string[];
  availableProducts: Product[];
  isLoading: boolean;
  error: Error | null;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableGoals, setAvailableGoals] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Reset selected products when goal changes
  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    setSelectedProducts([]);
  };
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          // Map Supabase data to our Product type
          const products: Product[] = data.map(item => ({
            id: item.uuid || item.product_name.toLowerCase().replace(/\s+/g, '-'),
            name: item.product_name,
            description: item.product_description,
            yield: item.product_annual_yield,
            minInitialDeposit: item.product_initial_contribution_min || 0,
            minMonthlyDeposit: item.product_monthly_contribution_min || 0,
            minTerm: Math.ceil((item.product_duration_months_min || 12) / 12),
            maxTerm: item.product_duration_months_max ? Math.ceil(item.product_duration_months_max / 12) : undefined,
            goal: item.product_goal.toLowerCase().replace(/\s+/g, '_') as GoalType,
            taxation: item.product_tax_treatment,
            disclaimer: item.product_disclaimer,
            url: item.product_url
          }));
          
          setAvailableProducts(products);
          
          // Extract unique goals
          const uniqueGoals = [...new Set(products.map(p => p.goal))];
          setAvailableGoals(uniqueGoals);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const value = {
    selectedGoal,
    setSelectedGoal: handleGoalChange,
    selectedProducts,
    setSelectedProducts,
    availableGoals,
    availableProducts,
    isLoading,
    error
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
