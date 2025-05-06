
import React from 'react';
import { Product } from '../../types';
import { formatPercentage } from '../../utils/calculator';

interface YieldRatesInfoProps {
  product: Product;
  appliedYield: number;
}

const YieldRatesInfo: React.FC<YieldRatesInfoProps> = ({ product, appliedYield }) => {
  if (!product.yield5PlusYears && !product.yield10PlusYears) {
    return null;
  }

  return (
    <div className="mb-3 px-3 py-2 bg-primary/10 rounded-md text-xs">
      <p className="font-semibold mb-1">Rentabilidad aplicada: {formatPercentage(appliedYield).replace(' %', '%')}</p>
      <ul className="list-disc list-inside">
        {product.yield !== undefined && <li>Base: {formatPercentage(product.yield).replace(' %', '%')}</li>}
        {product.yield5PlusYears !== undefined && <li>Plazo ≥ 5 años: {formatPercentage(product.yield5PlusYears).replace(' %', '%')}</li>}
        {product.yield10PlusYears !== undefined && <li>Plazo ≥ 10 años: {formatPercentage(product.yield10PlusYears).replace(' %', '%')}</li>}
      </ul>
    </div>
  );
};

export default YieldRatesInfo;
