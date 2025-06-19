
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';
import SimulationResults from '../components/simulation/SimulationResults';
import { useIsMobile } from '../hooks/use-mobile';

const SimulationResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    simulationResults, 
    calculationPerformed,
    updateIframeHeight,
    rawProducts
  } = useSimulator();
  const isMobile = useIsMobile();
  
  // Phase 1: Immediate iframe resize to prevent scrollbars
  useEffect(() => {
    if (calculationPerformed && simulationResults.length > 0) {
      // Immediate resize to prevent scrollbar flash
      updateIframeHeight("simulation_results", true);
    }
  }, [calculationPerformed, simulationResults.length, updateIframeHeight]);
  
  // Phase 2: Delayed resize for content stabilization
  useEffect(() => {
    if (calculationPerformed && simulationResults.length > 0) {
      const timer = setTimeout(() => {
        updateIframeHeight("simulation_results");
      }, 500); // Keep longer delay for results step stability
      
      return () => clearTimeout(timer);
    }
  }, [calculationPerformed, simulationResults.length, updateIframeHeight]);
  
  // If user navigates directly to results page without calculation, redirect to form
  useEffect(() => {
    if (!calculationPerformed || simulationResults.length === 0) {
      navigate('/simulacion/form');
    }
  }, [calculationPerformed, navigate, simulationResults.length]);
  
  // Build the dynamic Typeform URL with product information
  const buildTypeformUrl = () => {
    if (simulationResults.length === 0) return '';

    // Base URL
    let typeformUrl = "https://mutualidadabogacia.typeform.com/to/ItBwkIQR?#contenido=simula&product_id=despachos&simulaciondespacho=";
    
    // Build the simulaciondespacho parameter
    const simulationParts = simulationResults.map(result => {
      // Find the product details to get the short name
      const product = rawProducts?.find(p => p.id === result.productId);
      const shortName = product?.product_short_name || 'UNKNOWN';
      
      // Get duration in months
      const durationMonths = result.termYears * 12;
      
      // Get the gross amount using Math.round instead of Math.floor to match the summary display
      const grossAmount = Math.round(result.finalAmount);
      
      // Format: <product_short_name>_<duration_in_months>_<importe_total_bruto>
      return `${shortName}_${durationMonths}_${grossAmount}`;
    });
    
    // Join parts with dashes
    typeformUrl += simulationParts.join('-');
    
    return typeformUrl;
  };
  
  const handleContactAdvisor = () => {
    if (simulationResults.length === 0) return;
    
    const typeformUrl = buildTypeformUrl();
    window.open(typeformUrl, '_blank');
  };
  
  const handleBack = () => {
    navigate('/simulacion/form');
  };

  return (
    <div className="container mx-auto">
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
