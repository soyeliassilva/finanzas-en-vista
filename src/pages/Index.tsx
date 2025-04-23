
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import GoalSelection from './GoalSelection';
import ProductSelection from './ProductSelection';
import Simulation from './Simulation';
import LoadingSpinner from '../components/LoadingSpinner';

interface IndexProps {
  step?: string;
}

function getCurrentSearch() {
  return window.location.search || '';
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
      const search = getCurrentSearch();
      if (step === 'productos' && !selectedGoal) {
        navigate('/' + search, { replace: true });
      }
      
      if (step === 'simulacion' && selectedProducts.length === 0) {
        navigate('/productos' + search, { replace: true });
        if (!selectedGoal) {
          navigate('/' + search, { replace: true });
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

