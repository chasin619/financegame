import { GameState, GameConfig, Cents } from '@/types/game';

export const NORMAL_MODE: GameConfig = {
  mode: 'normal',
  startingCash: 200000 as Cents,
  startingIncome: 240000 as Cents,
  livingExpenses: 120000 as Cents,
  creditLimit: 50000 as Cents,
  creditAPR: 0.24,
  startingCreditScore: 620,
};

export const HARD_MODE: GameConfig = {
  mode: 'hard',
  startingCash: 100000 as Cents,
  startingIncome: 200000 as Cents,
  livingExpenses: 140000 as Cents,
  creditLimit: 50000 as Cents,
  creditAPR: 0.29,
  startingCreditScore: 580,
};

export const GAME_CONFIGS = {
  normal: NORMAL_MODE,
  hard: HARD_MODE,
};

export const INITIAL_STATE: GameState = {
  month: 0,
  age: 16,
  cash: 200000 as Cents,
  monthlyIncome: 240000 as Cents,
  livingExpenses: 120000 as Cents,
  
  creditCard: {
    balance: 0 as Cents,
    limit: 50000 as Cents,
    apr: 0.24,
  },
  
  creditScore: 620,
  stressLevel: 0,
  happiness: 70, // NEW: Start at 70/100
  health: 80, // NEW: Start at 80/100
  lifetimeInterestPaid: 0 as Cents,
  purchaseHistory: [],
  subscriptions: [], // NEW
};

export function createInitialState(config: GameConfig): GameState {
  return {
    month: 0,
    age: 16,
    cash: config.startingCash,
    monthlyIncome: config.startingIncome,
    livingExpenses: config.livingExpenses,
    
    creditCard: {
      balance: 0 as Cents,
      limit: config.creditLimit,
      apr: config.creditAPR,
    },
    
    creditScore: config.startingCreditScore,
    stressLevel: 0,
    happiness: 70,
    health: 80,
    lifetimeInterestPaid: 0 as Cents,
    purchaseHistory: [],
    subscriptions: [],
  };
}

export const INCOME_MILESTONES = [6, 12, 18, 24, 30, 36, 48];

// NEW: Recurring expenses
export const MONTHLY_RECURRING_EXPENSES = {
  phone: 5000 as Cents, // $50
  internet: 6000 as Cents, // $60
  streaming: 1500 as Cents, // $15
};