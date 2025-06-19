import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoalType } from '../types';
import { useSimulator } from '../context/SimulatorContext';
import { useIsMobile } from '../hooks/use-mobile';
import { ChevronRight } from 'lucide-react';

interface GoalSelectionProps {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, setSelectedGoal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { availableGoals, loading, error, updateIframeHeight } = useSimulator();
  const isDirectNavigationRef = React.useRef(false);
  const isMobile = useIsMobile();
  
  // Check if this is a direct navigation to goal selection
  useEffect(() => {
    // Only update height when actually navigating to goal selection, not on initial load
    if (!loading && window.location.pathname === '/' && location.key !== 'default') {
      isDirectNavigationRef.current = true;
      updateIframeHeight('goal_selection');
    }
  }, [loading, location.key, updateIframeHeight]);
  
  const handleGoalSelection = (goal: GoalType) => {
    setSelectedGoal(goal);
    
    // Update iframe height after goal selection
    setTimeout(() => {
      updateIframeHeight('goal_selection');
    }, 0);
  };
  
  const handleContinue = () => {
    if (selectedGoal) {
      navigate('/productos');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 md:py-12">
        <div className="text-center">
          <p className="text-base md:text-lg">Cargando objetivos de inversión...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 md:py-12">
        <div className="text-center">
          <p className="text-base md:text-lg text-red-600">Error: {error}</p>
          <p className="text-sm md:text-base">Por favor, recargue la página o intente más tarde.</p>
        </div>
      </div>
    );
  }
  
  // Mobile view - simplified to a single step
  if (isMobile) {
    return (
      <div className="container mx-auto">
        <div className="step-container active-step px-3">
          <div className="mb-4">
            <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
            <h2 className="text-2xl text-primary mb-3">
              Selecciona tu objetivo de ahorro
            </h2>
          </div>
          
          <div>
            {availableGoals.map((goal) => (
              <div
                className="radio-option h-12 rounded-lg px-3 py-2 bg-white border border-neutral transition-all duration-150 cursor-pointer flex items-center gap-2"
                style={{ minHeight: "3rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}
                key={goal}
                onClick={() => handleGoalSelection(goal)}
              >
                <div className="radio-circle flex-shrink-0">
                  {selectedGoal === goal && <div className="radio-selected" />}
                </div>
                <label className="cursor-pointer flex-1 text-base font-medium select-none m-0 p-0 flex items-center h-full">
                  {goal}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              className={`btn-primary w-full justify-center ${!selectedGoal ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleContinue}
              disabled={!selectedGoal}
            >
              Continuar <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop view (unchanged layout)
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-4 step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
          <h2 className="text-3xl text-primary mb-4">Selecciona tu objetivo de ahorro</h2>
          <p className="text-sm hidden">
            Selecciona tu objetivo de ahorro
          </p>
        </div>
        
        <h3 className="text-lg font-bold mb-4 hidden">Selecciona tu necesidad</h3>
        
        <div>
          {availableGoals.map((goal) => (
            <div
              className="radio-option h-16 rounded-lg px-4 py-2 bg-white border border-neutral transition-all duration-150 cursor-pointer flex items-center gap-2"
              style={{ minHeight: "4rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}
              key={goal}
              onClick={() => handleGoalSelection(goal)}
            >
              <div className="radio-circle flex-shrink-0">
                {selectedGoal === goal && <div className="radio-selected" />}
              </div>
              <label className="cursor-pointer flex-1 text-base font-medium select-none m-0 p-0 flex items-center h-full">
                {goal}
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <button
            className={`btn-primary ${!selectedGoal ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleContinue}
            disabled={!selectedGoal}
          >
            Continuar
          </button>
        </div>
      </div>
      
      <div className="md:col-span-8 step-container">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 2</h3>
          <h2 className="text-3xl text-primary mb-4">
            Propuesta de productos para conseguir tu objetivo, elige los que quieras comparar
          </h2>
          <p className="text-sm hidden">
            Propuesta de productos para conseguir tu objetivo, elige los que quieras comparar
          </p>
        </div>
        
        <div className="bg-neutral/20 p-8 rounded-md flex items-center justify-center">
          <p className="text-primary/70">Selecciona un objetivo de ahorro para continuar</p>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
