
import React, { useMemo } from "react";
import { Product } from "../types";
import YieldRatesInfo from "../components/simulation/YieldRatesInfo";
import ContributionLimit from "../components/simulation/ContributionLimit";
import AmountInput from "../components/simulation/AmountInput";

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
  max === undefined || max === null ? "Sin límite" : `${max}€`;

const SimulationProductForm: React.FC<SimulationProductFormProps> = ({
  product,
  values,
  onInputChange,
}) => {
  // minInitialDeposit defaults to 0 if undefined
  const minInitial = product.minInitialDeposit ?? 0;
  // minMonthlyDeposit defaults to 0 if undefined
  const minMonthly = product.minMonthlyDeposit ?? 0;
  // min/max monthly 0 disables field
  const isMonthlyFixedNone =
    minMonthly === 0 && (product.maxMonthlyDeposit ?? 0) === 0;

  // Calculate minimum term in years from product_duration_months_min
  const minTermMonths = product.product_duration_months_min ?? 12; // Default to 1 year if not specified
  const minTermYears = Math.ceil(minTermMonths / 12);

  // DEFAULT ALL VALUES TO MINIMUM VALUES
  const initialDepositValue = minInitial;
  const termYearsValue = minTermYears;
  const monthlyDepositValue = isMonthlyFixedNone ? 0 : minMonthly;

  // Determine which yield rate applies based on term
  const appliedYield = useMemo(() => {
    if (termYearsValue >= 10 && product.yield10PlusYears !== undefined) {
      return product.yield10PlusYears;
    } else if (termYearsValue >= 5 && product.yield5PlusYears !== undefined) {
      return product.yield5PlusYears;
    }
    return product.yield;
  }, [product, termYearsValue]);

  // Calculate total planned contribution
  const totalPlannedContribution = initialDepositValue + (monthlyDepositValue * termYearsValue * 12);
  
  // Check if total contribution exceeds max allowed
  const exceedsMaxContribution = product.maxTotalContribution !== undefined && 
    totalPlannedContribution > product.maxTotalContribution;

  return (
    <div className="form-group border rounded-lg p-4 shadow-sm bg-white">
      <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
      
      <YieldRatesInfo product={product} appliedYield={appliedYield} />
      
      <AmountInput
        id={`initialDeposit_${product.id}`}
        value={initialDepositValue}
        onChange={(value) => onInputChange(product.id, "initialDeposit", value)}
        min={minInitial}
        max={product.maxInitialDeposit}
        placeholder={`${minInitial}€`}
        label="Aportación inicial"
        sublabel={`Mínimo: ${minInitial}€ - Máximo: ${formatMax(product.maxInitialDeposit)}`}
      />

      <AmountInput
        id={`termYears_${product.id}`}
        value={termYearsValue}
        onChange={(value) => onInputChange(product.id, "termYears", value)}
        min={minTermYears}
        placeholder={`${minTermYears} años`}
        label="Plazo de vencimiento"
        sublabel={`Mínimo: ${minTermYears} ${minTermYears === 1 ? 'año' : 'años'}`}
        unit="años"
      />

      <AmountInput
        id={`monthlyDeposit_${product.id}`}
        value={monthlyDepositValue}
        onChange={(value) => onInputChange(product.id, "monthlyDeposit", value)}
        min={minMonthly}
        max={product.maxMonthlyDeposit}
        placeholder={isMonthlyFixedNone ? "No disponible" : `${minMonthly}€`}
        label="Aportación periódica mensual*"
        sublabel={isMonthlyFixedNone
          ? "Este producto no admite aportaciones mensuales"
          : `Mínimo: ${minMonthly}€ - Máximo: ${formatMax(product.maxMonthlyDeposit)}`
        }
        disabled={isMonthlyFixedNone}
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
