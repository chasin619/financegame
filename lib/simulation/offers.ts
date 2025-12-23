import seedrandom from 'seedrandom';
import { Offer, Cents, GameState } from '@/types/game';
import { TEMPTATION_OFFERS, CAR_OFFERS, getCarLoanAPR } from './offers-config';

export { getCarLoanAPR };

export function generateOffers(state: GameState, runId: string): Offer[] {
  const seed = `${runId}-${state.month}`;
  const rng = seedrandom(seed);
  
  const offers: Offer[] = [];
  
  const numTemptations = Math.floor(rng() * 3) + 2;
  const shuffled = [...TEMPTATION_OFFERS].sort(() => rng() - 0.5);
  
  for (let i = 0; i < numTemptations && i < shuffled.length; i++) {
    const template = shuffled[i];
    offers.push({
      id: `tempt-${state.month}-${i}`,
      month: state.month,
      type: template.recurring ? 'subscription' : 'temptation',
      category: template.category,
      cost: template.cost,
      description: template.name,
      depreciationRate: template.depreciationRate,
      happinessBoost: template.happinessBoost,
      healthBoost: template.healthBoost,
      recurring: template.recurring,
    });
  }
  
  if (state.month >= 3 && !state.carLoan && state.month % 6 === 3) {
    for (const carTemplate of CAR_OFFERS) {
      offers.push({
        id: `car-${state.month}-${carTemplate.tier}`,
        month: state.month,
        type: 'car',
        category: 'transportation',
        cost: carTemplate.price,
        description: carTemplate.description,
        tier: carTemplate.tier,
      });
    }
  }
  
  return offers;
}