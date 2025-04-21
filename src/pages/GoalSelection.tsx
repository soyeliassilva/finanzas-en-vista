
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType } from '../types';
import { useSimulator } from '../context/SimulatorContext';

interface GoalSelectionProps {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, setSelectedGoal }) => {
  const navigate = useNavigate();
  const { availableGoals, loading, error } = useSimulator();
  
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

  // Use a minHeight for each goal and equal padding
  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4 step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
          <h2 className="text-3xl text-primary mb-4">Objetivo de ahorro</h2>
          <p className="text-sm">
            Selecciona tu objetivo y compara productos para maximizar tus beneficios
          </p>
        </div>
        
        <h3 className="text-lg font-bold mb-4">Selecciona tu necesidad</h3>
        
        <div className="space-y-3">
          {availableGoals.map((goal) => (
            <div
              className={`radio-option bg-white rounded-lg shadow-sm border transition-all cursor-pointer min-h-[64px] flex items-center px-4 py-4 ${
                selectedGoal === goal ? 'ring-2 ring-primary/70' : 'hover:ring-1 hover:ring-primary/30'
              }`}
              key={goal}
              style={{ minHeight: '64px', marginBottom: '0px' }}
              onClick={() => setSelectedGoal(goal)}
            >
              <div 
                className={`radio-circle mr-3`}
              >
                {selectedGoal === goal && <div className="radio-selected" />}
              </div>
              <label className="cursor-pointer select-none w-full text-base font-medium" style={{ marginBottom: 0 }}>
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
            Elige los productos a continuación para simular tu rentabilidad
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
