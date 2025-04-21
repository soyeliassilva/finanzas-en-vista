import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue, formatCurrency } from '../utils/calculator';
import { ChevronRight, Mail } from 'lucide-react';
import SimulationProductForm from './SimulationProductForm';
import SimulationChart from './SimulationChart';
import SimulationSummary from './SimulationSummary';

interface SimulationProps {
  selectedProducts: Product[];
}

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

type FormValues = {
  initialDeposit: number;
  monthlyDeposit: number;
  termYears: number;
};

const defaultFormValue: FormValues = {
  initialDeposit: 1000,
  monthlyDeposit: 100,
  termYears: 1,
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

  const initialInputs = useMemo(
    () =>
      Object.fromEntries(
        selectedProducts.map((prod) => [
          prod.id,
          getProductDefaultFormValue(prod),
        ])
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

  const handleCalculate = () => {
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

  const chartData = generateChartData();

  const getTotalAmount = () => {
    if (results.length === 0) return 0;
    const highest = Math.max(...results.map(r => r.finalAmount));
    return highest;
  };

  const gridColsStyle = {
    ['--md-cols' as string]: `repeat(${selectedProducts.length}, minmax(0, 1fr))`
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <div className="step-container active-step mb-6">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 3</h3>
          <h2 className="text-3xl text-primary mb-4">
            Descubre la rentabilidad de los productos seleccionados
          </h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleCalculate();
          }}
        >
          <div
            className={`grid grid-cols-1 md:gap-4 gap-4 mb-6 md:grid-cols-[var(--md-cols)]`}
            style={gridColsStyle}
          >
            {selectedProducts.map((product) => {
              const values = productInputs[product.id] || getProductDefaultFormValue(product);
              return (
                <SimulationProductForm
                  key={product.id}
                  product={product}
                  values={values}
                  onInputChange={handleInputChange}
                />
              );
            })}
          </div>

          <div className="flex justify-between">
            <button className="btn-outline" type="button" onClick={handleBack}>
              Volver
            </button>
            <button className="btn-primary" type="submit">
              Calcular rentabilidad <ChevronRight size={18} />
            </button>
          </div>
        </form>
      </div>
      
      {calculationPerformed && results.length > 0 && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <SimulationSummary results={results} handleContactAdvisor={handleContactAdvisor} />
            <SimulationChart results={results} chartData={chartData} getTotalAmount={getTotalAmount} />
          </div>
          
          <div className="step-container">
            <h3 className="text-xl font-bold mb-4">Resumen de los productos comparados</h3>
            
            <div className="overflow-x-auto">
              <div
                className="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1fr) repeat(5, minmax(120px, 1fr))',
                  gap: 0,
                  width: '100%',
                }}
              >
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Productos</div>
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Rentabilidad</div>
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Saldo acum.</div>
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Intereses generados</div>
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Fiscalidad</div>
                <div className="font-bold py-2 px-4 border-b border-neutral bg-light">Más info</div>
                
                {results.map((result, index) => (
                  <React.Fragment key={result.productId}>
                    <div className="flex items-center gap-2 py-2 px-4 border-b border-neutral">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                      ></div>
                      {result.name}
                    </div>
                    <div className="py-2 px-4 border-b border-neutral flex items-center">{result.yield}%</div>
                    <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.finalAmount)}</div>
                    <div className="py-2 px-4 border-b border-neutral flex items-center">{formatCurrency(result.generatedInterest)}</div>
                    <div className="py-2 px-4 border-b border-neutral flex items-center">{result.taxation}</div>
                    <div className="py-2 px-4 border-b border-neutral flex items-center">
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Más info
                        </a>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
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
