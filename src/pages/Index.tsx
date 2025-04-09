
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import GoalSelection from './GoalSelection';
import ProductSelection from './ProductSelection';
import Simulation from './Simulation';

interface IndexProps {
  step?: string;
}

const Index: React.FC<IndexProps> = ({ step }) => {
  const navigate = useNavigate();
  const { 
    selectedGoal, 
    setSelectedGoal, 
    selectedProducts, 
    setSelectedProducts 
  } = useSimulator();
  
  useEffect(() => {
    // Redirect if trying to access a step without completing previous steps
    if (step === 'productos' && !selectedGoal) {
      navigate('/');
    }
    
    if (step === 'simulacion' && selectedProducts.length === 0) {
      navigate('/productos');
      if (!selectedGoal) {
        navigate('/');
      }
    }
  }, [step, selectedGoal, selectedProducts, navigate]);
  
  if (step === 'simulacion') {
    return <Simulation selectedProducts={selectedProducts} />;
  }
  
  if (step === 'productos') {
    return (
      <ProductSelection 
        selectedGoal={selectedGoal} 
        selectedProducts={selectedProducts} 
        setSelectedProducts={setSelectedProducts}
      />
    );
  }
  
  // Default: show goal selection
  return <GoalSelection selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />;
};

export default Index;
