import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoalType, Product } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProductOverrides } from '../hooks/useProductOverrides';

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
  const overrides = useProductOverrides();

  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    setSelectedProducts([]);
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

      const transformedProducts: Product[] = productsData.map((item: any) => {
        const productId = item.id;
        let productObj = {
          id: item.id,
          name: item.product_name,
          description: item.product_description,
          yield: Number(item.product_annual_yield),
          yield5PlusYears: item.product_annual_yield_5_plus_years ? Number(item.product_annual_yield_5_plus_years) : undefined,
          yield10PlusYears: item.product_annual_yield_10_plus_years ? Number(item.product_annual_yield_10_plus_years) : undefined,
          minInitialDeposit: Number(item.product_initial_contribution_min),
          maxInitialDeposit: item.product_initial_contribution_max ? Number(item.product_initial_contribution_max) : undefined,
          minMonthlyDeposit: Number(item.product_monthly_contribution_min),
          maxMonthlyDeposit: item.product_monthly_contribution_max ? Number(item.product_monthly_contribution_max) : undefined,
          minTerm: item.product_duration_months_min ? Number(item.product_duration_months_min) / 12 : 1,
          maxTotalContribution: item.product_total_contribution_max ? Number(item.product_total_contribution_max) : undefined,
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
        };

        if (overrides[productId]) {
          Object.entries(overrides[productId]).forEach(([column, value]) => {
            let newValue: any = value;
            if (/^(\d+(\.\d+)?)$/.test(value)) newValue = Number(value);
            if (column in productObj) {
              (productObj as any)[column] = newValue;
              if (column === "product_annual_yield") productObj.yield = Number(newValue);
              if (column === "product_annual_yield_5_plus_years") productObj.yield5PlusYears = Number(newValue);
              if (column === "product_annual_yield_10_plus_years") productObj.yield10PlusYears = Number(newValue);
              if (column === "product_initial_contribution_min") productObj.minInitialDeposit = Number(newValue);
              if (column === "product_initial_contribution_max") productObj.maxInitialDeposit = Number(newValue);
              if (column === "product_monthly_contribution_min") productObj.minMonthlyDeposit = Number(newValue);
              if (column === "product_monthly_contribution_max") productObj.maxMonthlyDeposit = Number(newValue);
              if (column === "product_duration_months_min") productObj.minTerm = Number(newValue) / 12;
              if (column === "product_total_contribution_max") productObj.maxTotalContribution = Number(newValue);
            }
          });
        }

        return productObj;
      });

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
  }, [overrides]);

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
