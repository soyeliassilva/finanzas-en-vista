
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import GoalSelection from './GoalSelection';
import ProductSelection from './ProductSelection';
import SimulationFormPage from './SimulationFormPage';
import SimulationResultsPage from './SimulationResultsPage';
import LoadingSpinner from '../components/LoadingSpinner';

interface IndexProps {
  step?: string;
}

const Index: React.FC<IndexProps> = ({ step }) => {
  const navigate = useNavigate();
  const { 
    selectedGoal, 
    setSelectedGoal, 
    selectedProducts, 
    setSelectedProducts,
    loading
  } = useSimulator();
  
  useEffect(() => {
    // Redirect if trying to access a step without completing previous steps
    if (!loading) {
      if (step === 'productos' && !selectedGoal) {
        navigate('/');
      }
      
      if ((step === 'simulacion-form' || step === 'simulacion-results') && selectedProducts.length === 0) {
        navigate('/productos');
        if (!selectedGoal) {
          navigate('/');
        }
      }
    }
  }, [step, selectedGoal, selectedProducts, navigate, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (step === 'simulacion-results') {
    return <SimulationResultsPage />;
  }
  
  if (step === 'simulacion-form') {
    return <SimulationFormPage />;
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
