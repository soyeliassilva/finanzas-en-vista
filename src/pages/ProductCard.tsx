
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
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
          <p className="text-sm">
            {isPlanAhorroMultiplica 
              ? "Plazo: 1 año" 
              : `Plazo: ${minTermYears} ${minTermYears === 1 ? 'año' : 'años'} o más`}
          </p>
        </div>
        {product.product_initial_contribution_min > 0 && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">
              Aportación inicial desde {product.product_initial_contribution_min}€
            </p>
          </div>
        )}
        {(product.product_monthly_contribution_min !== 0 || 
          (product.product_monthly_contribution_max !== null && 
           product.product_monthly_contribution_max !== undefined)) && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">
              {product.product_monthly_contribution_min !== 0
                ? `Aportaciones mensuales desde ${product.product_monthly_contribution_min}€`
                : product.product_monthly_contribution_max === null || product.product_monthly_contribution_max === undefined
                ? "Aportaciones mensuales sin límites"
                : `Con aportaciones mensuales de hasta ${product.product_monthly_contribution_max}€`}
            </p>
          </div>
        )}
        {product.product_total_contribution_max && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
            <p className="text-sm">
              Contribución máxima: {product.product_total_contribution_max.toLocaleString()}€
            </p>
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
