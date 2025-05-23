
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
  
  // Products with annual contribution limits
  const PIAS_MUTUALIDAD_ID = "6d65d7f1-835d-4e19-8625-b61abd881c4c";
  const PLAN_AHORRO_5_ID = "dec278a6-e9ed-4e9b-84aa-7306d19b173e";
  
  // Check if product has an annual contribution limit
  const hasAnnualLimit = productId === PIAS_MUTUALIDAD_ID || productId === PLAN_AHORRO_5_ID;
  
  // Set the appropriate annual limit based on product ID
  const annualLimit = productId === PIAS_MUTUALIDAD_ID ? 8000 : 
                      productId === PLAN_AHORRO_5_ID ? 5000 : 
                      Infinity;
  
  // Track current year's contributions for products with annual limits
  let currentYearContributions = initial; // Start with initial contribution
  let currentYear = 1;
  
  for (let month = 0; month <= months; month++) {
    if (month === 0) {
      monthlyData.push({ month, value: initial });
      continue;
    }
    
    // Calculate monthly compounding - add interest to current value
    currentValue = currentValue * (1 + monthlyRate);
    
    // Check if we're starting a new year (every 12 months)
    if (month % 12 === 0) {
      currentYear++;
      // Reset annual contribution counter for new year (year 2 and beyond)
      if (hasAnnualLimit && month > 0) {
        currentYearContributions = 0;
      }
    }
    
    // Special handling for products with annual limits
    let monthlyContribution = monthly;
    
    if (hasAnnualLimit) {
      // First year special handling (month 1 to 12)
      if (currentYear === 1) {
        // Check if adding this month's contribution would exceed the annual limit
        if (currentYearContributions >= annualLimit) {
          // Already reached annual limit, no contribution this month
          monthlyContribution = 0;
        } else {
          // Calculate how much more can be contributed this month
          const remainingAllowance = annualLimit - currentYearContributions;
          monthlyContribution = Math.min(monthly, remainingAllowance);
        }
        // Update current year's contribution tracking
        currentYearContributions += monthlyContribution;
      }
      // For subsequent years, the full monthly contribution is allowed
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

// Format number with Spanish locale (dot as thousand separator)
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format currency with Spanish locale (€ symbol, no decimals)
export const formatCurrency = (value: number): string => {
  // Enhanced formatting to ensure proper thousand separators
  // First, try using the standard Intl.NumberFormat
  const formattedValue = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

  // If value is 1000 or greater, it should have a thousand separator
  if (value >= 1000) {
    // Check if the formatted value already has a thousand separator
    // In Spanish locale, formatted value should include a dot as thousand separator
    const numericPart = formattedValue.replace(/[^0-9]/g, '');
    
    // If the formatted value doesn't have the correct number of digits (indicating missing separators)
    // then manually format it
    if (numericPart.length === String(Math.floor(value)).length) {
      // Format the number part manually to ensure proper thousand separators
      const numberPart = formatNumber(value);
      // Reconstruct the currency string with the proper format (adding the € symbol)
      return `${numberPart} €`;
    }
  }
  
  return formattedValue;
};

// Format percentage with Spanish locale (comma as decimal separator)
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};
