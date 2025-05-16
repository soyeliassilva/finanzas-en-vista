
export type GoalType = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  yield: number;
  yield5PlusYears?: number;
  yield10PlusYears?: number;
  
  // Original properties (keeping for backward compatibility)
  minInitialDeposit: number;
  maxInitialDeposit?: number;
  minMonthlyDeposit: number;
  maxMonthlyDeposit?: number;
  minTerm: number;
  maxTotalContribution?: number;
  
  // Supabase column names
  product_initial_contribution_min: number;
  product_initial_contribution_max?: number;
  product_monthly_contribution_min: number;
  product_monthly_contribution_max?: number;
  product_duration_months_min?: number;
  product_total_contribution_max?: number;
  
  goal: GoalType;
  taxation: string;
  disclaimer?: string;
  url?: string;
  conditions?: string;
  terms?: string;
  product_yield_description?: string;
  product_short_name?: string; // Added this field to support Typeform URL generation
}

export interface SimulationResult {
  productId: string;
  name: string;
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
  termMonths: number;
  yield: number;
  finalAmount: number;
  generatedInterest: number;
  monthlyData: { month: number; value: number }[];
  taxation: string;
  url?: string;
  disclaimer?: string;
  maxTotalContribution?: number;
  product_short_name?: string; // Added this field to pass down the short name
}

