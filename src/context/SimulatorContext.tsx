
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GoalType, Product } from '../types';
import { toast } from 'sonner';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SimulatorContextType {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  allProducts: Product[];
  availableGoals: GoalType[];
  loading: boolean;
  error: string | null;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [availableGoals, setAvailableGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle goal change - clear selected products
  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    setSelectedProducts([]);
  };
  
  // Fetch products from Supabase
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
      
      // Transform Supabase data to match our Product interface
      const transformedProducts: Product[] = productsData.map((item: any) => ({
        id: item.uuid,
        name: item.product_name,
        description: item.product_description,
        yield: Number(item.product_annual_yield),
        minInitialDeposit: Number(item.product_initial_contribution_min),
        maxInitialDeposit: item.product_initial_contribution_max ? Number(item.product_initial_contribution_max) : undefined,
        minMonthlyDeposit: Number(item.product_monthly_contribution_min),
        maxMonthlyDeposit: item.product_monthly_contribution_max ? Number(item.product_monthly_contribution_max) : undefined,
        minTerm: 1, // Default value
        maxTerm: 30, // Default value
        goal: item.product_goal,
        taxation: item.product_tax_treatment,
        disclaimer: item.product_disclaimer,
        url: item.product_url,
        conditions: item.product_conditions,
        terms: item.product_terms
      }));
      
      // Extract unique goals and sort them
      const goals = Array.from(new Set(transformedProducts.map(p => p.goal)));
      
      setAllProducts(transformedProducts);
      setAvailableGoals(goals);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message || 'Error loading products');
      setLoading(false);
      toast.error('Error al cargar los productos. Por favor, intente nuevamente.');
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const value = {
    selectedGoal,
    setSelectedGoal: handleGoalChange,
    selectedProducts,
    setSelectedProducts,
    allProducts,
    availableGoals,
    loading,
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
