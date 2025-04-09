
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalType } from '../types';
import { ChevronRight } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

interface GoalSelectionProps {
  selectedGoal: GoalType | null;
  setSelectedGoal: (goal: GoalType) => void;
}

// Helper function to convert goal_id to readable text
const formatGoalTitle = (goalId: string): string => {
  const goalMap: Record<string, string> = {
    'maxima_disponibilidad': 'Máxima disponibilidad',
    'disponibilidad': 'Máxima disponibilidad',
    'maximizar_beneficios': 'Maximizar beneficios fiscales',
    'fiscalidad': 'Maximizar beneficios fiscales',
    'ahorrar_jubilacion': 'Ahorrar para la jubilación',
    'jubilacion': 'Ahorrar para la jubilación',
    'mas_retorno': 'Mayor retorno a largo plazo',
    'inversion': 'Mayor retorno a largo plazo'
  };
  
  return goalMap[goalId] || goalId.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const GoalSelection: React.FC<GoalSelectionProps> = ({ 
  selectedGoal, 
  setSelectedGoal 
}) => {
  const navigate = useNavigate();
  const { availableGoals, isLoading } = useSimulator();
  
  const handleGoalSelect = (goal: GoalType) => {
    setSelectedGoal(goal);
  };
  
  const handleContinue = () => {
    if (selectedGoal) {
      navigate('/productos');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="step-container">
          <p>Cargando objetivos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="step-container active-step">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 1</h3>
          <h2 className="text-3xl text-primary mb-4">
            Selecciona tu objetivo de ahorro
          </h2>
          <p className="text-sm">
            Te mostraremos los productos que se adaptan a tus necesidades
          </p>
        </div>
        
        <div className="space-y-4">
          {availableGoals.map((goal) => (
            <div 
              key={goal} 
              className={`
                p-4 rounded-md border cursor-pointer transition-all
                ${selectedGoal === goal ? 'border-primary bg-accent/10' : 'border-neutral hover:border-primary/50'}
              `}
              onClick={() => handleGoalSelect(goal)}
            >
              <div className="flex items-start">
                <div className="radio-circle mt-1">
                  {selectedGoal === goal && <div className="radio-selected"></div>}
                </div>
                <div className="ml-2">
                  <h3 className="font-bold">{formatGoalTitle(goal)}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            className={`btn-primary ${!selectedGoal ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedGoal}
            onClick={handleContinue}
          >
            Continuar <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;
