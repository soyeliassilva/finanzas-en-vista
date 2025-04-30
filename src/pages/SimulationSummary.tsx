
import React, { forwardRef } from "react";
import { SimulationResult } from "../types";
import { formatCurrency } from "../utils/calculator";
import { Mail } from "lucide-react";

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

interface SimulationSummaryProps {
  results: SimulationResult[];
  handleContactAdvisor: () => void;
}

const SimulationSummary = forwardRef<HTMLDivElement, SimulationSummaryProps>(
  ({ results, handleContactAdvisor }, ref) => (
    <div className="md:col-span-5 step-container h-full" ref={ref}>
      <h3 className="text-xl font-bold mb-4">Resumen del producto</h3>

      {results.map((result, index) => (
        <div key={result.productId} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
            <h4 className="text-lg font-bold">{result.name}</h4>
          </div>
          
          <div className="ml-5 space-y-2">
            <div className="flex justify-between">
              <span>Aportación total</span>
              <span className="font-bold">{formatCurrency(result.initialDeposit + Math.min(
                result.monthlyDeposit * result.termMonths,
                (result.maxTotalContribution ? result.maxTotalContribution - result.initialDeposit : Infinity)
              ))}</span>
            </div>

            <div className="flex justify-between">
              <span>Intereses brutos generados</span>
              <span className="font-bold">{formatCurrency(result.generatedInterest)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Importe total al rescate</span>
              <span className="font-bold">{formatCurrency(result.finalAmount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Rentabilidad</span>
              <span className="font-bold">{result.yield}%</span>
            </div>
            
            <div className="mt-2 text-sm">
              <p className="font-bold mb-1">Detalles fiscalidad del producto</p>
              <p>{result.taxation}</p>
            </div>

            {result.disclaimer && (
              <div className="mt-2 text-sm">
                <p className="font-bold mb-1">Información adicional</p>
                <p>{result.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mt-6">
        <button className="btn-primary w-full justify-center" onClick={handleContactAdvisor}>
          Contacta con nuestro gestor <Mail size={18} />
        </button>
      </div>
    </div>
  )
);

SimulationSummary.displayName = "SimulationSummary";

export default SimulationSummary;
