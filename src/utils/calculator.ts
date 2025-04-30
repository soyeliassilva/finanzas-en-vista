
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
  maxTotalContribution?: number,
  productId?: string
): { finalAmount: number; monthlyData: { month: number; value: number }[] } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  const monthlyData: { month: number; value: number }[] = [];
  
  // Calculate value for each month for chart data
  let currentValue = initial;
  let totalContributions = initial;
  
  // For PIAS Mutualidad with annual contribution limit
  const isPIASMutualidad = productId === "pias-mutualidad";
  const annualLimit = isPIASMutualidad ? 8000 : Infinity;
  let currentYearContributions = initial; // Track contributions for the current year
  let currentYear = 1; // Start with year 1
  
  for (let month = 0; month <= months; month++) {
    if (month === 0) {
      monthlyData.push({ month, value: initial });
      continue;
    }
    
    // Calculate monthly compounding - add interest to current value
    currentValue = currentValue * (1 + monthlyRate);
    
    // Check if we're starting a new year (every 12 months)
    if (isPIASMutualidad && month % 12 === 0) {
      currentYear++;
      currentYearContributions = 0; // Reset annual contribution counter for new year
    }
    
    // Special handling for PIAS Mutualidad
    let monthlyContribution = monthly;
    if (isPIASMutualidad) {
      // Check if adding this month's contribution would exceed the annual limit
      if (currentYearContributions + monthly > annualLimit) {
        monthlyContribution = Math.max(0, annualLimit - currentYearContributions);
      }
      currentYearContributions += monthlyContribution;
    }
    
    // Add monthly contribution if we haven't hit the max total contribution limit
    if (maxTotalContribution === undefined || totalContributions + monthlyContribution <= maxTotalContribution) {
      currentValue += monthlyContribution;
      totalContributions += monthlyContribution;
    }
    
    monthlyData.push({ month, value: Math.round(currentValue * 100) / 100 });
  }

  return { 
    finalAmount: Math.round(currentValue * 100) / 100, 
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
