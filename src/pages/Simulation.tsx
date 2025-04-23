import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Mail } from 'lucide-react';
import SimulationProductForm from './SimulationProductForm';
import SimulationChart from './SimulationChart';
import SimulationSummary from './SimulationSummary';
import SimulationForm from '../components/simulation/SimulationForm';
import SimulationResultsTable from '../components/simulation/SimulationResultsTable';
import { useSimulationCalculations } from '../hooks/useSimulationCalculations';

type FormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

const getProductDefaultFormValue = (product: Product) => {
  const minInitial = product.minInitialDeposit ?? 0;
  const minMonthly = product.minMonthlyDeposit ?? 0;
  const minTermMonths = product.minTerm ?? 5;
  const minTermYears = Math.ceil(minTermMonths / 12);

  const isMonthlyFixedNone = minMonthly === 0 && (product.maxMonthlyDeposit ?? 0) === 0;

  return {
    initialDeposit: minInitial,
    monthlyDeposit: isMonthlyFixedNone ? 0 : minMonthly,
    termYears: minTermYears,
  };
};

const Simulation: React.FC<{ selectedProducts: Product[] }> = ({ selectedProducts }) => {
  const navigate = useNavigate();
  const { results, calculationPerformed, calculateResults } = useSimulationCalculations(selectedProducts);

  const initialInputs = useMemo(
    () => Object.fromEntries(
      selectedProducts.map((prod) => [prod.id, getProductDefaultFormValue(prod)])
    ),
    [selectedProducts]
  );

  const [productInputs, setProductInputs] = useState<Record<string, FormValues>>(initialInputs);

  React.useEffect(() => {
    setProductInputs(initialInputs);
  }, [initialInputs]);

  const handleInputChange = (productId: string, field: keyof FormValues, value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCalculate = () => {
    calculateResults(productInputs);
  };

  const handleBack = () => {
    const search = window.location.search || '';
    navigate('/productos' + search);
  };

  const handleContactAdvisor = () => {
    if (results.length === 0) return;

    let typeformUrl = "https://mutualidad.typeform.com/to/xxYYzz?";

    results.forEach((result, index) => {
      typeformUrl += `product_${index + 1}=${encodeURIComponent(result.name)}&`;
      typeformUrl += `yield_${index + 1}=${encodeURIComponent(result.yield)}&`;
      typeformUrl += `initial_${index + 1}=${encodeURIComponent(result.initialDeposit)}&`;
      typeformUrl += `monthly_${index + 1}=${encodeURIComponent(result.monthlyDeposit)}&`;
      typeformUrl += `term_${index + 1}=${encodeURIComponent(result.termYears)}&`;
      typeformUrl += `final_${index + 1}=${encodeURIComponent(result.finalAmount)}&`;
    });

    window.open(typeformUrl, '_blank');
  };

  const generateChartData = () => {
    if (results.length === 0) return [];

    const maxMonths = Math.max(...results.map(r => r.termYears * 12));
    const chartData = [];

    for (let month = 0; month <= maxMonths; month += maxMonths > 60 ? 12 : 6) {
      const dataPoint: any = { month };

      results.forEach((result) => {
        const monthData = result.monthlyData.find(m => m.month === month);
        if (monthData) {
          dataPoint[result.name] = monthData.value;
        }
      });

      chartData.push(dataPoint);
    }

    if (!chartData.some(d => d.month === maxMonths)) {
      const lastDataPoint: any = { month: maxMonths };
      results.forEach((result) => {
        const monthData = result.monthlyData.find(m => m.month === maxMonths);
        if (monthData) {
          lastDataPoint[result.name] = monthData.value;
        }
      });
      chartData.push(lastDataPoint);
    }

    return chartData;
  };

  const chartData = generateChartData();

  const getTotalAmount = () => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.finalAmount));
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <SimulationForm
        selectedProducts={selectedProducts}
        productInputs={productInputs}
        onInputChange={handleInputChange}
        onCalculate={handleCalculate}
        onBack={handleBack}
      />
      
      {calculationPerformed && results.length > 0 && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <SimulationSummary results={results} handleContactAdvisor={handleContactAdvisor} />
            <SimulationChart results={results} chartData={chartData} getTotalAmount={getTotalAmount} />
          </div>
          
          <div className="step-container">
            <h3 className="text-xl font-bold mb-4">Resumen de los productos comparados</h3>
            <SimulationResultsTable results={results} />
            
            <div className="mt-8 flex justify-center">
              <button className="btn-primary" onClick={handleContactAdvisor}>
                Contacta con nuestro gestor <Mail size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
