
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
  if (!product.maxTotalContribution) {
    return null;
  }

  return (
    <div className={`text-xs p-2 rounded mt-2 ${exceedsMaxContribution ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
      <p className="font-semibold">Aportación máxima total: {product.maxTotalContribution.toLocaleString()}€</p>
      <p>
        Aportación planificada: {totalPlannedContribution.toLocaleString()}€ 
        {exceedsMaxContribution && ' (se respetará el límite máximo en los cálculos)'}
      </p>
    </div>
  );
};

export default ContributionLimit;
