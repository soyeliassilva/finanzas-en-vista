
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType } from '../types';

interface GoalSelectionProps {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, setSelectedGoal }) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    if (selectedGoal) {
      navigate('/productos');
    }
  };
  
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
        
        <div className="space-y-2">
          <div className="radio-option">
            <div 
              className={`radio-circle cursor-pointer`}
              onClick={() => setSelectedGoal('maxima_disponibilidad')}
            >
              {selectedGoal === 'maxima_disponibilidad' && <div className="radio-selected" />}
            </div>
            <label className="cursor-pointer" onClick={() => setSelectedGoal('maxima_disponibilidad')}>
              Máxima disponibilidad
            </label>
          </div>
          
          <div className="radio-option">
            <div 
              className={`radio-circle cursor-pointer`}
              onClick={() => setSelectedGoal('maximizar_beneficios')}
            >
              {selectedGoal === 'maximizar_beneficios' && <div className="radio-selected" />}
            </div>
            <label className="cursor-pointer" onClick={() => setSelectedGoal('maximizar_beneficios')}>
              Maximizar beneficios fiscales
            </label>
          </div>
          
          <div className="radio-option">
            <div 
              className={`radio-circle cursor-pointer`}
              onClick={() => setSelectedGoal('ahorrar_jubilacion')}
            >
              {selectedGoal === 'ahorrar_jubilacion' && <div className="radio-selected" />}
            </div>
            <label className="cursor-pointer" onClick={() => setSelectedGoal('ahorrar_jubilacion')}>
              Ahorrar para la jubilación
            </label>
          </div>
          
          <div className="radio-option">
            <div 
              className={`radio-circle cursor-pointer`}
              onClick={() => setSelectedGoal('mas_retorno')}
            >
              {selectedGoal === 'mas_retorno' && <div className="radio-selected" />}
            </div>
            <label className="cursor-pointer" onClick={() => setSelectedGoal('mas_retorno')}>
              Más retorno de inversión a largo plazo
            </label>
          </div>
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
