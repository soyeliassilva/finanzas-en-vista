
import React from 'react';
import { useIframeResizer } from '../hooks/useIframeResizer';

interface ProductSelectionHeaderProps {
  onBack: () => void;
}

const ProductSelectionHeader: React.FC<ProductSelectionHeaderProps> = ({ onBack }) => {
  const { sendHeight } = useIframeResizer();
  
  const handleBack = () => {
    onBack();
    // Send height update after navigation
    setTimeout(() => sendHeight(), 100);
  };
  
  return (
    <div className="md:col-span-4 step-container">
      <div className="mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
        <h2 className="text-3xl text-primary mb-4">Objetivo de ahorro</h2>
        <p className="text-sm">
          Selecciona tu objetivo y compara productos para maximizar tus beneficios
        </p>
      </div>
      <div className="mt-4">
        <button className="btn-outline w-full justify-center" onClick={handleBack}>
          Volver a selección de objetivos
        </button>
      </div>
    </div>
  );
};

interface Step2InstructionsProps {
  show: boolean;
}

export const Step2Instructions: React.FC<Step2InstructionsProps> = ({ show }) =>
  show ? (
    <h3 className="text-lg font-bold mb-4">
      Elige hasta 3 productos
    </h3>
  ) : null;

export default ProductSelectionHeader;
