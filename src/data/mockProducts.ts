
import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'plan-ahorro-multiplica',
    name: 'Plan Ahorro Multiplica',
    description: 'Incrementa tus ahorros, garantiza tu futuro',
    yield: 3.5,
    minInitialDeposit: 0,
    minMonthlyDeposit: 30,
    minTerm: 1,
    maxTerm: 30,
    goal: 'ahorrar_jubilacion',
    taxation: 'El rescate tributa como rendimientos del capital en el IRPF',
    disclaimer: 'Rentabilidad a cuenta del 3,5% con posibilidad de bonus adicional según resultados.'
  },
  {
    id: 'plan-ahorro-flexible',
    name: 'Plan Ahorro Flexible',
    description: 'Tu dinero disponible cuando quieras',
    yield: 3.25,
    minInitialDeposit: 0,
    minMonthlyDeposit: 60,
    minTerm: 1,
    maxTerm: 25,
    goal: 'maxima_disponibilidad',
    taxation: 'El rescate tributa como rendimientos del capital en el IRPF',
    disclaimer: 'Alta rentabilidad del 3,25% con disponibilidad inmediata.'
  },
  {
    id: 'pias',
    name: 'PIAS',
    description: 'Plan de ahorro asegurado con ventajas fiscales',
    yield: 3.0,
    minInitialDeposit: 100,
    minMonthlyDeposit: 50,
    minTerm: 5,
    goal: 'maximizar_beneficios',
    taxation: 'Exento de tributación si se mantiene más de 5 años',
    disclaimer: 'Las aportaciones están limitadas a 8.000€ anuales y 240.000€ en total.'
  },
  {
    id: 'sialp',
    name: 'SIALP',
    description: 'Seguro de ahorro a largo plazo con exención fiscal',
    yield: 2.75,
    minInitialDeposit: 500,
    minMonthlyDeposit: 0,
    minTerm: 5,
    goal: 'maximizar_beneficios',
    taxation: 'Exento de tributación si se mantiene más de 5 años',
    disclaimer: 'Las aportaciones están limitadas a 5.000€ anuales.'
  },
  {
    id: 'plan-inversion-variable',
    name: 'Plan Inversión Variable',
    description: 'Mayores rendimientos a largo plazo',
    yield: 4.5,
    minInitialDeposit: 1000,
    minMonthlyDeposit: 100,
    minTerm: 5,
    goal: 'mas_retorno',
    taxation: 'El rescate tributa como rendimientos del capital en el IRPF',
    disclaimer: 'Rentabilidad estimada, no garantizada.'
  },
  {
    id: 'renta-vitalicia',
    name: 'Renta Vitalicia',
    description: 'Asegura ingresos para toda tu vida',
    yield: 3.8,
    minInitialDeposit: 10000,
    minMonthlyDeposit: 0,
    minTerm: 10,
    goal: 'ahorrar_jubilacion',
    taxation: 'Tributación reducida según edad',
    disclaimer: 'La renta se garantiza de por vida.'
  }
];
