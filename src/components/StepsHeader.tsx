
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface StepsHeaderProps {
  currentStep: number;
}

const StepsHeader: React.FC<StepsHeaderProps> = ({ currentStep }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto mb-3 mt-4 md:mt-8 md:mb-4">
      <h1 className={`text-primary px-3 md:px-0 ${isMobile ? 'text-xl' : 'text-3xl'} mb-2 md:mb-6`}>
        Simulador de Ahorro e Inversión
      </h1>
    </div>
  );
};

export default StepsHeader;
