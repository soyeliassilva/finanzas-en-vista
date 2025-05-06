
import React, { forwardRef } from "react";
import { SimulationResult } from "../types";
import { formatCurrency, formatPercentage } from "../utils/calculator";
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

      {results.map((result, index) => {
        // Calculate the actual contributions based on limits
        const isPIASMutualidad = result.productId === "6d65d7f1-835d-4e19-8625-b61abd881c4c";
        let totalContributions = result.initialDeposit;
        
        if (isPIASMutualidad) {
          // For PIAS Mutualidad, calculate first year contributions (respecting 8000€ limit)
          const firstYearAllowance = Math.max(0, 8000 - result.initialDeposit);
          
          // Calculate how many months will have contributions in the first year
          let contributingMonthsFirstYear = 0;
          let actualFirstYearMonthlyTotal = 0;
          
          if (result.monthlyDeposit > 0 && firstYearAllowance > 0) {
            contributingMonthsFirstYear = Math.min(12, Math.ceil(firstYearAllowance / result.monthlyDeposit));
            
            // Handle partial contribution for the last contributing month
            if (firstYearAllowance % result.monthlyDeposit !== 0 && firstYearAllowance < result.monthlyDeposit * contributingMonthsFirstYear) {
              const fullMonths = Math.floor(firstYearAllowance / result.monthlyDeposit);
              const partialAmount = firstYearAllowance % result.monthlyDeposit;
              actualFirstYearMonthlyTotal = (fullMonths * result.monthlyDeposit) + partialAmount;
            } else {
              actualFirstYearMonthlyTotal = Math.min(firstYearAllowance, contributingMonthsFirstYear * result.monthlyDeposit);
            }
          }
          
          // Remaining years with full monthly contributions
          const remainingYears = result.termYears - 1;
          const remainingContributions = remainingYears * 12 * result.monthlyDeposit;
          
          totalContributions += actualFirstYearMonthlyTotal + remainingContributions;
        } else if (result.maxTotalContribution) {
          // For products with max total contribution
          totalContributions += Math.min(
            result.monthlyDeposit * result.termMonths,
            Math.max(0, result.maxTotalContribution - result.initialDeposit)
          );
        } else {
          // For products with no limits
          totalContributions += result.monthlyDeposit * result.termMonths;
        }
        
        return (
          <div key={result.productId} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
              <h4 className="text-lg font-bold">{result.name}</h4>
            </div>
            
            <div className="ml-5 space-y-2">
              <div className="flex justify-between">
                <span>Aportación total</span>
                <span className="font-bold">{formatCurrency(totalContributions)}</span>
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
                <span className="font-bold">{formatPercentage(result.yield).replace(' %', '%')}</span>
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
        );
      })}

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
