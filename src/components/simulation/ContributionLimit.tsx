
import React from 'react';
import { Product } from '../../types';

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
  // Special handling for PIAS Mutualidad - annual contribution limit
  const isPIASMutualidad = product.id === "pias-mutualidad";
  
  if (!product.maxTotalContribution && !isPIASMutualidad) {
    return null;
  }

  // For PIAS Mutualidad, calculate available contribution room in first year
  const firstYearAllowance = isPIASMutualidad ? Math.max(0, 8000 - product.minInitialDeposit) : 0;
  
  // Calculate potential monthly contributions based on the allowance
  const potentialMonthsWithContributions = product.minMonthlyDeposit > 0 
    ? Math.floor(firstYearAllowance / product.minMonthlyDeposit)
    : 0;
    
  return (
    <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
      {isPIASMutualidad && (
        <>
          <p className="font-semibold mb-1">
            Límite de aportación anual: 8.000€
          </p>
          <p className="mt-1 text-xs">
            En el primer año, la suma de aportación inicial y mensual está limitada a 8.000€.
          </p>
          {product.minInitialDeposit >= 8000 && (
            <p className="mt-1 text-xs italic">
              Con una aportación inicial de {product.minInitialDeposit.toLocaleString()}€, 
              no habrá aportaciones mensuales durante el primer año.
            </p>
          )}
          {product.minInitialDeposit < 8000 && product.minMonthlyDeposit > 0 && (
            <p className="mt-1 text-xs italic">
              Con una aportación inicial de {product.minInitialDeposit.toLocaleString()}€, 
              podrá realizar hasta {potentialMonthsWithContributions} {potentialMonthsWithContributions === 1 ? 'aportación mensual' : 'aportaciones mensuales'} 
              completas durante el primer año.
              {firstYearAllowance % product.minMonthlyDeposit !== 0 && potentialMonthsWithContributions < 12 && (
                ` La última aportación será parcial de ${(firstYearAllowance % product.minMonthlyDeposit).toLocaleString()}€.`
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
          <p className="font-semibold">Aportación máxima total: {product.maxTotalContribution.toLocaleString()}€</p>
          <p>
            Aportación planificada: {totalPlannedContribution.toLocaleString()}€ 
            {exceedsMaxContribution && ' (se respetará el límite máximo en los cálculos)'}
          </p>
        </>
      )}
    </div>
  );
};

export default ContributionLimit;
