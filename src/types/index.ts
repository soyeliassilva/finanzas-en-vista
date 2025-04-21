export type GoalType = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  yield: number;
  yield5PlusYears?: number;
  yield10PlusYears?: number;
  minInitialDeposit: number;
  maxInitialDeposit?: number;
  minMonthlyDeposit: number;
  maxMonthlyDeposit?: number;
  minTerm: number;
  maxTotalContribution?: number;
  goal: GoalType;
  taxation: string;
  disclaimer?: string;
  url?: string;
  conditions?: string;
  terms?: string;
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
}
