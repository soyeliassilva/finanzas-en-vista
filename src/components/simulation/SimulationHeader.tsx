
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SimulationHeaderProps {
  handleBack: () => void;
  handleCalculate: () => void;
}

const SimulationHeader: React.FC<SimulationHeaderProps> = ({ handleBack, handleCalculate }) => {
  return (
    <div className="step-container active-step mb-6">
      <div className="mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 3</h3>
        <h2 className="text-3xl text-primary mb-4">
          Descubre la rentabilidad de los productos seleccionados
        </h2>
      </div>

      <div className="flex justify-between">
        <button className="btn-outline" type="button" onClick={handleBack}>
          Volver
        </button>
        <button className="btn-primary" type="submit">
          Calcular rentabilidad <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SimulationHeader;
