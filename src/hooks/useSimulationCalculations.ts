import { useState } from 'react';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue } from '../utils/calculator';
import { getProductDefaultFormValue } from '../utils/productUtils';

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
        getProductDefaultFormValue(product);
      
      const applicableYield = getApplicableYield(product, termYears);
      
      const { finalAmount, monthlyData } = calculateFutureValue(
        initialDeposit,
        monthlyDeposit,
        termYears,
        applicableYield,
        product.maxTotalContribution
      );

      return {
        productId: product.id,
        name: product.name,
        initialDeposit,
        monthlyDeposit,
        termYears,
        termMonths: termYears * 12,
        yield: applicableYield,
        finalAmount,
        generatedInterest: finalAmount - (initialDeposit + Math.min(
          monthlyDeposit * termYears * 12,
          (product.maxTotalContribution ? product.maxTotalContribution - initialDeposit : Infinity)
        )),
        monthlyData,
        taxation: product.taxation,
        url: product.url
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
