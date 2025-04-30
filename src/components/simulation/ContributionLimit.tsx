
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

  return (
    <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
      {isPIASMutualidad && (
        <p className="font-semibold mb-1">
          Límite de aportación anual: 8.000€
        </p>
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
      
      {isPIASMutualidad && (
        <p className="mt-1 text-xs italic">
          En el primer año, la suma de aportación inicial y mensual está limitada a 8.000€.
          Las aportaciones mensuales se reanudarán en el segundo año.
        </p>
      )}
    </div>
  );
};

export default ContributionLimit;
