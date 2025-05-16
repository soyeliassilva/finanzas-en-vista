
import { useState } from 'react';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue } from '../utils/calculator';
import { SimulationFormValues } from '../types/heightTypes';

export const useSimulationCalculations = (selectedProducts: Product[]) => {
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  // Product IDs
  const PIAS_MUTUALIDAD_ID = "6d65d7f1-835d-4e19-8625-b61abd881c4c";
  const PLAN_AHORRO_5_ID = "dec278a6-e9ed-4e9b-84aa-7306d19b173e";

  const getApplicableYield = (product: Product, termYears: number) => {
    if (termYears >= 10 && product.yield10PlusYears !== undefined) {
      return product.yield10PlusYears;
    } else if (termYears >= 5 && product.yield5PlusYears !== undefined) {
      return product.yield5PlusYears;
    }
    return product.yield;
  };

  const calculateResults = (productInputs: Record<string, SimulationFormValues>): SimulationResult[] => {
    if (selectedProducts.length === 0) return [];

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
      
      // Check if product has annual contribution limit
      const hasAnnualLimit = product.id === PIAS_MUTUALIDAD_ID || product.id === PLAN_AHORRO_5_ID;
      const annualLimit = product.id === PIAS_MUTUALIDAD_ID ? 8000 : product.id === PLAN_AHORRO_5_ID ? 5000 : Infinity;
      
      if (hasAnnualLimit) {
        // Calculate first year contributions (respecting annual limit)
        const firstYearAllowance = Math.max(0, annualLimit - initialDeposit);
        const firstYearMonthlyTotal = Math.min(firstYearAllowance, monthlyDeposit * 12);
        
        // Calculate how many months will have contributions in the first year
        let contributingMonthsFirstYear = 0;
        if (monthlyDeposit > 0) {
          contributingMonthsFirstYear = Math.min(12, Math.ceil(firstYearAllowance / monthlyDeposit));
        }
        
        // Calculate actual first year monthly contributions
        let actualFirstYearMonthlyTotal = 0;
        if (contributingMonthsFirstYear > 0) {
          // Handle partial contribution for the last contributing month
          if (firstYearAllowance % monthlyDeposit !== 0 && firstYearAllowance < monthlyDeposit * contributingMonthsFirstYear) {
            const fullMonths = Math.floor(firstYearAllowance / monthlyDeposit);
            const partialAmount = firstYearAllowance % monthlyDeposit;
            actualFirstYearMonthlyTotal = (fullMonths * monthlyDeposit) + partialAmount;
          } else {
            actualFirstYearMonthlyTotal = contributingMonthsFirstYear * monthlyDeposit;
          }
        }
        
        // Remaining years with full monthly contributions
        const remainingYears = termYears - 1;
        const remainingContributions = remainingYears * 12 * monthlyDeposit;
        
        // Total contributions is initial + first year monthly (capped) + remaining years
        totalContributions = initialDeposit + Math.min(actualFirstYearMonthlyTotal, firstYearAllowance) + remainingContributions;
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
        maxTotalContribution: product.maxTotalContribution,
        product_short_name: product.product_short_name // Pass the short name to the result
      };
    });

    setCalculationPerformed(true);
    return newResults;
  };

  return {
    calculationPerformed,
    calculateResults,
  };
};
