export type Cents = number & { readonly __brand: 'Cents' };

export interface GameState {
  month: number;
  age: number;
  cash: Cents;
  monthlyIncome: Cents;
  livingExpenses: Cents;

  creditCard: {
    balance: Cents;
    limit: Cents;
    apr: number;
  };

  carLoan?: {
    remainingBalance: Cents;
    monthlyPayment: Cents;
    apr: number;
    remainingMonths: number;
    tier: 'used' | 'mid' | 'new';
  };

  creditScore: number;
  stressLevel: number;
  happiness: number;
  health: number;
  lifetimeInterestPaid: Cents;

  purchaseHistory: Array<{
    month: number;
    name: string;
    cost: Cents;
    category: string;
    paymentMethod: 'cash' | 'credit';
    icon?: string;

    // value mechanics
    currentValue?: Cents;
    depreciationRate?: number;

    // stat impacts
    happinessBoost?: number;
    healthBoost?: number;

    // ✅ NEW: richer scoring + stress impacts
    experienceScore?: number;  // 0..100
    investmentScore?: number;  // 0..100
    stressImpact?: number;     // -10..+10 (negative reduces stress)

    // ✅ NEW: categorize behavior/UI grouping
    lane?: 'essentials' | 'pleasure' | 'growth' | 'giving' | 'investing';

    // (optional) helpful for inventory UI
    recurring?: boolean;
  }>;

  subscriptions: Array<{
    name: string;
    monthlyCost: Cents;
    category: string;
    icon: string;

    happinessBoost?: number;
    healthBoost?: number;

    // ✅ NEW: optional subscription scoring
    experienceScore?: number;
    investmentScore?: number;
    stressImpact?: number;
    lane?: 'essentials' | 'pleasure' | 'growth' | 'giving' | 'investing';
  }>;
}

export interface Offer {
  id: string;
  month: number;
  type: 'temptation' | 'car' | 'subscription';
  category: string;
  cost: Cents;
  description: string;

  tier?: 'used' | 'mid' | 'new';

  // existing
  depreciationRate?: number;
  happinessBoost?: number;
  healthBoost?: number;
  recurring?: boolean;

  // ✅ NEW: UI / scoring metadata
  icon?: string;
  experienceScore?: number;  // 0..100
  investmentScore?: number;  // 0..100
  stressImpact?: number;     // -10..+10 (negative reduces stress)
  lane?: 'essentials' | 'pleasure' | 'growth' | 'giving' | 'investing';
}

export type PlayerDecision = {
  temptations: Array<{
    offerId: string;
    action: 'accept' | 'decline';
    paymentMethod?: 'cash' | 'credit';
  }>;

  creditCardPayment: { type: 'minimum' | 'full'; amount?: Cents };

  car?: {
    action: 'accept' | 'decline';
    tier?: 'used' | 'new' | 'luxury';
    loanTerm?: number;
  };

  // ✅ inventory selling
  itemsToSell?: Array<{
    index: number;    // index in purchaseHistory
    sellPrice: Cents; // usually currentValue
  }>;
};

export interface GameConfig {
  mode: 'normal' | 'hard';
  startingCash: Cents;
  startingIncome: Cents;
  livingExpenses: Cents;
  creditLimit: Cents;
  creditAPR: number;
  startingCreditScore: number;
}
