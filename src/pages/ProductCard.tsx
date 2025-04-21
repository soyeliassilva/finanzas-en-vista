
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle }) => (
  <div
    className={`product-card relative flex flex-col ${isSelected ? 'border-2 border-primary' : 'border border-neutral'}`}
    style={{ minHeight: '320px' }}
  >
    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
    <p className="text-sm mb-4">{product.description}</p>
    <div className="space-y-2 mb-4">
      <div className="flex items-start">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
        <p className="text-sm">{product.yield}% de rentabilidad a cuenta</p>
      </div>
      <div className="flex items-start">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
        {product.minTerm === 1 ? (
          <p className="text-sm">Plazo: {product.minTerm} año</p>
        ) : (
          <p className="text-sm">
            Plazo: {product.minTerm} - {product.maxTerm || '∞'} años
          </p>
        )}
      </div>
      <div className="flex items-start">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
        <p className="text-sm">
          Aportaciones desde {product.minMonthlyDeposit}€
          {product.minInitialDeposit > 0 && ` (inicial: ${product.minInitialDeposit}€)`}
        </p>
      </div>
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

export default ProductCard;

