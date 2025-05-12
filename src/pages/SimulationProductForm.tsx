
import React, { useMemo } from "react";
import { Product } from "../types";
import YieldRatesInfo from "../components/simulation/YieldRatesInfo";
import ContributionLimit from "../components/simulation/ContributionLimit";
import AmountInput from "../components/simulation/AmountInput";
import { formatNumber } from "../utils/calculator";
import { useIsMobile } from "../hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Product IDs
  const PLAN_AHORRO_FLEXIBLE_ID = "230e8acf-4d50-42ab-bff0-7ed5933d00d4";
  const PPA_MUTUALIDAD_ID = "9ec57a39-df3a-4a79-b845-887f3c3486e5";
  const UNIT_LINKED_EXPLORA_EXPEDICION_ID = "a3ee24b6-b241-426e-9f25-9e41641c254b";
  const UNIT_LINKED_EXPLORA_VIAJE_ID = "1286491a-b8fc-4187-9be9-d986c1028dd6";
  
  // Check if product allows optional contributions (0€)
  const allowsOptionalContributions = [
    PLAN_AHORRO_FLEXIBLE_ID,
    UNIT_LINKED_EXPLORA_EXPEDICION_ID, 
    UNIT_LINKED_EXPLORA_VIAJE_ID
  ].includes(product.id);
  
  const isPlanAhorroFlexible = product.id === PLAN_AHORRO_FLEXIBLE_ID;
  const isPPAMutualidad = product.id === PPA_MUTUALIDAD_ID;
  const isUnitLinkedExplora = product.id === UNIT_LINKED_EXPLORA_EXPEDICION_ID || 
                              product.id === UNIT_LINKED_EXPLORA_VIAJE_ID;
  
  // Validation minimums
  const minInitial = allowsOptionalContributions ? 0 : (product.minInitialDeposit ?? 0);
  const minMonthly = allowsOptionalContributions ? 0 : (product.minMonthlyDeposit ?? 0);
  const minTermMonths = product.product_duration_months_min ?? 12;
  const minTermYears = Math.ceil(minTermMonths / 12);

  // min/max monthly 0 disables field
  const isMonthlyFixedNone =
    !isPlanAhorroFlexible && 
    !isUnitLinkedExplora &&
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

  // Custom validation for products with optional contributions
  const validateOptionalContribution = (value: number, field: "initialDeposit" | "monthlyDeposit"): { isValid: boolean; errorMessage: string | null } => {
    if (allowsOptionalContributions) {
      const minValue = field === "initialDeposit" ? product.minInitialDeposit ?? 0 : product.minMonthlyDeposit ?? 0;
      
      // Allow 0 or >= minimum deposit
      if (value === 0 || value >= minValue) {
        return { isValid: true, errorMessage: null };
      }
      
      return { 
        isValid: false, 
        errorMessage: `Para este producto, puedes elegir 0€ (sin aportación) o mínimo ${formatNumber(minValue)}€` 
      };
    }
    
    // Default validation (not a product with optional contributions)
    return { isValid: true, errorMessage: null };
  };

  // Generate the monthly contribution sublabel text
  const getMonthlyContributionSublabel = () => {
    if (isMonthlyFixedNone) {
      return "Este producto no admite aportaciones mensuales";
    }
    
    if (allowsOptionalContributions) {
      return `Opcional: Sin aportación (0€) o mínimo ${formatNumber(product.minMonthlyDeposit)}€ - Máximo: ${formatMax(product.maxMonthlyDeposit)}`;
    }
    
    return `Mínimo: ${formatNumber(minMonthly)}€ - Máximo: ${formatMax(product.maxMonthlyDeposit)}`;
  };

  // Generate the initial deposit sublabel text
  const getInitialDepositSublabel = () => {
    if (isPPAMutualidad) {
      return `Mínimo: ${formatNumber(product.minInitialDeposit)}€ - Máximo: Sin límite (Movilización de tu plan de pensiones)`;
    }
    
    if (allowsOptionalContributions) {
      return `Opcional: Sin aportación (0€) o mínimo ${formatNumber(product.minInitialDeposit)}€ - Máximo: ${formatMax(product.maxInitialDeposit)}`;
    }
    
    return `Mínimo: ${formatNumber(minInitial)}€ - Máximo: ${formatMax(product.maxInitialDeposit)}`;
  };

  return (
    <div className={`form-group border rounded-lg p-3 ${isMobile ? 'my-3' : ''} md:p-4 shadow-sm bg-white`}>
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
        customValidation={(value) => validateOptionalContribution(value, "initialDeposit")}
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
        customValidation={(value) => validateOptionalContribution(value, "monthlyDeposit")}
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
