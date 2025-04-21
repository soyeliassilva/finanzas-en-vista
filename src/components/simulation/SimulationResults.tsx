
import React from 'react';
import { Mail } from 'lucide-react';
import { SimulationResult } from '@/types';
import { formatCurrency } from '@/utils/calculator';
import SimulationSummary from '@/pages/SimulationSummary';
import SimulationChart from '@/pages/SimulationChart';

interface SimulationResultsProps {
  results: SimulationResult[];
  chartData: any[];
  calculationPerformed: boolean;
  getTotalAmount: () => number;
  handleContactAdvisor: () => void;
}

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

const SimulationResults: React.FC<SimulationResultsProps> = ({
  results,
  chartData,
  calculationPerformed,
  getTotalAmount,
  handleContactAdvisor
}) => {
  if (!calculationPerformed || results.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <SimulationSummary results={results} handleContactAdvisor={handleContactAdvisor} />
        <SimulationChart results={results} chartData={chartData} getTotalAmount={getTotalAmount} />
      </div>

      <div className="step-container">
        <h3 className="text-xl font-bold mb-4">Resumen de los productos comparados</h3>
        <div className="overflow-x-auto">
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1fr) repeat(5, minmax(120px, 1fr))',
            gap: 0,
            width: '100%',
          }}>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Productos</div>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Rentabilidad</div>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Saldo acum.</div>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Intereses generados</div>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Fiscalidad</div>
            <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Más info</div>

            {results.map((result, index) => (
              <React.Fragment key={result.productId}>
                <div className="flex items-center gap-2 py-2 px-4 border-b border-neutral">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                  {result.name}
                </div>
                <div className="py-2 px-4 border-b border-neutral flex items-center">{result.yield}%</div>
                <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.finalAmount)}</div>
                <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.generatedInterest)}</div>
                <div className="py-2 px-4 border-b border-neutral flex items-center">{result.taxation}</div>
                <div className="py-2 px-4 border-b border-neutral flex items-center">
                  {result.url && (
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      Más info
                    </a>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="btn-primary" onClick={handleContactAdvisor}>
            Contacta con nuestro gestor <Mail size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
