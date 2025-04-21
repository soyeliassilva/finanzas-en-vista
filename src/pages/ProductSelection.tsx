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
  const { allProducts, loading, error } = useSimulator();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [multiplica, setMultiplica] = useState<Product | null>(null);
  
  useEffect(() => {
    if (selectedGoal && allProducts.length > 0) {
      // Filter products that match the selected goal
      const goalProducts = allProducts.filter(product => product.goal === selectedGoal);
      
      // Check if "Plan Ahorro Multiplica" exists and always include it
      const multiplicaPlan = allProducts.find(product => product.name === "Plan Ahorro Multiplica");
      setMultiplica(multiplicaPlan || null);
      
      // Make sure "Plan Ahorro Multiplica" is not duplicated
      const goalProductsFiltered = goalProducts.filter(
        product => product.name !== "Plan Ahorro Multiplica"
      );
      
      setFilteredProducts(goalProductsFiltered);
    }
  }, [selectedGoal, allProducts]);
  
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
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <p>Por favor, recargue la página o intente más tarde.</p>
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
        
        {/* Hide the instruction if 3 or fewer products available for this goal */}
        {(() => {
          // Count all products for this goal including multiplica if it belongs, or just multiplica if only it exists
          let numForGoal = filteredProducts.length;
          if (multiplica) {
            // If multiplica matches this goal or is always shown, increment
            numForGoal += 1;
          }
          if (numForGoal > 3) {
            return (
              <h3 className="text-lg font-bold mb-4">
                Selecciona hasta 3 productos para comparar su rentabilidad
              </h3>
            );
          }
          return null;
        })()}
        
        <h3 className="text-lg font-bold mb-4">
          Selecciona hasta 3 productos para comparar su rentabilidad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Always show Plan Ahorro Multiplica first if it exists */}
          {multiplica && (
            <div 
              key={multiplica.id}
              className={`product-card ${isSelected(multiplica.id) ? 'border-2 border-primary' : 'border border-neutral'}`}
            >
              <h3 className="text-lg font-bold mb-2">{multiplica.name}</h3>
              <p className="text-sm mb-4">{multiplica.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <p className="text-sm">{multiplica.yield}% de rentabilidad a cuenta</p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  {multiplica.minTerm === 1 ? (
                    <p className="text-sm">Plazo: {multiplica.minTerm} año</p>
                  ) : (
                    <p className="text-sm">
                      Plazo: {multiplica.minTerm} - {multiplica.maxTerm || '∞'} años
                    </p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                  <p className="text-sm">
                    Aportaciones desde {multiplica.minMonthlyDeposit}€
                    {multiplica.minInitialDeposit > 0 && ` (inicial: ${multiplica.minInitialDeposit}€)`}
                  </p>
                </div>

                {multiplica.conditions && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                    <p className="text-sm">{multiplica.conditions}</p>
                  </div>
                )}
              </div>
              
              <button 
                className={isSelected(multiplica.id) ? "btn-primary w-full justify-center" : "btn-outline w-full justify-center"}
                onClick={() => handleProductToggle(multiplica)}
              >
                {isSelected(multiplica.id) ? (
                  'Producto seleccionado'
                ) : (
                  <>Seleccionar producto <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          )}

          {/* Show filtered products */}
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

                {product.conditions && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></div>
                    <p className="text-sm">{product.conditions}</p>
                  </div>
                )}
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
