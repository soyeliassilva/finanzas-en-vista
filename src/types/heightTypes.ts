
/**
 * Standardized step names for height updates
 */
export type StepName = 'init' | 'goal_selection' | 'product_selection' | 'simulation_form' | 'simulation_results';

/**
 * Type definition for the form values
 */
export type SimulationFormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};
