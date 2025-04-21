
import { Product } from '../types';

export const getProductDefaultFormValue = (product: Product) => {
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
