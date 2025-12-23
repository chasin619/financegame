// ===== FILE: ./lib/simulation/offers-config.ts =====
import { Cents } from '@/types/game';

export interface OfferTemplate {
  name: string;
  cost: Cents;
  category: string;
  icon?: string;

  // value mechanics
  depreciationRate?: number; // 0..1 (per month); 1.0 means "consumed" immediately
  recurring?: boolean;

  // player outcomes
  happinessBoost?: number;   // 0..10
  healthBoost?: number;      // 0..10
  stressImpact?: number;     // -10..+10 (negative reduces stress)

  // scores you asked for
  experienceScore?: number;  // 0..100
  investmentScore?: number;  // 0..100

  // lane grouping
  lane?: 'essentials' | 'pleasure' | 'growth' | 'giving' | 'investing';
}

export interface CarOfferTemplate {
  tier: 'used' | 'mid' | 'new';
  price: Cents;
  downPaymentPercent: number;
  description: string;
  reliability: string;
  features: string[];
}

/** ESSENTIALS (lane=essentials) */
export const ESSENTIALS_OFFERS: OfferTemplate[] = [
  { name: "Groceries upgrade (quality food)", cost: 8000 as Cents, category: "essentials", icon: "🧾", depreciationRate: 1.0, healthBoost: 2, happinessBoost: 1, stressImpact: -1, experienceScore: 2, investmentScore: 2, lane: "essentials" },
  { name: "Car insurance", cost: 12000 as Cents, category: "essentials", icon: "🛡️", recurring: true, happinessBoost: 0, healthBoost: 0, stressImpact: -2, experienceScore: 0, investmentScore: 5, lane: "essentials" },
  { name: "Phone plan", cost: 7000 as Cents, category: "essentials", icon: "📶", recurring: true, stressImpact: -1, experienceScore: 0, investmentScore: 2, lane: "essentials" },
  { name: "Internet plan", cost: 6000 as Cents, category: "essentials", icon: "🌐", recurring: true, stressImpact: -1, experienceScore: 0, investmentScore: 2, lane: "essentials" },
  { name: "Gas budget", cost: 10000 as Cents, category: "essentials", icon: "⛽", depreciationRate: 1.0, stressImpact: -1, experienceScore: 0, investmentScore: 0, lane: "essentials" },
];

/** PLEASURE (lane=pleasure) */
export const ENTERTAINMENT_OFFERS: OfferTemplate[] = [
  { name: "Concert tickets", cost: 6500 as Cents, category: "entertainment", icon: "🎵", depreciationRate: 1.0, happinessBoost: 6, stressImpact: -2, experienceScore: 75, investmentScore: 0, lane: "pleasure" },
  { name: "Video game", cost: 6000 as Cents, category: "entertainment", icon: "🎮", depreciationRate: 0.30, happinessBoost: 5, stressImpact: -1, experienceScore: 40, investmentScore: 0, lane: "pleasure" },
  { name: "Movie night", cost: 3500 as Cents, category: "social", icon: "🎬", depreciationRate: 1.0, happinessBoost: 4, stressImpact: -1, experienceScore: 25, investmentScore: 0, lane: "pleasure" },
  { name: "Streaming service", cost: 1500 as Cents, category: "entertainment", icon: "📺", recurring: true, happinessBoost: 2, stressImpact: -1, experienceScore: 15, investmentScore: 0, lane: "pleasure" },
  { name: "Music festival", cost: 75000 as Cents, category: "travel", icon: "🎪", depreciationRate: 1.0, happinessBoost: 8, stressImpact: -3, experienceScore: 95, investmentScore: 0, lane: "pleasure" },
];

/** TECH */
export const TECH_OFFERS: OfferTemplate[] = [
  { name: "New phone", cost: 19900 as Cents, category: "tech", icon: "📱", depreciationRate: 0.15, happinessBoost: 3, stressImpact: -1, experienceScore: 10, investmentScore: 5, lane: "pleasure" },
  { name: "Headphones", cost: 15000 as Cents, category: "tech", icon: "🎧", depreciationRate: 0.10, happinessBoost: 4, stressImpact: -1, experienceScore: 15, investmentScore: 0, lane: "pleasure" },
  { name: "Laptop upgrade", cost: 59900 as Cents, category: "tech", icon: "💻", depreciationRate: 0.12, happinessBoost: 2, stressImpact: -1, experienceScore: 5, investmentScore: 25, lane: "growth" },
];

/** HEALTH & FITNESS (lane=growth mostly) */
export const HEALTH_FITNESS_OFFERS: OfferTemplate[] = [
  { name: "Gym membership", cost: 5000 as Cents, category: "health", icon: "🏋️", recurring: true, healthBoost: 7, happinessBoost: 3, stressImpact: -3, experienceScore: 15, investmentScore: 35, lane: "growth" },
  { name: "Yoga classes", cost: 8000 as Cents, category: "health", icon: "🧘", depreciationRate: 1.0, healthBoost: 6, happinessBoost: 4, stressImpact: -4, experienceScore: 30, investmentScore: 20, lane: "growth" },
  { name: "Running shoes", cost: 12000 as Cents, category: "health", icon: "👟", depreciationRate: 0.25, healthBoost: 4, happinessBoost: 2, stressImpact: -2, experienceScore: 10, investmentScore: 15, lane: "growth" },
];

/** EDUCATION (lane=growth) */
export const EDUCATION_OFFERS: OfferTemplate[] = [
  { name: "Online course", cost: 15000 as Cents, category: "education", icon: "📚", depreciationRate: 0.0, happinessBoost: 1, stressImpact: 0, experienceScore: 10, investmentScore: 60, lane: "growth" },
  { name: "Professional certification", cost: 30000 as Cents, category: "education", icon: "🎓", depreciationRate: 0.0, happinessBoost: 2, stressImpact: 1, experienceScore: 10, investmentScore: 80, lane: "growth" },
];

/** INVESTING (lane=investing) */
export const INVESTING_OFFERS: OfferTemplate[] = [
  { name: "Index fund contribution", cost: 10000 as Cents, category: "investments", icon: "📈", depreciationRate: 0.0, happinessBoost: 0, stressImpact: -1, experienceScore: 0, investmentScore: 85, lane: "investing" },
  { name: "Roth IRA contribution", cost: 15000 as Cents, category: "investments", icon: "🏦", depreciationRate: 0.0, happinessBoost: 0, stressImpact: -1, experienceScore: 0, investmentScore: 90, lane: "investing" },
  { name: "High-yield savings deposit", cost: 8000 as Cents, category: "investments", icon: "💰", depreciationRate: 0.0, happinessBoost: 0, stressImpact: -2, experienceScore: 0, investmentScore: 70, lane: "investing" },
  { name: "Emergency fund deposit", cost: 10000 as Cents, category: "investments", icon: "🧯", depreciationRate: 0.0, happinessBoost: 0, stressImpact: -3, experienceScore: 0, investmentScore: 75, lane: "investing" },
];

/** GIVING (lane=giving) */
export const CHARITY_OFFERS: OfferTemplate[] = [
  { name: "Charity donation", cost: 5000 as Cents, category: "charity", icon: "💝", depreciationRate: 1.0, happinessBoost: 6, stressImpact: -1, experienceScore: 10, investmentScore: 5, lane: "giving" },
  { name: "Friend's birthday gift", cost: 3000 as Cents, category: "gift", icon: "🎁", depreciationRate: 1.0, happinessBoost: 5, stressImpact: -1, experienceScore: 15, investmentScore: 0, lane: "giving" },
];

export const TEMPTATION_OFFERS: OfferTemplate[] = [
  ...ESSENTIALS_OFFERS,
  ...ENTERTAINMENT_OFFERS,
  ...TECH_OFFERS,
  ...HEALTH_FITNESS_OFFERS,
  ...EDUCATION_OFFERS,
  ...INVESTING_OFFERS,
  ...CHARITY_OFFERS,
];

export const CAR_OFFERS: CarOfferTemplate[] = [
  {
    tier: 'used',
    price: 800000 as Cents,
    downPaymentPercent: 0.125,
    description: "Used Car (5-7 years old)",
    reliability: "Good",
    features: ["Reliable transportation", "Good gas mileage (30 MPG)", "Lower insurance costs"]
  },
  {
    tier: 'mid',
    price: 1800000 as Cents,
    downPaymentPercent: 0.125,
    description: "Mid-Range Car (2-3 years old)",
    reliability: "Excellent",
    features: ["Modern safety features", "Bluetooth & backup camera", "Better warranty coverage"]
  },
  {
    tier: 'new',
    price: 3200000 as Cents,
    downPaymentPercent: 0.125,
    description: "Brand New Car",
    reliability: "Excellent",
    features: ["Latest technology", "Full manufacturer warranty", "Premium sound system", "Advanced driver assist"]
  }
];

export function getCarLoanAPR(creditScore: number): number {
  if (creditScore >= 760) return 0.045;
  if (creditScore >= 700) return 0.065;
  if (creditScore >= 640) return 0.090;
  return 0.140;
}

export const CAR_LOAN_TERMS = [36, 60, 72] as const;

export const CAR_OWNERSHIP_COSTS = {
  insurance: 15000 as Cents,
  maintenance: 5000 as Cents,
  gas: 10000 as Cents,
  total: 30000 as Cents,
};
