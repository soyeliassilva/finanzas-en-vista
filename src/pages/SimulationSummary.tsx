
import React from "react";
import { SimulationResult } from "../types";
import { formatCurrency } from "../utils/calculator";
import { Mail } from "lucide-react";

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

interface SimulationSummaryProps {
  results: SimulationResult[];
  handleContactAdvisor: () => void;
}

const columnLabels = [
  "Productos",
  "Rentabilidad",
  "Saldo acum.",
  "Intereses generados",
  "Fiscalidad",
  "Más info"
];

const SimulationSummary: React.FC<SimulationSummaryProps> = ({ results, handleContactAdvisor }) => (
  <div className="md:col-span-5 step-container">
    <h3 className="text-xl font-bold mb-4">Resumen del producto</h3>

    {results.map((result, index) => (
      <div key={result.productId} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
          <h4 className="text-lg font-bold">{result.name}</h4>
        </div>
        <div className="ml-5 space-y-2">
          <div className="flex justify-between">
            <span>Importe total al rescate</span>
            <span className="font-bold">{formatCurrency(result.finalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Rentabilidad</span>
            <span className="font-bold">{result.yield}%</span>
          </div>
          <div className="flex justify-between">
            <span>Intereses brutos generados</span>
            <span className="font-bold">{formatCurrency(result.generatedInterest)}</span>
          </div>
          <div className="mt-2 text-sm">
            <p className="font-bold mb-1">Detalles fiscalidad del producto</p>
            <p>{result.taxation}</p>
          </div>
        </div>
      </div>
    ))}
    <div className="mt-6">
      <button className="btn-primary w-full justify-center" onClick={handleContactAdvisor}>
        Contacta con nuestro gestor <Mail size={18} />
      </button>
    </div>
    {/* --- Grid Summary --- */}
    <h3 className="text-xl font-bold mb-4 mt-10">Resumen de los productos comparados</h3>
    <div className="overflow-x-auto w-full">
      {/* Header */}
      <div className="simulation-summary-grid simulation-summary-header">
        {columnLabels.map(label => (
          <div className="simulation-summary-cell" key={label}>{label}</div>
        ))}
      </div>
      {/* Rows */}
      {results.map((result, index) => (
        <div key={result.productId} className="simulation-summary-grid simulation-summary-row">
          <div className="simulation-summary-cell">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: chartColors[index % chartColors.length] }}
            ></div>
            <span>{result.name}</span>
          </div>
          <div className="simulation-summary-cell">{result.yield}%</div>
          <div className="simulation-summary-cell">{formatCurrency(result.finalAmount)}</div>
          <div className="simulation-summary-cell">{formatCurrency(result.generatedInterest)}</div>
          <div className="simulation-summary-cell">{result.taxation}</div>
          <div className="simulation-summary-cell">
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
    <div className="mt-8 flex justify-center">
      <button className="btn-primary" onClick={handleContactAdvisor}>
        Contacta con nuestro gestor <Mail size={18} />
      </button>
    </div>
  </div>
);

export default SimulationSummary;
