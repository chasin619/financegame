import { Cents } from '@/types/game';

export function toCents(dollars: number): Cents {
  return Math.round(dollars * 100) as Cents;
}

export function toDollars(cents: Cents): number {
  return cents / 100;
}

export function formatCurrency(cents: Cents): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(toDollars(cents));
}

export function calculateInterest(balance: Cents, apr: number): Cents {
  const monthlyRate = apr / 12;
  return Math.round(balance * monthlyRate) as Cents;
}

export function calculateMinimumPayment(
  balance: Cents,
  minPercent: number,
  minFloor: Cents
): Cents {
  const percentPayment = Math.round(balance * minPercent);
  return Math.max(percentPayment, minFloor) as Cents;
}

export function calculateCarLoanPayment(
  principal: Cents,
  apr: number,
  termMonths: number
): Cents {
  if (apr === 0) return Math.round(principal / termMonths) as Cents;
  
  const monthlyRate = apr / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  return Math.round(numerator / denominator) as Cents;
}