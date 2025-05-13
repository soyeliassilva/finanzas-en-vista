
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { formatNumber, formatPercentage } from '../utils/calculator';
import { useIsMobile } from '../hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { useSimulator } from '../context/SimulatorContext';
import { useIframeResizer } from '../hooks/useIframeResizer';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle }) => {
  const isMobile = useIsMobile();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { sendHeight } = useIframeResizer();
  
  // Update iframe height when accordion is opened/closed
  useEffect(() => {
    if (isMobile && isDetailsOpen !== null) {
      // Small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        sendHeight("init");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isDetailsOpen, isMobile, sendHeight]);
  
  // Truncate text with ellipsis at the word level
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    const truncated = text.substring(0, limit).split(' ').slice(0, -1).join(' ');
    return `${truncated}...`;
  };
  
  // Display yield information
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
  
  // For mobile accordion view
  if (isMobile) {
    // Create a truncated version of the product description
    const truncatedDescription = truncateText(product.description, 80);
    
    return (
      <div
        className={`product-card relative flex flex-col ${isSelected ? 'border-2 border-primary' : 'border border-neutral'}`}
      >
        <h3 className="text-lg font-bold mb-1">{product.name}</h3>
        
        <Collapsible
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          className="w-full flex-grow flex flex-col"
        >
          {!isDetailsOpen && (
            <>
              <div className="mb-2 hidden">
                <p className="text-sm">{truncatedDescription}</p>
              </div>
              
              <CollapsibleTrigger className="flex items-center justify-center w-full bg-neutral/20 text-primary py-1 rounded-md">
                <span className="text-xs font-medium mr-1">Ver detalles</span>
                <ChevronDown size={14} />
              </CollapsibleTrigger>
            </>
          )}
          
          <CollapsibleContent className="space-y-2 mt-3 animate-accordion-down">
            <p className="text-sm mb-2 hidden">{product.description}</p>
            
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
              {displayYield()}
            </div>
            
            {product.conditions && (
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                <p className="text-sm">{product.conditions}</p>
              </div>
            )}
            {product.terms && !product.product_yield_description && (
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                <p className="text-sm">{product.terms}</p>
              </div>
            )}
            {product.disclaimer && (
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                <p className="text-sm">{product.disclaimer}</p>
              </div>
            )}
            
            {/* Button at the bottom when expanded */}
            <CollapsibleTrigger className="flex items-center justify-center w-full bg-neutral/20 text-primary py-1 rounded-md mt-4">
              <span className="text-xs font-medium mr-1">Ver menos</span>
              <ChevronDown size={14} className="transform rotate-180" />
            </CollapsibleTrigger>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="mt-auto pt-2">
          <button
            className={isSelected ? "btn-primary w-full justify-center py-1.5" : "btn-outline w-full justify-center py-1.5"}
            onClick={() => onToggle(product)}
          >
            {isSelected ? 'Producto seleccionado' : (
              <>Seleccionar producto <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    );
  }
  
  // Desktop view (original design)
  return (
    <div
      className={`product-card relative flex flex-col ${isSelected ? 'border-2 border-primary' : 'border border-neutral'}`}
      style={{ minHeight: 'auto' }}
    >
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-sm mb-4">{product.description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-start">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
          {displayYield()}
        </div>
        {product.conditions && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
            <p className="text-sm">{product.conditions}</p>
          </div>
        )}
        {product.terms && !product.product_yield_description && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
            <p className="text-sm">{product.terms}</p>
          </div>
        )}
        {product.disclaimer && (
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
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
