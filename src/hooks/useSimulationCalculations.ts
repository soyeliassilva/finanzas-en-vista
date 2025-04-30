
import { useState } from 'react';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue } from '../utils/calculator';

type FormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

export const useSimulationCalculations = (selectedProducts: Product[]) => {
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  const getApplicableYield = (product: Product, termYears: number) => {
    if (termYears >= 10 && product.yield10PlusYears !== undefined) {
      return product.yield10PlusYears;
    } else if (termYears >= 5 && product.yield5PlusYears !== undefined) {
      return product.yield5PlusYears;
    }
    return product.yield;
  };

  const calculateResults = (productInputs: Record<string, FormValues>) => {
    if (selectedProducts.length === 0) return;

    const newResults = selectedProducts.map(product => {
      const { initialDeposit, monthlyDeposit, termYears } = productInputs[product.id] || 
        { initialDeposit: 0, monthlyDeposit: 0, termYears: 1 };
      const applicableYield = getApplicableYield(product, termYears);
      
      const { finalAmount, monthlyData } = calculateFutureValue(
        initialDeposit,
        monthlyDeposit,
        termYears,
        applicableYield,
        product.maxTotalContribution,
        product.id
      );

      // Calculate actual contributions considering limits
      let totalContributions = initialDeposit;
      const isPIASMutualidad = product.id === "pias-mutualidad";
      
      if (isPIASMutualidad) {
        // For PIAS Mutualidad, calculate first year contributions (respecting 8000€ limit)
        const firstYearAllowance = Math.max(0, 8000 - initialDeposit);
        const firstYearMonthlyTotal = Math.min(firstYearAllowance, monthlyDeposit * 12);
        
        // Remaining years with full monthly contributions
        const remainingMonths = (termYears - 1) * 12;
        const remainingContributions = remainingMonths * monthlyDeposit;
        
        totalContributions += firstYearMonthlyTotal + remainingContributions;
      } else {
        // For other products, apply only the maxTotalContribution limit
        const maxMonthlyTotal = product.maxTotalContribution 
          ? Math.min(
              monthlyDeposit * termYears * 12,
              Math.max(0, product.maxTotalContribution - initialDeposit)
            )
          : monthlyDeposit * termYears * 12;
          
        totalContributions += maxMonthlyTotal;
      }

      return {
        productId: product.id,
        name: product.name,
        initialDeposit,
        monthlyDeposit,
        termYears,
        termMonths: termYears * 12,
        yield: applicableYield,
        finalAmount,
        generatedInterest: finalAmount - totalContributions,
        monthlyData,
        taxation: product.taxation,
        url: product.url,
        disclaimer: product.disclaimer,
        maxTotalContribution: product.maxTotalContribution
      };
    });

    setResults(newResults);
    setCalculationPerformed(true);
  };

  return {
    results,
    calculationPerformed,
    calculateResults,
  };
};
