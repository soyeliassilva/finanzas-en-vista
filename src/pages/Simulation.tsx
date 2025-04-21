import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue, formatCurrency } from '../utils/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronRight, Mail } from 'lucide-react';

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

const Simulation: React.FC<SimulationProps> = ({ selectedProducts }) => {
  const navigate = useNavigate();

  // Track form state per product ID
  const [productInputs, setProductInputs] = useState<Record<string, FormValues>>(
    () =>
      Object.fromEntries(
        selectedProducts.map((prod) => [
          prod.id,
          { ...defaultFormValue }
        ])
      )
  );
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  // Input handlers
  const handleInputChange = (productId: string, field: keyof FormValues, value: number) => {
    setProductInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCalculate = () => {
    if (selectedProducts.length === 0) return;

    const newResults = selectedProducts.map(product => {
      const { initialDeposit, monthlyDeposit, termYears } = productInputs[product.id] || defaultFormValue;
      const { finalAmount, monthlyData } = calculateFutureValue(
        initialDeposit,
        monthlyDeposit,
        termYears,
        product.yield
      );

      return {
        productId: product.id,
        name: product.name,
        initialDeposit,
        monthlyDeposit,
        termYears,
        termMonths: termYears * 12,
        yield: product.yield,
        finalAmount,
        generatedInterest: finalAmount - (initialDeposit + (monthlyDeposit * termYears * 12)),
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

  // Generate chart data based on results
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

    // Add last month if not already
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

  return (
    <div className="container mx-auto px-4 pb-10">
      <div className="step-container active-step mb-6">
        <div className="mb-6">
          <h3 className="text-sm text-primary font-mutualidad font-normal">Paso 3</h3>
          <h2 className="text-3xl text-primary mb-4">
            Descubre la rentabilidad de los productos seleccionados
          </h2>
        </div>

        {/* Render FORM PER PRODUCT */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleCalculate();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {selectedProducts.map((product, idx) => {
              const values = productInputs[product.id] || defaultFormValue;
              return (
                <div
                  key={product.id}
                  className="form-group border rounded-lg p-4 shadow-sm bg-white"
                >
                  <h4 className="font-bold mb-2 text-base text-primary">{product.name}</h4>
                  <label htmlFor={`initialDeposit_${product.id}`} className="form-label">
                    Aportación inicial
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="number"
                      id={`initialDeposit_${product.id}`}
                      value={values.initialDeposit}
                      onChange={e => handleInputChange(product.id, "initialDeposit", Number(e.target.value))}
                      className="form-input w-full"
                      placeholder="0€"
                      min="0"
                    />
                    <span className="absolute right-3 top-2">€</span>
                  </div>

                  <label htmlFor={`termYears_${product.id}`} className="form-label">
                    Plazo de vencimiento*
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="number"
                      id={`termYears_${product.id}`}
                      value={values.termYears}
                      onChange={e => handleInputChange(product.id, "termYears", Number(e.target.value))}
                      className="form-input w-full"
                      placeholder="1 año"
                      min="1"
                      max="30"
                    />
                    <span className="absolute right-3 top-2">años</span>
                  </div>

                  <label htmlFor={`monthlyDeposit_${product.id}`} className="form-label">
                    Aportación periódica mensual*
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="number"
                      id={`monthlyDeposit_${product.id}`}
                      value={values.monthlyDeposit}
                      onChange={e => handleInputChange(product.id, "monthlyDeposit", Number(e.target.value))}
                      className="form-input w-full"
                      placeholder="0€"
                      min="0"
                    />
                    <span className="absolute right-3 top-2">€</span>
                  </div>
                </div>
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
            <div className="md:col-span-5 step-container">
              <h3 className="text-xl font-bold mb-4">Resumen del producto</h3>
              
              {results.map((result, index) => (
                <div key={result.productId} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                    <h4 className="text-lg font-bold">{result.name}</h4>
                  </div>
                  
                  <div className="ml-5 space-y-2">
                    <div className="flex justify-between">
                      <span>Importe total al rescate</span>
                      <span className="font-bold">{formatCurrency(result.finalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Rentabilidad</span>
                      <span className="font-bold">{result.yield}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Intereses brutos generados</span>
                      <span className="font-bold">{formatCurrency(result.generatedInterest)}</span>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <p className="font-bold mb-1">Detalles fiscalidad del producto</p>
                      <p>{result.taxation}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6">
                <button className="btn-primary w-full justify-center" onClick={handleContactAdvisor}>
                  Contacta con nuestro gestor <Mail size={18} />
                </button>
              </div>
            </div>
            
            <div className="md:col-span-7 step-container">
              <h3 className="text-xl font-bold mb-4">Previsión de rentabilidad</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Importe total al rescate de los tres productos</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalAmount())}</p>
                </div>
              </div>
              
              <div className="h-72 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CFCFCF" />
                    <XAxis 
                      dataKey="month"
                      tickFormatter={(value) => {
                        if (value === 0) return '0';
                        return `${Math.floor(value / 12)} años`;
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => {
                        return `${(value / 1000).toFixed(0)}k`;
                      }}
                      width={40}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${formatCurrency(value)}`, '']}
                      labelFormatter={(label) => {
                        if (label === 0) return 'Inicio';
                        return `Mes ${label} (${Math.floor(label / 12)} años${label % 12 > 0 ? ` ${label % 12} meses` : ''})`;
                      }}
                    />
                    <Legend />
                    {results.map((result, index) => (
                      <Line
                        key={result.productId}
                        type="monotone"
                        dataKey={result.name}
                        stroke={chartColors[index % chartColors.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-xs text-right">
                <p>El rescate tributa como rendimientos del capital en el IRPF</p>
              </div>
            </div>
          </div>
          
          <div className="step-container">
            <h3 className="text-xl font-bold mb-4">Resumen de los productos comparados</h3>
            
            <div className="overflow-x-auto">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Productos</th>
                    <th>Rentabilidad</th>
                    <th>Saldo acum.</th>
                    <th>Intereses generados</th>
                    <th>Fiscalidad</th>
                    <th>Más info</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.productId}>
                      <td className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        ></div>
                        {result.name}
                      </td>
                      <td>{result.yield}%</td>
                      <td>{formatCurrency(result.finalAmount)}</td>
                      <td>{formatCurrency(result.generatedInterest)}</td>
                      <td>{result.taxation}</td>
                      <td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
