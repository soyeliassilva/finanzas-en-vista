
import React, { useRef, useEffect } from 'react';
import { SimulationResult } from '../../types';
import SimulationChart from '../../pages/SimulationChart';
import SimulationSummary from '../../pages/SimulationSummary';
import { useChartDataGenerator } from '../../hooks/useChartDataGenerator';
import { useResponsiveHeights } from '../../hooks/useResponsiveHeights';
import { ChevronLeft } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
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
  const { updateIframeHeight } = useSimulator();
  const isMobile = useIsMobile();
  
  // Update iframe height once when results component is fully rendered
  useEffect(() => {
    if (calculationPerformed && results.length > 0) {
      // Single timeout to ensure chart is rendered
      const timer = setTimeout(() => {
        updateIframeHeight("simulation_results");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [calculationPerformed, results.length, updateIframeHeight]);

  if (!calculationPerformed || results.length === 0) {
    return null;
  }

  return (
    <div ref={resultsRef} className="animate-fade-in">
      <div className="mb-4 md:mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 4</h3>
        <h2 className="text-2xl md:text-3xl text-primary mb-3 md:mb-4">
          Resultados de tu simulación
        </h2>
      </div>
      
      {isMobile ? (
        // Mobile layout: Chart on top, Summary below
        <div className="flex flex-col space-y-4">
          <div className="step-container">
            <SimulationChart 
              results={results} 
              chartData={chartData} 
              getTotalAmount={() => getTotalAmount(results)}
              summaryHeight={null}
              forceMobileHeight={300}
            />
          </div>
          
          <div className="step-container">
            <SimulationSummary 
              results={results} 
              handleContactAdvisor={handleContactAdvisor}
              ref={summaryRef} 
            />
          </div>
        </div>
      ) : (
        // Desktop layout: Grid with columns
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:grid-flow-col auto-rows-fr">
          <SimulationSummary 
            results={results} 
            handleContactAdvisor={handleContactAdvisor}
            ref={summaryRef} 
          />
          <SimulationChart 
            results={results} 
            chartData={chartData} 
            getTotalAmount={() => getTotalAmount(results)}
            summaryHeight={summaryHeight} 
          />
        </div>
      )}
      
      <div className="mt-4 md:mt-6">
        <button className="btn-outline py-1.5 md:py-2" type="button" onClick={handleBack}>
          <ChevronLeft size={isMobile ? 16 : 18} /> Volver a la simulación
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;
