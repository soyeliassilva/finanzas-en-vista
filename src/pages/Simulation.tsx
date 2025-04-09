
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, SimulationResult } from '../types';
import { calculateFutureValue, formatCurrency } from '../utils/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronRight, Mail } from 'lucide-react';

interface SimulationProps {
  selectedProducts: Product[];
}

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

const Simulation: React.FC<SimulationProps> = ({ selectedProducts }) => {
  const navigate = useNavigate();
  
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100);
  const [termYears, setTermYears] = useState<number>(1);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  
  const handleCalculate = () => {
    if (selectedProducts.length === 0) return;
    
    const newResults = selectedProducts.map(product => {
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
        taxation: product.taxation
      };
    });
    
    setResults(newResults);
    setCalculationPerformed(true);
  };
  
  const handleBack = () => {
    navigate('/productos');
  };
  
  const handleContactAdvisor = () => {
    const subject = "Consulta sobre simulación de productos financieros";
    
    let body = "Hola,\n\nHe realizado una simulación con los siguientes productos:\n\n";
    
    results.forEach(result => {
      body += `- ${result.name} (${result.yield}%)\n`;
      body += `  Aportación inicial: ${result.initialDeposit}€\n`;
      body += `  Aportación mensual: ${result.monthlyDeposit}€\n`;
      body += `  Plazo: ${result.termYears} años\n`;
      body += `  Capital final estimado: ${result.finalAmount.toFixed(2)}€\n\n`;
    });
    
    body += "Me gustaría recibir más información sobre estos productos.\n\nGracias.";
    
    const mailtoUrl = `mailto:asesor@mutualidad.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };
  
  // Generate chart data
  const generateChartData = () => {
    if (results.length === 0) return [];
    
    const maxMonths = termYears * 12;
    const chartData = [];
    
    // Get all month points (0, 12, 24, 36, ...) up to maxMonths
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
    
    // Add the last month if it's not already included
    const lastMonth = maxMonths;
    if (!chartData.some(d => d.month === lastMonth)) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="form-group">
            <label htmlFor="initialDeposit" className="form-label">Aportación inicial</label>
            <div className="relative">
              <input
                type="number"
                id="initialDeposit"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="form-input"
                placeholder="0€"
                min="0"
              />
              <span className="absolute right-3 top-2">€</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="termYears" className="form-label">Plazo de vencimiento*</label>
            <div className="relative">
              <input
                type="number"
                id="termYears"
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="form-input"
                placeholder="1 año"
                min="1"
                max="30"
              />
              <span className="absolute right-3 top-2">años</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="monthlyDeposit" className="form-label">Aportación periódica mensual*</label>
            <div className="relative">
              <input
                type="number"
                id="monthlyDeposit"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="form-input"
                placeholder="0€"
                min="0"
              />
              <span className="absolute right-3 top-2">€</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button className="btn-outline" onClick={handleBack}>
            Volver
          </button>
          <button className="btn-primary" onClick={handleCalculate}>
            Calcular rentabilidad <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      {calculationPerformed && results.length > 0 && (
        <>
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
                      <td>Detalles</td>
                      <td><a href="#" className="text-primary underline">Más info</a></td>
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
        </>
      )}
    </div>
  );
};

export default Simulation;
