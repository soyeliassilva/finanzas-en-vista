
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoalType, Product, SimulationResult } from '../types';
import { SimulationFormValues, StepName } from '../types/heightTypes';
import { useProductsLoader } from '../hooks/useProductsLoader';
import { useHeightManager } from '../hooks/useHeightManager';
import { useProductOverrides } from '../hooks/useProductOverrides';
import { useIframeResizer } from '../hooks/useIframeResizer';

interface SimulatorContextType {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  allProducts: Product[];
  availableGoals: GoalType[];
  loading: boolean;
  error: string | null;
  // Simulation state
  productInputs: Record<string, SimulationFormValues>;
  setProductInputs: React.Dispatch<React.SetStateAction<Record<string, SimulationFormValues>>>;
  simulationResults: SimulationResult[];
  setSimulationResults: React.Dispatch<React.SetStateAction<SimulationResult[]>>;
  calculationPerformed: boolean;
  setCalculationPerformed: React.Dispatch<React.SetStateAction<boolean>>;
  // Height management
  updateIframeHeight: (step: StepName) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core product state from hooks
  const {
    allProducts,
    rawProducts,
    availableGoals,
    loading,
    error,
    fetchProducts,
    setProcessedProducts
  } = useProductsLoader();
  
  // Product selection state
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Simulation state
  const [productInputs, setProductInputs] = useState<Record<string, SimulationFormValues>>({});
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  
  // Height management
  const { updateIframeHeight } = useHeightManager();
  const { sendHeight } = useIframeResizer();
  
  // URL parameter override handling
  const { applyProductOverrides } = useProductOverrides();
  
  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    setSelectedProducts([]);
    // Reset simulation state when goal changes
    setProductInputs({});
    setSimulationResults([]);
    setCalculationPerformed(false);
  };
  
  // Effect to fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Effect to apply URL parameter overrides whenever raw products change
  useEffect(() => {
    if (rawProducts.length > 0) {
      const processedProducts = applyProductOverrides(rawProducts);
      
      // Set processed products
      setProcessedProducts(processedProducts);
      
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
      
      // Send height update after products are processed
      setTimeout(() => {
        sendHeight('init');
      }, 100);
    }
  }, [rawProducts, applyProductOverrides, sendHeight]);
  
  // Effect to send height update when loading state changes from true to false
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure DOM is fully rendered after loading completes
      setTimeout(() => {
        sendHeight('init');
      }, 200);
    }
  }, [loading, sendHeight]);
  
  const value = {
    selectedGoal,
    setSelectedGoal: handleGoalChange,
    selectedProducts,
    setSelectedProducts,
    allProducts,
    availableGoals,
    loading,
    error,
    // Simulation state
    productInputs,
    setProductInputs,
    simulationResults,
    setSimulationResults,
    calculationPerformed,
    setCalculationPerformed,
    // Height update function
    updateIframeHeight
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
