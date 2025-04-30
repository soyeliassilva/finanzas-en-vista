
import React, { useRef, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SimulationResult } from "../types";
import { formatCurrency } from "../utils/calculator";

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];

interface SimulationChartProps {
  results: SimulationResult[];
  chartData: any[];
  getTotalAmount: () => number;
  summaryHeight: number | null;
}

const SimulationChart: React.FC<SimulationChartProps> = ({ results, chartData, getTotalAmount, summaryHeight }) => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const summaryInfoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number>(400);
  
  // Calculate chart height based on summary height and other elements' heights
  useEffect(() => {
    if (!summaryHeight) return;
    
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const summaryInfoHeight = summaryInfoRef.current?.offsetHeight || 0;
    const footerHeight = footerRef.current?.offsetHeight || 0;
    
    // Account for margins/paddings: mb-4 (16px) + mt-6 (24px) + mt-4 (16px) + additional buffer (20px)
    const marginsAndPaddings = 16 + 24 + 16 + 20;
    
    // Calculate available height for the chart
    const availableHeight = summaryHeight - headerHeight - summaryInfoHeight - footerHeight - marginsAndPaddings;
    
    // Set a minimum height to prevent too small charts
    setChartHeight(Math.max(availableHeight, 300));
  }, [summaryHeight]);

  return (
    <div className="md:col-span-7 step-container">
      <h3 ref={headerRef} className="text-xl font-bold mb-4">Previsión de rentabilidad</h3>

      <div ref={summaryInfoRef} className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-bold">Importe total al rescate de los tres productos</p>
          <p className="text-2xl font-bold">
            {formatCurrency(
              results.reduce((total, result) => total + result.finalAmount, 0)
            )}
          </p>
        </div>
      </div>

      <div style={{ height: `${chartHeight}px` }} className="min-h-[300px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFCFCF" />
            <XAxis 
              dataKey="month"
              ticks={chartData.filter(d => d.month % 12 === 0).map(d => d.month)}
              tickFormatter={(value) => {
                if (value === 0) return '0 años';
                return value === 12 ? '1 año' : `${Math.floor(value / 12)} años`;
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
                return label === 12 
                  ? `Mes ${label} (1 año)` 
                  : `Mes ${label} (${Math.floor(label / 12)} años)`;
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

      <div ref={footerRef} className="mt-4 text-xs text-right">
        <p>El rescate tributa como rendimientos del capital en el IRPF</p>
      </div>
    </div>
  );
};

export default SimulationChart;
