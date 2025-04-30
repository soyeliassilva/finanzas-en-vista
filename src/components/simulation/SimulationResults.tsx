
import React, { useRef } from 'react';
import { SimulationResult } from '../../types';
import SimulationChart from '../../pages/SimulationChart';
import SimulationSummary from '../../pages/SimulationSummary';
import { useChartDataGenerator } from '../../hooks/useChartDataGenerator';
import { useResponsiveHeights } from '../../hooks/useResponsiveHeights';

interface SimulationResultsProps {
  results: SimulationResult[];
  calculationPerformed: boolean;
  handleContactAdvisor: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  results, 
  calculationPerformed, 
  handleContactAdvisor 
}) => {
  const { generateChartData, getTotalAmount } = useChartDataGenerator();
  const { summaryRef, summaryHeight } = useResponsiveHeights(calculationPerformed);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chartData = generateChartData(results);

  if (!calculationPerformed || results.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in" ref={resultsRef}>
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
    </div>
  );
};

export default SimulationResults;
