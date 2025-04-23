
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle }) => {
  const [showDebug, setShowDebug] = useState(false);

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
      data-product-id={product.id}
    >
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        {product.name}
        {/* Badge if overridden */}
        {Array.isArray((product as any).__overriddenFields) && (product as any).__overriddenFields.length > 0 && (
          <span className="ml-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded">
            Override
          </span>
        )}
      </h3>
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

      {/* Debug overrides details */}
      {Array.isArray((product as any).__overriddenFields) && (product as any).__overriddenFields.length > 0 && (
        <div className="mb-2">
          <button className="text-xs text-blue-700 underline cursor-pointer mb-1" onClick={() => setShowDebug((s) => !s)}>
            {showDebug ? "Ocultar detalles de override" : "Mostrar detalles de override"}
          </button>
          <ul className="text-xs text-neutral-700 mt-1">
            {((product as any).__overriddenFields as string[]).map(f => (
              <li key={f}>
                <span className="font-mono">{f}</span>
                {((product as any)[f] !== undefined) ? (
                  <>: <span className="font-mono">{JSON.stringify((product as any)[f])}</span></>
                ) : null}
              </li>
            ))}
          </ul>
          {showDebug && (
            <div className="mt-1 p-2 bg-neutral-100 border rounded text-xs font-mono overflow-auto max-h-40">
              <pre>{JSON.stringify(product, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
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
