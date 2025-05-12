
import React from 'react';
import { Product } from '../../types';
import { formatNumber } from '../../utils/calculator';

interface ContributionLimitProps {
  product: Product;
  totalPlannedContribution: number;
  exceedsMaxContribution: boolean;
}

const ContributionLimit: React.FC<ContributionLimitProps> = ({ 
  product, 
  totalPlannedContribution, 
  exceedsMaxContribution 
}) => {
  // Product IDs
  const PIAS_MUTUALIDAD_ID = "6d65d7f1-835d-4e19-8625-b61abd881c4c";
  const PLAN_AHORRO_5_ID = "dec278a6-e9ed-4e9b-84aa-7306d19b173e";
  
  // Check which product we're dealing with
  const isPIASMutualidad = product.id === PIAS_MUTUALIDAD_ID;
  const isPlanAhorro5 = product.id === PLAN_AHORRO_5_ID;
  
  // Get the appropriate annual limit
  const hasAnnualLimit = isPIASMutualidad || isPlanAhorro5;
  const annualLimit = isPIASMutualidad ? 8000 : isPlanAhorro5 ? 5000 : 0;
  
  if (!hasAnnualLimit && !product.maxTotalContribution) {
    return null;
  }

  // For products with annual limit, calculate available contribution room in first year
  const firstYearAllowance = hasAnnualLimit ? Math.max(0, annualLimit - product.minInitialDeposit) : 0;
  
  // Calculate potential monthly contributions based on the allowance
  const potentialMonthsWithContributions = product.minMonthlyDeposit > 0 
    ? Math.floor(firstYearAllowance / product.minMonthlyDeposit)
    : 0;
    
  return (
    <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
      {hasAnnualLimit && (
        <>
          <p className="font-semibold mb-1">
            Límite de aportación anual: {formatNumber(annualLimit)}€
          </p>
          <p className="mt-1 text-xs">
            En el primer año, la suma de aportación inicial y mensual está limitada a {formatNumber(annualLimit)}€.
          </p>
          {product.minInitialDeposit >= annualLimit && (
            <p className="mt-1 text-xs italic">
              Con una aportación inicial de {formatNumber(product.minInitialDeposit)}€, 
              no habrá aportaciones mensuales durante el primer año.
            </p>
          )}
          {product.minInitialDeposit < annualLimit && product.minMonthlyDeposit > 0 && (
            <p className="mt-1 text-xs italic">
              {firstYearAllowance % product.minMonthlyDeposit !== 0 && potentialMonthsWithContributions < 12 && (
                `La última aportación será parcial de ${formatNumber(firstYearAllowance % product.minMonthlyDeposit)}€.`
              )}
            </p>
          )}
          <p className="mt-1 text-xs">
            A partir del segundo año, las aportaciones mensuales se reanudarán normalmente.
          </p>
        </>
      )}
      
      {product.maxTotalContribution && (
        <>
          <p className="font-semibold">Aportación máxima total: {formatNumber(product.maxTotalContribution)}€</p>
          <p>
            Aportación planificada: {formatNumber(totalPlannedContribution)}€ 
            {exceedsMaxContribution && ' (se respetará el límite máximo en los cálculos)'}
          </p>
        </>
      )}
    </div>
  );
};

export default ContributionLimit;
