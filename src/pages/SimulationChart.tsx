
import React, { useRef, useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SimulationResult } from "../types";
import { formatCurrency, formatNumber } from "../utils/calculator";
import { useIsMobile } from "../hooks/use-mobile";

const chartColors = ['#004236', '#D1A4C4', '#B9EDAA'];
const MAX_CHART_HEIGHT = 700; // Maximum height cap to prevent infinite growth
const MIN_CHART_HEIGHT = 300; // Minimum height to ensure the chart is visible

interface SimulationChartProps {
  results: SimulationResult[];
  chartData: any[];
  getTotalAmount: () => number;
  summaryHeight: number | null;
  forceMobileHeight?: number;
}

const SimulationChart: React.FC<SimulationChartProps> = ({ 
  results, 
  chartData, 
  getTotalAmount, 
  summaryHeight,
  forceMobileHeight 
}) => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const summaryInfoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number>(MIN_CHART_HEIGHT);
  const lastHeightRef = useRef<number>(MIN_CHART_HEIGHT);
  const isMobile = useIsMobile();
  
  // Calculate chart height based on number of products for desktop
  // or based on summary height for mobile (or use forceMobileHeight)
  useEffect(() => {
    if (isMobile) {
      // Use forced height if provided, otherwise calculate
      if (forceMobileHeight) {
        setChartHeight(forceMobileHeight);
        return;
      }
      
      // Mobile height calculation (existing logic)
      if (!summaryHeight) return;
      
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const summaryInfoHeight = summaryInfoRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      
      // Account for margins/paddings: mb-4 (16px) + mt-6 (24px) + mt-4 (16px) + additional buffer (20px)
      const marginsAndPaddings = 16 + 24 + 16 + 20;
      
      // Calculate available height for the chart
      let newHeight = Math.min(
        summaryHeight - headerHeight - summaryInfoHeight - footerHeight - marginsAndPaddings,
        MAX_CHART_HEIGHT
      );
      
      // Set a minimum height to prevent too small charts
      newHeight = Math.max(newHeight, MIN_CHART_HEIGHT);
      
      // Only update if the height change is significant (more than 20px)
      if (Math.abs(newHeight - lastHeightRef.current) > 20) {
        lastHeightRef.current = newHeight;
        setChartHeight(newHeight);
      }
    } else {
      // Desktop height calculation based on number of products
      const productsCount = results.length;
      // Apply the formula: (188px * number_of_products - 40px)
      const desktopHeight = Math.max(188 * productsCount - 40, MIN_CHART_HEIGHT);
      // Cap the height if needed
      const cappedHeight = Math.min(desktopHeight, MAX_CHART_HEIGHT);
      setChartHeight(cappedHeight);
    }
  }, [summaryHeight, isMobile, results.length, forceMobileHeight]);

  // Find the highest value in the chart data for Y-axis domain calculation
  const maxDataValue = useMemo(() => {
    let max = 0;
    chartData.forEach(dataPoint => {
      results.forEach(result => {
        if (dataPoint[result.name] && dataPoint[result.name] > max) {
          max = dataPoint[result.name];
        }
      });
    });
    // Add 10% padding to the top
    return Math.ceil(max * 1.1);
  }, [chartData, results]);

  // Changed to always use a single text regardless of number of products
  const totalAmountText = "Importe total bruto acumulado";

  return (
    <div className={`${isMobile ? "" : "md:col-span-7 h-full"} chart-container no-scrollbar`}>
      <h3 ref={headerRef} className="text-lg md:text-xl font-bold mb-3 md:mb-4">Previsión de rentabilidad</h3>

      <div ref={summaryInfoRef} className="mb-2 md:mb-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-sm md:text-base">{totalAmountText}</p>
          <p className="text-xl md:text-2xl font-bold">
            {formatCurrency(
              results.reduce((total, result) => total + result.finalAmount, 0)
            )}
          </p>
        </div>
      </div>

      <div 
        style={{ height: `${chartHeight}px` }} 
        className={`min-h-[${isMobile ? '250px' : '300px'}] max-h-[700px] mt-4 md:mt-6 chart-container no-scrollbar`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFCFCF" />
            <XAxis 
              dataKey="month"
              ticks={chartData.filter(d => d.month % (isMobile ? 24 : 12) === 0).map(d => d.month)}
              tickFormatter={(value) => {
                if (value === 0) return '0';
                return isMobile 
                  ? `${Math.floor(value / 12)}` 
                  : value === 12 ? '1 año' : `${Math.floor(value / 12)} años`;
              }}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis 
              tickFormatter={(value) => {
                return `${formatNumber(value / 1000)}k`;
              }}
              width={35}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              domain={[0, maxDataValue]}
              interval="preserveStartEnd"
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value), '']}
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
                strokeWidth={isMobile ? 1.5 : 2}
                dot={{ r: isMobile ? 2 : 3 }}
                activeDot={{ r: isMobile ? 4 : 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div ref={footerRef} className="mt-2 md:mt-4 text-[10px] md:text-xs text-left">
        <p>Rentabilidades pasadas no presuponen rentabilidades futuras. La información facilitada por este simulador es orientativa al basarse en hipótesis , por lo que su contenido no es vinculante y puede variar en consultas futuras</p>
      </div>
    </div>
  );
};

export default SimulationChart;
