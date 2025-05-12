
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface StepsHeaderProps {
  currentStep: number;
}

const StepsHeader: React.FC<StepsHeaderProps> = ({ currentStep }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto mb-4 mt-6 md:mt-8">
      <h1 className={`text-primary ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4 md:mb-6`}>
        Simulador de Ahorro e Inversión
      </h1>
    </div>
  );
};

export default StepsHeader;
