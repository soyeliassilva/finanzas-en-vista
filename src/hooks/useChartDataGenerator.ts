
import { SimulationResult } from "../types";

export const useChartDataGenerator = () => {
  const generateChartData = (results: SimulationResult[]) => {
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

  const getTotalAmount = (results: SimulationResult[]) => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.finalAmount));
  };

  return { generateChartData, getTotalAmount };
};
