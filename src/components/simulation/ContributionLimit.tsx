
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

  // For PIAS Mutualidad, calculate total first year contribution
  const firstYearContribution = isPIASMutualidad ? 
    Math.min(product.minInitialDeposit + (product.minMonthlyDeposit * 12), 8000) : 0;
    
  return (
    <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
      {isPIASMutualidad && (
        <>
          <p className="font-semibold mb-1">
            Límite de aportación anual: 8.000€
          </p>
          <p className="mt-1 text-xs italic">
            En el primer año, la suma de aportación inicial y mensual está limitada a 8.000€.
            {product.minInitialDeposit >= 8000 && 
              ' Como la aportación inicial es de 8.000€ o más, no habrá aportaciones mensuales en el primer año.'}
            {product.minInitialDeposit < 8000 && 
              ' Las aportaciones mensuales se reanudarán en el segundo año si se alcanza este límite.'}
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
