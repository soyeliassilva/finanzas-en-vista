
import React, { useMemo } from "react";
import { Product } from "../types";
import YieldRatesInfo from "../components/simulation/YieldRatesInfo";
import ContributionLimit from "../components/simulation/ContributionLimit";
import AmountInput from "../components/simulation/AmountInput";
import { formatNumber } from "../utils/calculator";

interface SimulationProductFormProps {
  product: Product;
  values: {
    initialDeposit: number;
    monthlyDeposit: number;
    termYears: number;
  };
  onInputChange: (
    productId: string,
    field: "initialDeposit" | "monthlyDeposit" | "termYears",
    value: number
  ) => void;
}

const formatMax = (max?: number) => 
  max === undefined || max === null ? "Sin límite" : `${formatNumber(max)}€`;

const SimulationProductForm: React.FC<SimulationProductFormProps> = ({
  product,
  values,
  onInputChange,
}) => {
  // Plan Ahorro Flexible ID
  const PLAN_AHORRO_FLEXIBLE_ID = "230e8acf-4d50-42ab-bff0-7ed5933d00d4";
  // PPA Mutualidad ID
  const PPA_MUTUALIDAD_ID = "9ec57a39-df3a-4a79-b845-887f3c3486e5";
  
  const isPlanAhorroFlexible = product.id === PLAN_AHORRO_FLEXIBLE_ID;
  const isPPAMutualidad = product.id === PPA_MUTUALIDAD_ID;
  
  // Validation minimums
  const minInitial = product.minInitialDeposit ?? 0;
  const minMonthly = isPlanAhorroFlexible ? 0 : (product.minMonthlyDeposit ?? 0);
  const minTermMonths = product.product_duration_months_min ?? 12;
  const minTermYears = Math.ceil(minTermMonths / 12);

  // min/max monthly 0 disables field
  const isMonthlyFixedNone =
    !isPlanAhorroFlexible && 
    minMonthly === 0 && 
    (product.maxMonthlyDeposit ?? 0) === 0;

  // Determine which yield rate applies based on term from props
  const appliedYield = useMemo(() => {
    if (values.termYears >= 10 && product.yield10PlusYears !== undefined) {
      return product.yield10PlusYears;
    } else if (values.termYears >= 5 && product.yield5PlusYears !== undefined) {
      return product.yield5PlusYears;
    }
    return product.yield;
  }, [product, values.termYears]);

  // Calculate total planned contribution using values from props
  const totalPlannedContribution = values.initialDeposit + (values.monthlyDeposit * values.termYears * 12);
  
  // Check if total contribution exceeds max allowed
  const exceedsMaxContribution = product.maxTotalContribution !== undefined && 
    totalPlannedContribution > product.maxTotalContribution;

  // Custom validation for Plan Ahorro Flexible monthly deposits
  const validateFlexibleMonthlyDeposit = (value: number): { isValid: boolean; errorMessage: string | null } => {
    if (isPlanAhorroFlexible) {
      // Allow 0 or >= minimum monthly deposit (60€)
      if (value === 0 || value >= (product.minMonthlyDeposit ?? 60)) {
        return { isValid: true, errorMessage: null };
      }
      return { 
        isValid: false, 
        errorMessage: `Para este producto, puedes elegir 0€ (sin aportación) o mínimo ${formatNumber(product.minMonthlyDeposit ?? 60)}€` 
      };
    }
    
    // Default validation (not Plan Ahorro Flexible)
    return { isValid: true, errorMessage: null };
  };

  // Generate the monthly contribution sublabel text
  const getMonthlyContributionSublabel = () => {
    if (isMonthlyFixedNone) {
      return "Este producto no admite aportaciones mensuales";
    }
    
    if (isPlanAhorroFlexible) {
      return `Opcional: Sin aportación (0€) o mínimo ${formatNumber(product.minMonthlyDeposit)}€ - Máximo: ${formatMax(product.maxMonthlyDeposit)}`;
    }
    
    return `Mínimo: ${formatNumber(minMonthly)}€ - Máximo: ${formatMax(product.maxMonthlyDeposit)}`;
  };

  // Generate the initial deposit sublabel text
  const getInitialDepositSublabel = () => {
    if (isPPAMutualidad) {
      return `Mínimo: ${formatNumber(minInitial)}€ - Máximo: Sin límite (Movilización de tu plan de pensiones)`;
    }
    
    return `Mínimo: ${formatNumber(minInitial)}€ - Máximo: ${formatMax(product.maxInitialDeposit)}`;
  };

  return (
    <div className="form-group border rounded-lg p-4 shadow-sm bg-white">
      <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
      
      <YieldRatesInfo product={product} appliedYield={appliedYield} />
      
      <AmountInput
        id={`initialDeposit_${product.id}`}
        value={values.initialDeposit}
        onChange={(value) => onInputChange(product.id, "initialDeposit", value)}
        min={minInitial}
        max={product.maxInitialDeposit}
        placeholder={`${formatNumber(minInitial)}€`}
        label="Aportación inicial de capital"
        sublabel={getInitialDepositSublabel()}
      />

      <AmountInput
        id={`termYears_${product.id}`}
        value={values.termYears}
        onChange={(value) => onInputChange(product.id, "termYears", value)}
        min={minTermYears}
        placeholder={`${formatNumber(minTermYears)} años`}
        label="Tiempo que quieres mantener el ahorro"
        sublabel={`Mínimo: ${minTermYears} ${minTermYears === 1 ? 'año' : 'años'}`}
        unit="años"
      />

      <AmountInput
        id={`monthlyDeposit_${product.id}`}
        value={values.monthlyDeposit}
        onChange={(value) => onInputChange(product.id, "monthlyDeposit", value)}
        min={minMonthly}
        max={product.maxMonthlyDeposit}
        placeholder={isMonthlyFixedNone ? "No disponible" : `${formatNumber(minMonthly)}€`}
        label="Aportación periódica mensual*"
        sublabel={getMonthlyContributionSublabel()}
        disabled={isMonthlyFixedNone}
        customValidation={isPlanAhorroFlexible ? validateFlexibleMonthlyDeposit : undefined}
      />
      
      <ContributionLimit 
        product={product}
        totalPlannedContribution={totalPlannedContribution}
        exceedsMaxContribution={exceedsMaxContribution}
      />
    </div>
  );
};

export default SimulationProductForm;
