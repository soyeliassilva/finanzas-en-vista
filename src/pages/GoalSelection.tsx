
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType } from '../types';
import { useSimulator } from '../context/SimulatorContext';

interface GoalSelectionProps {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, setSelectedGoal }) => {
  const navigate = useNavigate();
  const { availableGoals, loading, error, updateIframeHeight } = useSimulator();
  
  // Update iframe height once when component mounts and data is loaded
  useEffect(() => {
    if (!loading && window.location.pathname === '/') {
      // Only update height if we're actually on the goal selection page
      updateIframeHeight('goal_selection');
    }
  }, [loading, updateIframeHeight]);
  
  const handleContinue = () => {
    if (selectedGoal) {
      navigate('/productos');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg">Cargando objetivos de inversión...</p>
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
      <div className="md:col-span-4 step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
          <h2 className="text-3xl text-primary mb-4">Objetivo de ahorro</h2>
          <p className="text-sm">
            Selecciona tu objetivo de ahorro
          </p>
        </div>
        
        <h3 className="text-lg font-bold mb-4">Selecciona tu necesidad</h3>
        
        <div>
          {availableGoals.map((goal) => (
            <div
              className="radio-option h-16 rounded-lg px-4 py-2 bg-white border border-neutral transition-all duration-150 cursor-pointer flex items-center gap-2"
              style={{ minHeight: "4rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}
              key={goal}
              onClick={() => setSelectedGoal(goal)}
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
            Compara los productos en función de tu objetivo
          </h2>
          <p className="text-sm">
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
