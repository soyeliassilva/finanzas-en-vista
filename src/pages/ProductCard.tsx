import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle }) => {
  // Determine which yield rate to display
  const displayYield = () => {
    if (product.yield10PlusYears || product.yield5PlusYears) {
      let yieldText = `${product.yield}% de rentabilidad`;
      
      if (product.yield5PlusYears && product.yield10PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {product.yield5PlusYears}% a 5 años, {product.yield10PlusYears}% a 10 años)
          </p>
        );
      } else if (product.yield5PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {product.yield5PlusYears}% a partir de 5 años)
          </p>
        );
      } else if (product.yield10PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {product.yield10PlusYears}% a partir de 10 años)
          </p>
        );
      }
    }
    return <p className="text-sm">{product.yield}% de rentabilidad a cuenta</p>;
  };

  // Convert duration from months to years
  const minTermYears = product.product_duration_months_min 
    ? Math.ceil(product.product_duration_months_min / 12) 
    : 1;

  return (
    <div
      className={`product-card relative flex flex-col ${isSelected ? 'border-2 border-primary' : 'border border-neutral'}`}
      style={{ minHeight: '320px' }}
    >
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-sm mb-4">{product.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
          {displayYield()}
        </div>
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
          <p className="text-sm">
            Plazo: {minTermYears} {minTermYears === 1 ? 'año' : 'años'} o más
          </p>
        </div>
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
          <p className="text-sm">
            Aportaciones desde {product.minMonthlyDeposit}€
            {product.minInitialDeposit > 0 && ` (inicial: ${product.minInitialDeposit}€)`}
          </p>
        </div>
        {product.maxTotalContribution && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">Aportación máxima total: {product.maxTotalContribution.toLocaleString()}€</p>
          </div>
        )}
        {product.conditions && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">{product.conditions}</p>
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <button
          className={isSelected ? "btn-primary w-full justify-center" : "btn-outline w-full justify-center"}
          onClick={() => onToggle(product)}
        >
          {isSelected ? 'Producto seleccionado' : <>Seleccionar producto <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
