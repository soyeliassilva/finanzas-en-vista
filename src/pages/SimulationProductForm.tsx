
import React from "react";
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

  // minTerm from product_duration_months_min (as years, rounded up)
  const minTermMonths = product.minTerm ?? 5;
  const minTermYears = Math.ceil(minTermMonths / 12);

  // Use default value if value is zero/empty
  const initialDepositValue =
    values.initialDeposit === 0 ? minInitial : values.initialDeposit;
  const termYearsValue =
    values.termYears === 0 ? minTermYears : values.termYears;
  const monthlyDepositValue =
    isMonthlyFixedNone
      ? 0
      : values.monthlyDeposit === 0
        ? minMonthly
        : values.monthlyDeposit;

  return (
    <div className="form-group border rounded-lg p-4 shadow-sm bg-white">
      <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
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
        Plazo de vencimiento*
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
          max={product.maxTerm ? Math.ceil(product.maxTerm / 12) : undefined}
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
    </div>
  );
};

export default SimulationProductForm;
