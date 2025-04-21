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

const getDefaultValue = (
  type: "initialDeposit" | "monthlyDeposit" | "termYears",
  product: Product
) => {
  switch (type) {
    case "initialDeposit":
      return product.minInitialDeposit ?? 0;
    case "monthlyDeposit":
      return product.minMonthlyDeposit ?? 0;
    case "termYears":
      return product.minTerm ?? 5;
    default:
      return 0;
  }
};

const SimulationProductForm: React.FC<SimulationProductFormProps> = ({
  product,
  values,
  onInputChange,
}) => {
  // If simulation uses controlled inputs this keeps fields in sync on first render
  const initialDepositValue =
    values.initialDeposit === 0 && product.minInitialDeposit
      ? product.minInitialDeposit
      : values.initialDeposit;

  const termYearsValue =
    values.termYears === 0
      ? (product.minTerm && product.minTerm > 5 ? product.minTerm : 5)
      : values.termYears;

  // Monthly deposit special case: minimum & maximum = 0
  const isMonthlyFixedNone =
    product.minMonthlyDeposit === 0 && product.maxMonthlyDeposit === 0;

  const monthlyDepositValue =
    isMonthlyFixedNone
      ? 0
      : (values.monthlyDeposit === 0 && product.minMonthlyDeposit
          ? product.minMonthlyDeposit
          : values.monthlyDeposit);

  return (
    <div className="form-group border rounded-lg p-4 shadow-sm bg-white">
      <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
      <label htmlFor={`initialDeposit_${product.id}`} className="form-label">
        Aportación inicial
        <span className="block text-xs text-muted-foreground">
          Mínimo: {product.minInitialDeposit}€ - Máximo: {formatMax(product.maxInitialDeposit)}
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
          placeholder={`${product.minInitialDeposit ?? 0}€`}
          min={product.minInitialDeposit}
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
          placeholder="5 años"
          min={product.minTerm}
          max={product.maxTerm}
        />
        <span className="absolute right-3 top-2">años</span>
      </div>

      <label htmlFor={`monthlyDeposit_${product.id}`} className="form-label">
        Aportación periódica mensual*
        <span className="block text-xs text-muted-foreground">
          {isMonthlyFixedNone
            ? "Este producto no admite aportaciones mensuales"
            : <>Mínimo: {product.minMonthlyDeposit}€ - Máximo: {formatMax(product.maxMonthlyDeposit)}</>
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
              : `${product.minMonthlyDeposit ?? 0}€`
          }
          min={product.minMonthlyDeposit}
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
