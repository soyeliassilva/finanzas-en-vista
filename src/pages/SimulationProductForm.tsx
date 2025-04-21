
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

const SimulationProductForm: React.FC<SimulationProductFormProps> = ({
  product,
  values,
  onInputChange,
}) => (
  <div className="form-group border rounded-lg p-4 shadow-sm bg-white">
    <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
    <label htmlFor={`initialDeposit_${product.id}`} className="form-label">
      Aportación inicial
    </label>
    <div className="relative mb-3">
      <input
        type="number"
        id={`initialDeposit_${product.id}`}
        value={values.initialDeposit}
        onChange={e => onInputChange(product.id, "initialDeposit", Number(e.target.value))}
        className="form-input w-full"
        placeholder="0€"
        min="0"
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
        min="1"
        max="30"
      />
      <span className="absolute right-3 top-2">años</span>
    </div>

    <label htmlFor={`monthlyDeposit_${product.id}`} className="form-label">
      Aportación periódica mensual*
    </label>
    <div className="relative mb-3">
      <input
        type="number"
        id={`monthlyDeposit_${product.id}`}
        value={values.monthlyDeposit}
        onChange={e => onInputChange(product.id, "monthlyDeposit", Number(e.target.value))}
        className="form-input w-full"
        placeholder="0€"
        min="0"
      />
      <span className="absolute right-3 top-2">€</span>
    </div>
  </div>
);

export default SimulationProductForm;
