
import React, { useRef } from 'react';
import { SimulationResult } from '../../types';
import SimulationChart from '../../pages/SimulationChart';
import SimulationSummary from '../../pages/SimulationSummary';
import { useChartDataGenerator } from '../../hooks/useChartDataGenerator';
import { useResponsiveHeights } from '../../hooks/useResponsiveHeights';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface SimulationResultsProps {
  results: SimulationResult[];
  calculationPerformed: boolean;
  handleContactAdvisor: () => void;
  handleBack: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  results, 
  calculationPerformed, 
  handleContactAdvisor,
  handleBack
}) => {
  const { generateChartData, getTotalAmount } = useChartDataGenerator();
  const { summaryRef, summaryHeight } = useResponsiveHeights(calculationPerformed);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chartData = generateChartData(results);
  const isMobile = useIsMobile();

  if (!calculationPerformed || results.length === 0) {
    return null;
  }

  return (
    <div ref={resultsRef} className="animate-fade-in results-container no-scrollbar overflow-hidden">
      <div className="mb-4 md:mb-6 px-3 md:px-0">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 4</h3>
        <h2 className="text-2xl md:text-3xl text-primary mb-3 md:mb-4">
          Resultados de tu simulación
        </h2>
      </div>
      
      {isMobile ? (
        // Mobile layout: Chart on top, Summary below, with 0 gap
        <div className="flex flex-col space-y-0 no-scrollbar overflow-hidden">
          <div className="step-container min-w-0">
            <SimulationChart 
              results={results} 
              chartData={chartData} 
              getTotalAmount={() => getTotalAmount(results)}
              summaryHeight={null}
              forceMobileHeight={300}
            />
          </div>
          
          <div className="step-container min-w-0">
            <SimulationSummary 
              results={results} 
              handleContactAdvisor={handleContactAdvisor}
              ref={summaryRef} 
            />
          </div>
        </div>
      ) : (
        // Desktop layout: Flexible layout with proper zoom support
        <div className="flex gap-4 md:gap-6 h-full no-scrollbar overflow-hidden min-w-0">
          <div className="flex-shrink-0 min-w-0 w-full max-w-[42%]">
            <SimulationSummary 
              results={results} 
              handleContactAdvisor={handleContactAdvisor}
              ref={summaryRef} 
            />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <SimulationChart 
              results={results} 
              chartData={chartData} 
              getTotalAmount={() => getTotalAmount(results)}
              summaryHeight={summaryHeight} 
            />
          </div>
        </div>
      )}
      
      <div className="mt-4 md:mt-6 px-3 md:px-0">
        <button className="btn-outline py-1.5 md:py-2" type="button" onClick={handleBack}>
          <ChevronLeft size={isMobile ? 16 : 18} /> Volver a la simulación
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;
