
import React from 'react';
import { Product } from '../../types';

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
      <p className="font-semibold mb-1">Rentabilidad aplicada: {appliedYield}%</p>
      <ul className="list-disc list-inside">
        {product.yield !== undefined && <li>Base: {product.yield}%</li>}
        {product.yield5PlusYears !== undefined && <li>Plazo ≥ 5 años: {product.yield5PlusYears}%</li>}
        {product.yield10PlusYears !== undefined && <li>Plazo ≥ 10 años: {product.yield10PlusYears}%</li>}
      </ul>
    </div>
  );
};

export default YieldRatesInfo;
