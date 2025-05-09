
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import SimulationResults from '../components/simulation/SimulationResults';
import { useIframeResizer } from '../hooks/useIframeResizer';

const SimulationResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    simulationResults, 
    calculationPerformed,
    selectedProducts 
  } = useSimulator();
  const { sendHeight } = useIframeResizer();
  
  // If user navigates directly to results page without calculation, redirect to form
  useEffect(() => {
    if (!calculationPerformed || simulationResults.length === 0) {
      navigate('/simulacion/form');
    } else {
      // Send height update after results are loaded
      setTimeout(() => sendHeight(), 300);
    }
  }, [calculationPerformed, navigate, simulationResults.length, sendHeight]);
  
  const handleContactAdvisor = () => {
    if (simulationResults.length === 0) return;

    let typeformUrl = "https://mutualidad.typeform.com/to/xxYYzz?";

    simulationResults.forEach((result, index) => {
      typeformUrl += `product_${index + 1}=${encodeURIComponent(result.name)}&`;
      typeformUrl += `yield_${index + 1}=${encodeURIComponent(result.yield)}&`;
      typeformUrl += `initial_${index + 1}=${encodeURIComponent(result.initialDeposit)}&`;
      typeformUrl += `monthly_${index + 1}=${encodeURIComponent(result.monthlyDeposit)}&`;
      typeformUrl += `term_${index + 1}=${encodeURIComponent(result.termYears)}&`;
      typeformUrl += `final_${index + 1}=${encodeURIComponent(result.finalAmount)}&`;
    });

    window.open(typeformUrl, '_blank');
  };
  
  const handleBack = () => {
    navigate('/simulacion/form');
    // Send height update after navigation
    setTimeout(() => sendHeight(), 100);
  };

  return (
    <div className="container mx-auto px-4">
      <SimulationResults 
        results={simulationResults}
        calculationPerformed={calculationPerformed}
        handleContactAdvisor={handleContactAdvisor}
        handleBack={handleBack}
      />
    </div>
  );
};

export default SimulationResultsPage;
