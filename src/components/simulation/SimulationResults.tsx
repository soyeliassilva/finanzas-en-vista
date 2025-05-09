
import React, { useRef, useEffect } from 'react';
import { SimulationResult } from '../../types';
import SimulationChart from '../../pages/SimulationChart';
import SimulationSummary from '../../pages/SimulationSummary';
import { useChartDataGenerator } from '../../hooks/useChartDataGenerator';
import { useResponsiveHeights } from '../../hooks/useResponsiveHeights';
import { ChevronLeft } from 'lucide-react';
import { useIframeNavigation } from '../../hooks/useIframeNavigation';

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
  const { sendHeight } = useIframeNavigation();
  
  // Update iframe height when results are calculated
  useEffect(() => {
    if (calculationPerformed && results.length > 0) {
      // Wait for chart to render
      const timer = setTimeout(() => {
        sendHeight();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [calculationPerformed, results.length, sendHeight]);

  const handleBackClick = () => {
    handleBack();
    sendHeight();
  };

  if (!calculationPerformed || results.length === 0) {
    return null;
  }

  return (
    <div ref={resultsRef}>
      <div className="mb-6">
        <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 4</h3>
        <h2 className="text-3xl text-primary mb-4">
          Resultados de tu simulación
        </h2>
      </div>
      
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
      
      <div className="mt-6">
        <button className="btn-outline" type="button" onClick={handleBackClick}>
          <ChevronLeft size={18} /> Volver a la simulación
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;
