
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import SimulationForm from '../components/simulation/SimulationForm';
import { getProductDefaultFormValue } from '../utils/simulationUtils';
import { useSimulationCalculations } from '../hooks/useSimulationCalculations';
import { useIframeResizer } from '../hooks/useIframeResizer';

const SimulationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedProducts, 
    productInputs, 
    setProductInputs,
    setSimulationResults,
    setCalculationPerformed
  } = useSimulator();
  const { sendHeight } = useIframeResizer();
  
  const { calculateResults } = useSimulationCalculations(selectedProducts);

  // Initialize form values for each product if not already set
  const initialInputs = useMemo(
    () => Object.fromEntries(
      selectedProducts.map((prod) => [prod.id, getProductDefaultFormValue(prod)])
    ),
    [selectedProducts]
  );

  useEffect(() => {
    // If productInputs is empty or missing products, initialize with defaults
    if (Object.keys(productInputs).length === 0) {
      setProductInputs(initialInputs);
    } else {
      // Check if any selected products don't have inputs and add them
      const updatedInputs = { ...productInputs };
      let hasChanges = false;
      
      selectedProducts.forEach(product => {
        if (!productInputs[product.id]) {
          updatedInputs[product.id] = getProductDefaultFormValue(product);
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setProductInputs(updatedInputs);
      }
    }
  }, [initialInputs, productInputs, selectedProducts, setProductInputs]);

  const handleInputChange = (productId: string, field: keyof typeof initialInputs[string], value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCalculate = () => {
    const results = calculateResults(productInputs);
    setSimulationResults(results);
    setCalculationPerformed(true);
    
    // Navigate to results page
    navigate('/simulacion/results');
    // Send height update after navigation
    setTimeout(() => sendHeight("simulation_results"), 100);
  };

  const handleBack = () => {
    navigate('/productos');
    // Send height update after navigation
    setTimeout(() => sendHeight("product_selection"), 100);
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
    </div>
  );
};

export default SimulationFormPage;
