
import React from 'react';
import { Product } from '../../types';
import { ChevronRight } from 'lucide-react';
import SimulationProductForm from '../../pages/SimulationProductForm';
import { useIframeNavigation } from '../../hooks/useIframeNavigation';

type FormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

interface SimulationFormProps {
  selectedProducts: Product[];
  productInputs: Record<string, FormValues>;
  onInputChange: (productId: string, field: keyof FormValues, value: number) => void;
  onCalculate: () => void;
  onBack: () => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  selectedProducts,
  productInputs,
  onInputChange,
  onCalculate,
  onBack,
}) => {
  const { sendHeight } = useIframeNavigation();
  const gridColsStyle = {
    ['--md-cols' as string]: `repeat(${selectedProducts.length}, minmax(0, 1fr))`
  };

  const handleCalculate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCalculate();
    sendHeight();
  };

  const handleBack = () => {
    onBack();
    sendHeight();
  };

  return (
    <div className="step-container active-step mb-6">
      <div className="mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 3</h3>
        <h2 className="text-3xl text-primary mb-4">
          Introduce tu plan de ahorro: cuanto puedes ahorrar y en cuanto tiempo
        </h2>
      </div>
      <form
        onSubmit={handleCalculate}
      >
        <div
          className={`grid grid-cols-1 md:gap-4 gap-4 mb-6 md:grid-cols-[var(--md-cols)]`}
          style={gridColsStyle}
        >
          {selectedProducts.map((product) => (
            <SimulationProductForm
              key={product.id}
              product={product}
              values={productInputs[product.id] || { initialDeposit: 0, monthlyDeposit: 0, termYears: 1 }}
              onInputChange={onInputChange}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button className="btn-outline" type="button" onClick={handleBack}>
            Volver
          </button>
          <button className="btn-primary" type="submit">
            Calcular rentabilidad <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimulationForm;
