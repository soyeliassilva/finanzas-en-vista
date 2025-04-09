
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType, Product } from '../types';
import { ChevronRight } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

interface ProductSelectionProps {
  selectedGoal: GoalType | null;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ 
  selectedGoal, 
  selectedProducts, 
  setSelectedProducts
}) => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { availableProducts, isLoading } = useSimulator();
  
  useEffect(() => {
    if (selectedGoal && availableProducts.length > 0) {
      const products = availableProducts.filter(product => product.goal === selectedGoal);
      setFilteredProducts(products);
    }
  }, [selectedGoal, availableProducts]);
  
  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      // Remove product
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      // Add product if less than 3 are selected
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };
  
  const handleContinue = () => {
    if (selectedProducts.length > 0) {
      navigate('/simulacion');
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const isSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="step-container">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4 step-container">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
          <h2 className="text-3xl text-primary mb-4">Objetivo de ahorro</h2>
          <p className="text-sm">
            Selecciona tu objetivo y compara productos para maximizar tus beneficios
          </p>
        </div>
        
        <div className="mt-4">
          <button className="btn-outline w-full justify-center" onClick={handleBack}>
            Volver a selección de objetivos
          </button>
        </div>
      </div>
      
      <div className="md:col-span-8 step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 2</h3>
          <h2 className="text-3xl text-primary mb-4">
            Compara los productos en función de tu objetivo
          </h2>
          <p className="text-sm">
            Elige los productos a continuación para simular tu rentabilidad
          </p>
        </div>
        
        <h3 className="text-lg font-bold mb-4">
          Selecciona hasta 3 productos para comparar su rentabilidad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`product-card ${isSelected(product.id) ? 'border-2 border-primary' : 'border border-neutral'}`}
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
              </div>
              
              <button 
                className={isSelected(product.id) ? "btn-primary w-full justify-center" : "btn-outline w-full justify-center"}
                onClick={() => handleProductToggle(product)}
              >
                {isSelected(product.id) ? (
                  'Producto seleccionado'
                ) : (
                  <>Seleccionar producto <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            className={`btn-primary ${selectedProducts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedProducts.length === 0}
            onClick={handleContinue}
          >
            Continuar <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
