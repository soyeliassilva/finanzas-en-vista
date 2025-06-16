import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType, Product } from '../types';
import { useSimulator } from '../context/SimulatorContext';
import ProductCard from './ProductCard';
import ProductSelectionHeader, { Step2Instructions } from './ProductSelectionHeader';
import { preserveUrlParams } from '../utils/urlParamsUtils';

interface ProductSelectionProps {
  selectedGoal: GoalType | null;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  selectedGoal,
  selectedProducts,
  setSelectedProducts,
}) => {
  const navigate = useNavigate();
  const { allProducts, loading, error, updateIframeHeight } = useSimulator();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [multiplica, setMultiplica] = useState<Product | null>(null);

  // Update iframe height once when component mounts
  useEffect(() => {
    if (!loading) {
      updateIframeHeight('product_selection');
    }
  }, [loading, updateIframeHeight]);

  useEffect(() => {
    if (selectedGoal && allProducts.length > 0) {
      const goalProducts = allProducts.filter((product) => product.goal === selectedGoal);
      const multiplicaPlan = allProducts.find((product) => product.name === "Plan Ahorro Multiplica");
      setMultiplica(multiplicaPlan || null);
      const goalProductsFiltered = goalProducts.filter(
        (product) => product.name !== "Plan Ahorro Multiplica"
      );
      setFilteredProducts(goalProductsFiltered);
    }
  }, [selectedGoal, allProducts]);

  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
    
    // Update iframe height after product selection changes with immediate flag
    setTimeout(() => {
      updateIframeHeight('product_selection', true);
    }, 0);
  };

  const handleContinue = () => {
    if (selectedProducts.length > 0) {
      navigate(preserveUrlParams('/simulacion'));
    }
  };

  const handleBack = () => {
    navigate(preserveUrlParams('/'));
  };

  const isSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
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

  // Determine if instruction should be shown
  let numForGoal = filteredProducts.length;
  if (multiplica) numForGoal += 1;
  const showStep2Instructions = numForGoal >= 4;

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
      <ProductSelectionHeader onBack={handleBack} />
      <div className="md:col-span-8 step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 2</h3>
          <h2 className="text-3xl text-primary mb-4">
            Propuesta de productos para conseguir tu objetivo, elige los que quieras comparar
          </h2>
          <p className="text-sm hidden">
            Elige los productos a continuación para simular tu rentabilidad
          </p>
        </div>
        <Step2Instructions show={showStep2Instructions} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 mb-6">
          {multiplica && (
            <ProductCard
              key={multiplica.id}
              product={multiplica}
              isSelected={isSelected(multiplica.id)}
              onToggle={handleProductToggle}
            />
          )}
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={isSelected(product.id)}
              onToggle={handleProductToggle}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className={`btn-primary ${selectedProducts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedProducts.length === 0}
            onClick={handleContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
