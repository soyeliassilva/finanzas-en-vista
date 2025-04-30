
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Mail } from 'lucide-react';
import SimulationProductForm from './SimulationProductForm';
import SimulationChart from './SimulationChart';
import SimulationSummary from './SimulationSummary';
import SimulationForm from '../components/simulation/SimulationForm';
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
  const resultsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryHeight, setSummaryHeight] = useState<number | null>(null);
  
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

  // Effect to measure and set the summary height
  useEffect(() => {
    if (!calculationPerformed || !summaryRef.current) return;
    
    const updateHeight = () => {
      if (summaryRef.current) {
        const height = summaryRef.current.offsetHeight;
        setSummaryHeight(height);
      }
    };

    // Initial measurement
    updateHeight();
    
    // Setup resize observer for dynamic height changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    resizeObserver.observe(summaryRef.current);
    
    // Window resize handler
    window.addEventListener('resize', updateHeight);
    
    return () => {
      if (summaryRef.current) {
        resizeObserver.unobserve(summaryRef.current);
      }
      window.removeEventListener('resize', updateHeight);
    };
  }, [calculationPerformed, results]);

  const handleInputChange = (productId: string, field: keyof FormValues, value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCalculate = () => {
    calculateResults(productInputs);
    
    // Add a slight delay to ensure results are rendered before scrolling
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBack = () => {
    navigate('/productos');
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

    // Add initial point (month 0)
    const initialDataPoint: any = { month: 0 };
    results.forEach((result) => {
      const monthData = result.monthlyData.find(m => m.month === 0);
      if (monthData) {
        initialDataPoint[result.name] = monthData.value;
      }
    });
    chartData.push(initialDataPoint);

    // Add yearly data points
    for (let year = 1; year <= Math.ceil(maxMonths / 12); year++) {
      const month = year * 12;
      if (month > maxMonths) break;
      
      const dataPoint: any = { month };
      results.forEach((result) => {
        const monthData = result.monthlyData.find(m => m.month === month);
        if (monthData) {
          dataPoint[result.name] = monthData.value;
        }
      });
      chartData.push(dataPoint);
    }

    // Make sure the last point is included if it's not exactly on a year boundary
    const lastMonth = maxMonths;
    if (lastMonth % 12 !== 0 && !chartData.some(d => d.month === lastMonth)) {
      const lastDataPoint: any = { month: lastMonth };
      results.forEach((result) => {
        const monthData = result.monthlyData.find(m => m.month === lastMonth);
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
    <div className="container mx-auto px-4">
      <SimulationForm
        selectedProducts={selectedProducts}
        productInputs={productInputs}
        onInputChange={handleInputChange}
        onCalculate={handleCalculate}
        onBack={handleBack}
      />
      
      {calculationPerformed && results.length > 0 && (
        <div className="animate-fade-in" ref={resultsRef}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <SimulationSummary 
              results={results} 
              handleContactAdvisor={handleContactAdvisor}
              ref={summaryRef} 
            />
            <SimulationChart 
              results={results} 
              chartData={chartData} 
              getTotalAmount={getTotalAmount}
              summaryHeight={summaryHeight} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
