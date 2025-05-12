
import React, { forwardRef } from "react";
import { SimulationResult } from "../types";
import { formatCurrency, formatPercentage, formatNumber } from "../utils/calculator";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useIsMobile } from "../hooks/use-mobile";

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

interface SimulationSummaryProps {
  results: SimulationResult[];
  handleContactAdvisor: () => void;
}

const SimulationSummary = forwardRef<HTMLDivElement, SimulationSummaryProps>(
  ({ results, handleContactAdvisor }, ref) => {
    const isMobile = useIsMobile();
    
    // Product IDs
    const PIAS_MUTUALIDAD_ID = "6d65d7f1-835d-4e19-8625-b61abd881c4c";
    const PLAN_AHORRO_5_ID = "dec278a6-e9ed-4e9b-84aa-7306d19b173e";
    
    return (
      <div className={isMobile ? "" : "md:col-span-5 h-full"} ref={ref}>
        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Resumen del producto</h3>

        {results.map((result, index) => {
          // Calculate the actual contributions based on limits
          // Check if product has annual contribution limit
          const hasAnnualLimit = result.productId === PIAS_MUTUALIDAD_ID || result.productId === PLAN_AHORRO_5_ID;
          const annualLimit = result.productId === PIAS_MUTUALIDAD_ID ? 8000 : result.productId === PLAN_AHORRO_5_ID ? 5000 : Infinity;
          
          let totalContributions = result.initialDeposit;
          
          if (hasAnnualLimit) {
            // For products with annual limit, calculate first year contributions (respecting the limit)
            const firstYearAllowance = Math.max(0, annualLimit - result.initialDeposit);
            
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
            <div key={result.productId} className="mb-3 md:mb-4">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div 
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" 
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                ></div>
                <h4 className="text-base md:text-lg font-bold">{result.name}</h4>
              </div>
              
              <div className="ml-4 md:ml-5 space-y-1 md:space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span>Aportación total</span>
                  <span className="font-bold">{formatCurrency(totalContributions)}</span>
                </div>

                <div className="flex justify-between text-sm md:text-base">
                  <span>Intereses brutos</span>
                  <span className="font-bold">{formatCurrency(result.generatedInterest)}</span>
                </div>
                
                <div className="flex justify-between text-sm md:text-base">
                  <span>Importe total bruto</span>
                  <span className="font-bold">{formatCurrency(result.finalAmount)}</span>
                </div>
                
                <div className="flex justify-between text-sm md:text-base">
                  <span>Rentabilidad</span>
                  <span className="font-bold">{formatPercentage(result.yield).replace(' %', '%')}</span>
                </div>
                
                <div className="mt-1 md:mt-2">
                  <Accordion type="single" collapsible className="border-0 p-0">
                    <AccordionItem value="taxation" className="border-0">
                      <AccordionTrigger className="p-0 h-5 md:h-6 flex justify-between items-center">
                        <span className="font-mutualidad text-xs md:text-sm">Detalles fiscalidad del producto</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm pt-1">
                        {result.taxation}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-4 md:mt-6">
          <button 
            className="btn-primary w-full justify-center py-1.5 md:py-2" 
            onClick={handleContactAdvisor}
          >
            Contacta con nuestro gestor <Mail size={isMobile ? 16 : 18} />
          </button>
        </div>
      </div>
    )
  }
);

SimulationSummary.displayName = "SimulationSummary";

export default SimulationSummary;
