
import React from 'react';
import { SimulationResult } from '../../types';
import { formatCurrency } from '../../utils/calculator';

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

interface SimulationResultsTableProps {
  results: SimulationResult[];
}

const SimulationResultsTable: React.FC<SimulationResultsTableProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(180px, 1fr) repeat(5, minmax(120px, 1fr))',
          gap: 0,
          width: '100%',
        }}
      >
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Productos</div>
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Rentabilidad</div>
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Saldo acum.</div>
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Intereses generados</div>
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Fiscalidad</div>
        <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Más info</div>
        
        {results.map((result, index) => (
          <div key={result.productId} className="contents">
            <div className="flex items-center gap-2 py-2 px-4 border-b border-neutral">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              ></div>
              {result.name}
            </div>
            <div className="py-2 px-4 border-b border-neutral flex items-center">{result.yield}%</div>
            <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.finalAmount)}</div>
            <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.generatedInterest)}</div>
            <div className="py-2 px-4 border-b border-neutral flex items-center">{result.taxation}</div>
            <div className="py-2 px-4 border-b border-neutral flex items-center">
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Más info
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationResultsTable;
