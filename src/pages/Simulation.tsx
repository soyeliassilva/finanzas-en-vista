
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import SimulationForm from '../components/simulation/SimulationForm';
import SimulationResults from '../components/simulation/SimulationResults';
import { useSimulationCalculations } from '../hooks/useSimulationCalculations';
import { getProductDefaultFormValue, FormValues } from '../utils/simulationUtils';

const Simulation: React.FC<{ selectedProducts: Product[] }> = ({ selectedProducts }) => {
  const navigate = useNavigate();
  const { results, calculationPerformed, calculateResults } = useSimulationCalculations(selectedProducts);
  
  const initialInputs = useMemo(
    () => Object.fromEntries(
      selectedProducts.map((prod) => [prod.id, getProductDefaultFormValue(prod)])
    ),
    [selectedProducts]
  );

  const [productInputs, setProductInputs] = useState<Record<string, FormValues>>(initialInputs);

  useEffect(() => {
    setProductInputs(initialInputs);
  }, [initialInputs]);

  const handleInputChange = (productId: string, field: keyof FormValues, value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCalculate = () => {
    calculateResults(productInputs);
    
    // Add a slight delay to ensure results are rendered before scrolling
    setTimeout(() => {
      const resultsElement = document.querySelector('.animate-fade-in');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBack = () => {
    navigate('/productos');
  };

  const handleContactAdvisor = () => {
    if (results.length === 0) return;

    let typeformUrl = "https://mutualidad.typeform.com/to/xxYYzz?";

    results.forEach((result, index) => {
      typeformUrl += `product_${index + 1}=${encodeURIComponent(result.name)}&`;
      typeformUrl += `yield_${index + 1}=${encodeURIComponent(result.yield)}&`;
      typeformUrl += `initial_${index + 1}=${encodeURIComponent(result.initialDeposit)}&`;
      typeformUrl += `monthly_${index + 1}=${encodeURIComponent(result.monthlyDeposit)}&`;
      typeformUrl += `term_${index + 1}=${encodeURIComponent(result.termYears)}&`;
      typeformUrl += `final_${index + 1}=${encodeURIComponent(result.finalAmount)}&`;
    });

    window.open(typeformUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4">
      <SimulationForm
        selectedProducts={selectedProducts}
        productInputs={productInputs}
        onInputChange={handleInputChange}
        onCalculate={handleCalculate}
        onBack={handleBack}
      />
      
      <SimulationResults 
        results={results}
        calculationPerformed={calculationPerformed}
        handleContactAdvisor={handleContactAdvisor}
      />
    </div>
  );
};

export default Simulation;
