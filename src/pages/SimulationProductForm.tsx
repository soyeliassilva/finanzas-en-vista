
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
}) => (
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
        value={values.initialDeposit}
        onChange={e => onInputChange(product.id, "initialDeposit", Number(e.target.value))}
        className="form-input w-full"
        placeholder="0€"
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
        value={values.termYears}
        onChange={e => onInputChange(product.id, "termYears", Number(e.target.value))}
        className="form-input w-full"
        placeholder="1 año"
        min={product.minTerm}
        max={product.maxTerm}
      />
      <span className="absolute right-3 top-2">años</span>
    </div>

    <label htmlFor={`monthlyDeposit_${product.id}`} className="form-label">
      Aportación periódica mensual*
      <span className="block text-xs text-muted-foreground">
        Mínimo: {product.minMonthlyDeposit}€ - Máximo: {formatMax(product.maxMonthlyDeposit)}
      </span>
    </label>
    <div className="relative mb-3">
      <input
        type="number"
        id={`monthlyDeposit_${product.id}`}
        value={values.monthlyDeposit}
        onChange={e => onInputChange(product.id, "monthlyDeposit", Number(e.target.value))}
        className="form-input w-full"
        placeholder="0€"
        min={product.minMonthlyDeposit}
        max={
          product.maxMonthlyDeposit === undefined || product.maxMonthlyDeposit === null
            ? undefined
            : product.maxMonthlyDeposit
        }
      />
      <span className="absolute right-3 top-2">€</span>
    </div>
  </div>
);

export default SimulationProductForm;
