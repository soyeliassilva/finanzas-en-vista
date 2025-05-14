
import React from 'react';
import { Product } from '../../types';
import { ChevronRight } from 'lucide-react';
import SimulationProductForm from '../../pages/SimulationProductForm';
import { useIsMobile } from '../../hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const gridColsStyle = {
    ['--md-cols' as string]: `repeat(${selectedProducts.length}, minmax(0, 1fr))`
  };

  return (
    <div className="step-container active-step">
      <div className="mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 3</h3>
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} text-primary mb-4`}>
          Personaliza tu plan de ahorro: cuanto puedes ahorrar y en cuanto tiempo
        </h2>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          onCalculate();
        }}
      >
        <div
          className={`grid grid-cols-1 gap-4 mb-6 md:grid-cols-[var(--md-cols)] md:gap-4 ${isMobile ? 'gap-0' : ''}`}
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
          <button className="btn-outline" type="button" onClick={onBack}>
            Volver
          </button>
          <button className="btn-primary" type="submit">
            Calcular rentabilidad <ChevronRight size={isMobile ? 16 : 18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimulationForm;
