
import { SimulationResult } from '../types';

// Calculates future value and monthly progression with variable yield rates and max contribution limits
// Formula: FV = P * (1 + r)^T + A * ((1 + r)^T - 1) / r
// where:
// FV = Future value
// P = Initial principal
// A = Monthly contribution
// r = Monthly yield (annual rate / 12)
// T = Time in months
export const calculateFutureValue = (
  initial: number, 
  monthly: number, 
  termYears: number, 
  annualRate: number,
  maxTotalContribution?: number
): { finalAmount: number; monthlyData: { month: number; value: number }[] } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  const monthlyData: { month: number; value: number }[] = [];
  
  // Calculate value for each month for chart data
  let currentValue = initial;
  let totalContributions = initial;
  
  for (let month = 0; month <= months; month++) {
    if (month === 0) {
      monthlyData.push({ month, value: initial });
      continue;
    }
    
    // Calculate monthly compounding
    // First, add interest to current value
    currentValue = currentValue * (1 + monthlyRate);
    
    // Then, add monthly contribution if we haven't hit the max contribution limit
    if (maxTotalContribution === undefined || totalContributions + monthly <= maxTotalContribution) {
      currentValue += monthly;
      totalContributions += monthly;
    }
    
    monthlyData.push({ month, value: Math.round(currentValue * 100) / 100 });
  }
  
  // For final calculation accuracy, we recalculate with the formula
  // but need to account for the contribution limit
  let finalAmount: number;
  
  if (maxTotalContribution === undefined || maxTotalContribution >= initial + (monthly * months)) {
    // No limit or limit not reached, use standard formula
    finalAmount = initial * Math.pow(1 + monthlyRate, months) + 
      monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  } else {
    // Limit reached, use the last calculated value
    finalAmount = currentValue;
  }

  return { 
    finalAmount: Math.round(finalAmount * 100) / 100, 
    monthlyData 
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
