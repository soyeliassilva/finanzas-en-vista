import React, { useMemo } from "react";
import { Product } from "../types";

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

  // Use default value if value is zero/empty
  const initialDepositValue = values.initialDeposit === 0 ? minInitial : values.initialDeposit;
  const termYearsValue = values.termYears === 0 ? minTermYears : values.termYears;
  const monthlyDepositValue = isMonthlyFixedNone
    ? 0
    : values.monthlyDeposit === 0
      ? minMonthly
      : values.monthlyDeposit;

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
      
      {(product.yield5PlusYears !== undefined || product.yield10PlusYears !== undefined) && (
        <div className="mb-3 px-3 py-2 bg-primary/10 rounded-md text-xs">
          <p className="font-semibold mb-1">Rentabilidad aplicada: {appliedYield}%</p>
          <ul className="list-disc list-inside">
            {product.yield !== undefined && <li>Base: {product.yield}%</li>}
            {product.yield5PlusYears !== undefined && <li>Plazo ≥ 5 años: {product.yield5PlusYears}%</li>}
            {product.yield10PlusYears !== undefined && <li>Plazo ≥ 10 años: {product.yield10PlusYears}%</li>}
          </ul>
        </div>
      )}
      
      <label htmlFor={`initialDeposit_${product.id}`} className="form-label">
        Aportación inicial
        <span className="block text-xs text-muted-foreground">
          Mínimo: {minInitial}€ - Máximo: {formatMax(product.maxInitialDeposit)}
        </span>
      </label>
      <div className="relative mb-3">
        <input
          type="number"
          id={`initialDeposit_${product.id}`}
          value={initialDepositValue}
          onChange={e =>
            onInputChange(product.id, "initialDeposit", Number(e.target.value))
          }
          className="form-input w-full"
          placeholder={`${minInitial}€`}
          min={minInitial}
          max={
            product.maxInitialDeposit === undefined || product.maxInitialDeposit === null
              ? undefined
              : product.maxInitialDeposit
          }
        />
        <span className="absolute right-3 top-2">€</span>
      </div>

      <label htmlFor={`termYears_${product.id}`} className="form-label">
        Plazo de vencimiento
        <span className="block text-xs text-muted-foreground">
          Mínimo: {minTermYears} {minTermYears === 1 ? 'año' : 'años'}
        </span>
      </label>
      <div className="relative mb-3">
        <input
          type="number"
          id={`termYears_${product.id}`}
          value={termYearsValue}
          onChange={e =>
            onInputChange(product.id, "termYears", Number(e.target.value))
          }
          className="form-input w-full"
          placeholder={`${minTermYears} años`}
          min={minTermYears}
        />
        <span className="absolute right-3 top-2">años</span>
      </div>

      <label htmlFor={`monthlyDeposit_${product.id}`} className="form-label">
        Aportación periódica mensual*
        <span className="block text-xs text-muted-foreground">
          {isMonthlyFixedNone
            ? "Este producto no admite aportaciones mensuales"
            : <>Mínimo: {minMonthly}€ - Máximo: {formatMax(product.maxMonthlyDeposit)}</>
          }
        </span>
      </label>
      <div className="relative mb-3">
        <input
          type="number"
          id={`monthlyDeposit_${product.id}`}
          value={monthlyDepositValue}
          onChange={e =>
            onInputChange(product.id, "monthlyDeposit", Number(e.target.value))
          }
          className="form-input w-full"
          placeholder={
            isMonthlyFixedNone
              ? "No disponible"
              : `${minMonthly}€`
          }
          min={minMonthly}
          max={
            product.maxMonthlyDeposit === undefined || product.maxMonthlyDeposit === null
              ? undefined
              : product.maxMonthlyDeposit
          }
          disabled={isMonthlyFixedNone}
        />
        <span className="absolute right-3 top-2">€</span>
      </div>
      
      {product.maxTotalContribution && (
        <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
          <p className="font-semibold">Aportación máxima total: {product.maxTotalContribution.toLocaleString()}€</p>
          <p>Aportación planificada: {totalPlannedContribution.toLocaleString()}€ 
          {exceedsMaxContribution && 
            ' (se respetará el límite máximo en los cálculos)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimulationProductForm;
