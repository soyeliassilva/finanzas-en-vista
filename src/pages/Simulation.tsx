
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue } from '../utils/calculator';
import SimulationHeader from '@/components/simulation/SimulationHeader';
import SimulationForm from '@/components/simulation/SimulationForm';
import SimulationResults from '@/components/simulation/SimulationResults';

interface SimulationProps {
  selectedProducts: Product[];
}

type FormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

const getProductDefaultFormValue = (product: Product) => {
  const minInitial = product.minInitialDeposit ?? 0;
  const minMonthly = product.minMonthlyDeposit ?? 0;
  const minTermMonths = product.product_duration_months_min ?? 12;
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

  const initialInputs = useMemo(
    () => Object.fromEntries(
      selectedProducts.map((prod) => [prod.id, getProductDefaultFormValue(prod)])
    ),
    [selectedProducts]
  );

  const [productInputs, setProductInputs] = useState<Record<string, FormValues>>(initialInputs);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  React.useEffect(() => {
    setProductInputs(initialInputs);
    setResults([]);
    setCalculationPerformed(false);
  }, [initialInputs]);

  const handleInputChange = (productId: string, field: keyof FormValues, value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const getApplicableYield = (product: Product, termYears: number) => {
    if (termYears >= 10 && product.yield10PlusYears !== undefined) {
      return product.yield10PlusYears;
    } else if (termYears >= 5 && product.yield5PlusYears !== undefined) {
      return product.yield5PlusYears;
    }
    return product.yield;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) return;

    const newResults = selectedProducts.map(product => {
      const { initialDeposit, monthlyDeposit, termYears } = productInputs[product.id] || getProductDefaultFormValue(product);
      const applicableYield = getApplicableYield(product, termYears);
      
      const { finalAmount, monthlyData } = calculateFutureValue(
        initialDeposit,
        monthlyDeposit,
        termYears,
        applicableYield,
        product.maxTotalContribution
      );

      return {
        productId: product.id,
        name: product.name,
        initialDeposit,
        monthlyDeposit,
        termYears,
        termMonths: termYears * 12,
        yield: applicableYield,
        finalAmount,
        generatedInterest: finalAmount - (initialDeposit + Math.min(
          monthlyDeposit * termYears * 12,
          (product.maxTotalContribution ? product.maxTotalContribution - initialDeposit : Infinity)
        )),
        monthlyData,
        taxation: product.taxation,
        url: product.url
      };
    });

    setResults(newResults);
    setCalculationPerformed(true);
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

  const getTotalAmount = () => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.finalAmount));
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <form onSubmit={handleCalculate}>
        <SimulationHeader handleBack={handleBack} handleCalculate={handleCalculate} />
        <SimulationForm 
          selectedProducts={selectedProducts}
          productInputs={productInputs}
          handleInputChange={handleInputChange}
        />
      </form>
      
      <SimulationResults 
        results={results}
        chartData={generateChartData()}
        calculationPerformed={calculationPerformed}
        getTotalAmount={getTotalAmount}
        handleContactAdvisor={handleContactAdvisor}
      />
    </div>
  );
};

export default Simulation;
