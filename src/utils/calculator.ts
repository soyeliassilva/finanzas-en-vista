
import { SimulationResult } from '../types';

// Calculates future value and monthly progression
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
  annualRate: number
): { finalAmount: number; monthlyData: { month: number; value: number }[] } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  const monthlyData: { month: number; value: number }[] = [];
  
  // Calculate value for each month for chart data
  let currentValue = initial;
  
  for (let month = 0; month <= months; month++) {
    if (month === 0) {
      monthlyData.push({ month, value: initial });
      continue;
    }
    
    // Calculate monthly compounding
    // First, add interest to current value
    currentValue = currentValue * (1 + monthlyRate);
    // Then, add monthly contribution
    currentValue += monthly;
    
    monthlyData.push({ month, value: Math.round(currentValue * 100) / 100 });
  }
  
  // Use formula for final calculation to ensure accuracy
  const finalAmount = initial * Math.pow(1 + monthlyRate, months) + 
    monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

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
