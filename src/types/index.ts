
export type GoalType = 
  | 'maxima_disponibilidad' 
  | 'maximizar_beneficios' 
  | 'ahorrar_jubilacion' 
  | 'mas_retorno';

export interface Product {
  id: string;
  name: string;
  description: string;
  yield: number;
  minInitialDeposit: number;
  minMonthlyDeposit: number;
  minTerm: number;
  maxTerm?: number;
  goal: GoalType;
  taxation: string;
  disclaimer?: string;
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
}
