
import React from 'react';

interface StepsHeaderProps {
  currentStep: number;
}

const StepsHeader: React.FC<StepsHeaderProps> = ({ currentStep }) => {
  return (
    <div className="container mx-auto mb-4 mt-8">
      <h1 className="text-primary text-3xl mb-6">Simulador de Ahorro e Inversión</h1>
    </div>
  );
};

export default StepsHeader;
