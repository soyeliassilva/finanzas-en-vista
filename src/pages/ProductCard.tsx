import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { formatNumber, formatPercentage } from '../utils/calculator';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle }) => {
  // Determine which yield rate to display
  const displayYield = () => {
    // If product_yield_description exists, display it directly
    if (product.product_yield_description) {
      return (
        <p className="text-sm">{product.product_yield_description}</p>
      );
    }
    
    // Otherwise fall back to the original logic
    if (product.yield10PlusYears || product.yield5PlusYears) {
      let yieldText = `Rentabilidad: ${formatPercentage(product.yield).replace(' %', '%')}`;
      
      if (product.yield5PlusYears && product.yield10PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {formatPercentage(product.yield5PlusYears).replace(' %', '%')} a 5 años, {formatPercentage(product.yield10PlusYears).replace(' %', '%')} a 10 años)
          </p>
        );
      } else if (product.yield5PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {formatPercentage(product.yield5PlusYears).replace(' %', '%')} a 5 años)
          </p>
        );
      } else if (product.yield10PlusYears) {
        return (
          <p className="text-sm">
            {yieldText} (hasta {formatPercentage(product.yield10PlusYears).replace(' %', '%')} a 10 años)
          </p>
        );
      }
    }
    return <p className="text-sm">Rentabilidad: {formatPercentage(product.yield).replace(' %', '%')}</p>;
  };

  // Convert duration from months to years
  const minTermYears = product.product_duration_months_min 
    ? Math.ceil(product.product_duration_months_min / 12) 
    : 1;

  // Check if the product is Plan Ahorro Multiplica
  const isPlanAhorroMultiplica = product.id === "494eb328-e867-46a7-8f60-c7a4840c7f29";

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
        {isPlanAhorroMultiplica && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">Plazo: 1 año</p>
          </div>
        )}
        {product.product_total_contribution_max && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">
              Contribución máxima: {formatNumber(product.product_total_contribution_max)}€
            </p>
          </div>
        )}
        {product.conditions && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">{product.conditions}</p>
          </div>
        )}
        {product.terms && !product.product_yield_description && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">{product.terms}</p>
          </div>
        )}
        {product.disclaimer && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">{product.disclaimer}</p>
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
