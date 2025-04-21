
import React from 'react';
import { Product } from '@/types';
import SimulationProductForm from '@/pages/SimulationProductForm';

interface SimulationFormProps {
  selectedProducts: Product[];
  productInputs: Record<string, FormValues>;
  handleInputChange: (productId: string, field: keyof FormValues, value: number) => void;
}

interface FormValues {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ 
  selectedProducts, 
  productInputs,
  handleInputChange 
}) => {
  const gridColsStyle = {
    ['--md-cols' as string]: `repeat(${selectedProducts.length}, minmax(0, 1fr))`
  };

  return (
    <form
      className={`grid grid-cols-1 md:gap-4 gap-4 mb-6 md:grid-cols-[var(--md-cols)]`}
      style={gridColsStyle}
    >
      {selectedProducts.map((product) => {
        const values = productInputs[product.id] || {
          initialDeposit: product.minInitialDeposit,
          monthlyDeposit: product.minMonthlyDeposit,
          termYears: Math.ceil((product.product_duration_months_min || 12) / 12),
        };
        return (
          <SimulationProductForm
            key={product.id}
            product={product}
            values={values}
            onInputChange={handleInputChange}
          />
        );
      })}
    </form>
  );
};

export default SimulationForm;
