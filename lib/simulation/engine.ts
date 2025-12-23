import { GameState, PlayerDecision, Offer, Cents } from '@/types/game';
import { generateOffers } from './offers';
import { makeGuruDecisions } from './guru';
import { calculateInterest, calculateMinimumPayment, calculateCarLoanPayment } from './money';

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    tech: '📱',
    fashion: '👕',
    entertainment: '🎮',
    social: '🍽️',
    travel: '✈️',
    hobby: '🎨',
    transportation: '🚗',
    home: '🛋️',
    health: '🏋️',
    education: '📚',
    charity: '💝',
    gift: '🎁',
  };
  return icons[category] || '🛍️';
}

function updateHappinessAndHealth(state: GameState): void {
  // Base decay
  state.happiness = Math.max(0, state.happiness - 2);
  state.health = Math.max(0, state.health - 1);
  
  // Stress affects happiness and health
  if (state.stressLevel > 70) {
    state.happiness = Math.max(0, state.happiness - 5);
    state.health = Math.max(0, state.health - 3);
  } else if (state.stressLevel > 40) {
    state.happiness = Math.max(0, state.happiness - 2);
    state.health = Math.max(0, state.health - 1);
  }
  
  // Recent purchases boost (last 3 months)
  const recentPurchases = state.purchaseHistory.filter(p => state.month - p.month <= 3);
  for (const purchase of recentPurchases) {
    const age = state.month - purchase.month;
    const decay = 1 - (age * 0.3); // Diminishing returns over time
    
    if (purchase.happinessBoost) {
      state.happiness = Math.min(100, state.happiness + (purchase.happinessBoost * decay * 0.3));
    }
    if (purchase.healthBoost) {
      state.health = Math.min(100, state.health + (purchase.healthBoost * decay * 0.3));
    }
  }
  
  // Active subscriptions provide ongoing boosts
  for (const sub of state.subscriptions) {
    if (sub.healthBoost) {
      state.health = Math.min(100, state.health + sub.healthBoost * 0.5);
    }
    if (sub.happinessBoost) {
      state.happiness = Math.min(100, state.happiness + sub.happinessBoost * 0.5);
    }
  }
  
  // Ensure bounds
  state.happiness = Math.max(0, Math.min(100, state.happiness));
  state.health = Math.max(0, Math.min(100, state.health));
}

function depreciateItems(state: GameState): void {
  for (const item of state.purchaseHistory) {
    if (item.depreciationRate !== undefined) {
      // Initialize current value on first depreciation
      if (item.currentValue === undefined) {
        item.currentValue = item.cost;
      }
      
      // Apply monthly depreciation
      if (item.currentValue > 0 && item.depreciationRate > 0) {
        const monthlyDepreciation = Math.floor(item.cost * item.depreciationRate * 0.05) as Cents;
        item.currentValue = Math.max(0, item.currentValue - monthlyDepreciation) as Cents;
      }
    }
  }
}

export function processMonth(
  playerState: GameState,
  guruState: GameState,
  playerDecisions: PlayerDecision,
  offers: Offer[],
  runId: string
): {
  newPlayerState: GameState;
  newGuruState: GameState;
  newOffers: Offer[];
  guruExplanations: string[];
} {
  console.log('🎮 ========== PROCESSING MONTH START ==========');
  console.log('Player decisions:', JSON.stringify(playerDecisions, null, 2));
  console.log('Player starting cash:', playerState.cash);
  console.log('Player starting debt:', playerState.creditCard.balance);
  console.log('Player starting happiness:', playerState.happiness);
  console.log('Player starting health:', playerState.health);
  console.log('Offers:', offers.map(o => ({ id: o.id, desc: o.description, cost: o.cost })));
  
  // Deep clone states
  const newPlayerState = JSON.parse(JSON.stringify(playerState)) as GameState;
  const newGuruState = JSON.parse(JSON.stringify(guruState)) as GameState;

  // Ensure arrays exist
  if (!newPlayerState.purchaseHistory) newPlayerState.purchaseHistory = [];
  if (!newPlayerState.subscriptions) newPlayerState.subscriptions = [];
  if (!newGuruState.purchaseHistory) newGuruState.purchaseHistory = [];
  if (!newGuruState.subscriptions) newGuruState.subscriptions = [];

  // Income
  newPlayerState.cash += newPlayerState.monthlyIncome;
  newGuruState.cash += newGuruState.monthlyIncome;
  
  console.log('After income - Player cash:', newPlayerState.cash);

  // Living expenses
  if (newPlayerState.cash >= newPlayerState.livingExpenses) {
    newPlayerState.cash -= newPlayerState.livingExpenses;
  } else {
    const shortfall = newPlayerState.livingExpenses - newPlayerState.cash;
    newPlayerState.cash = 0 as Cents;
    newPlayerState.creditCard.balance += shortfall;
  }

  if (newGuruState.cash >= newGuruState.livingExpenses) {
    newGuruState.cash -= newGuruState.livingExpenses;
  } else {
    const shortfall = newGuruState.livingExpenses - newGuruState.cash;
    newGuruState.cash = 0 as Cents;
    newGuruState.creditCard.balance += shortfall;
  }
  
  console.log('After expenses - Player cash:', newPlayerState.cash, 'debt:', newPlayerState.creditCard.balance);

  // Process subscriptions (recurring monthly costs)
  console.log('💳 Processing subscriptions. Count:', newPlayerState.subscriptions.length);
  for (const sub of newPlayerState.subscriptions) {
    console.log('Charging subscription:', sub.name, sub.monthlyCost);
    if (newPlayerState.cash >= sub.monthlyCost) {
      newPlayerState.cash -= sub.monthlyCost;
    } else {
      const shortfall = sub.monthlyCost - newPlayerState.cash;
      newPlayerState.cash = 0 as Cents;
      newPlayerState.creditCard.balance += shortfall;
    }
  }
  
  for (const sub of newGuruState.subscriptions) {
    if (newGuruState.cash >= sub.monthlyCost) {
      newGuruState.cash -= sub.monthlyCost;
    } else {
      const shortfall = sub.monthlyCost - newGuruState.cash;
      newGuruState.cash = 0 as Cents;
      newGuruState.creditCard.balance += shortfall;
    }
  }

  // Car loan payments
  if (newPlayerState.carLoan) {
    const payment = newPlayerState.carLoan.monthlyPayment;
    if (newPlayerState.cash >= payment) {
      newPlayerState.cash -= payment;
    } else {
      const shortfall = payment - newPlayerState.cash;
      newPlayerState.cash = 0 as Cents;
      newPlayerState.creditCard.balance += shortfall;
    }

    const interest = calculateInterest(newPlayerState.carLoan.remainingBalance, newPlayerState.carLoan.apr);
    const principal = payment - interest;
    newPlayerState.carLoan.remainingBalance -= principal;
    newPlayerState.carLoan.remainingMonths -= 1;
    newPlayerState.lifetimeInterestPaid += interest;

    if (newPlayerState.carLoan.remainingMonths <= 0) {
      newPlayerState.carLoan = undefined;
    }
  }

  if (newGuruState.carLoan) {
    const payment = newGuruState.carLoan.monthlyPayment;
    if (newGuruState.cash >= payment) {
      newGuruState.cash -= payment;
    } else {
      const shortfall = payment - newGuruState.cash;
      newGuruState.cash = 0 as Cents;
      newGuruState.creditCard.balance += shortfall;
    }

    const interest = calculateInterest(newGuruState.carLoan.remainingBalance, newGuruState.carLoan.apr);
    const principal = payment - interest;
    newGuruState.carLoan.remainingBalance -= principal;
    newGuruState.carLoan.remainingMonths -= 1;
    newGuruState.lifetimeInterestPaid += interest;

    if (newGuruState.carLoan.remainingMonths <= 0) {
      newGuruState.carLoan = undefined;
    }
  }

  // Process item sales
  // Process item sales
if (playerDecisions.itemsToSell && playerDecisions.itemsToSell.length > 0) {
    console.log('💰 Selling items:', playerDecisions.itemsToSell);
  
    for (const sale of playerDecisions.itemsToSell) {
      const item = newPlayerState.purchaseHistory[sale.index];
      if (!item) continue;
  
      const sellPrice = (sale.sellPrice ?? item.currentValue ?? 0) as Cents;
  
      if (sellPrice > 0) {
        newPlayerState.cash += sellPrice;
        console.log(`Sold ${item.name} for ${sellPrice}`);
  
        // Mark as sold
        item.currentValue = 0 as Cents;
      }
    }
  }
  

  // Process temptation purchases
  console.log('🛍️ Processing temptations. Count:', playerDecisions.temptations.length);
  
  for (const decision of playerDecisions.temptations) {
    console.log('Processing temptation decision:', decision);
    
    if (decision.action === 'accept') {
      const offer = offers.find(o => o.id === decision.offerId);
      console.log('Found offer:', offer);
      
      if (!offer) {
        console.log('⚠️ OFFER NOT FOUND:', decision.offerId);
        continue;
      }

      // Handle subscriptions
      if (offer.recurring) {
        const existingSub = newPlayerState.subscriptions.find(s => s.name === offer.description);
        if (!existingSub) {
          newPlayerState.subscriptions.push({
            name: offer.description,
            monthlyCost: offer.cost,
            category: offer.category,
            icon: getCategoryIcon(offer.category),
            happinessBoost: offer.happinessBoost,
            healthBoost: offer.healthBoost,
          });
          console.log('✅ Added subscription:', offer.description);
        }
      } else {
        // Regular purchase
        if (decision.paymentMethod === 'cash') {
          console.log('💵 Paying with CASH:', offer.cost / 100);
          newPlayerState.cash -= offer.cost;
        } else {
          console.log('💳 Paying with CREDIT:', offer.cost / 100);
          newPlayerState.creditCard.balance += offer.cost;
        }

        // Track the purchase
        const purchase = {
          month: newPlayerState.month,
          name: offer.description,
          cost: offer.cost,
          category: offer.category,
          paymentMethod: decision.paymentMethod!,
          icon: getCategoryIcon(offer.category),
          currentValue: offer.cost,
          depreciationRate: offer.depreciationRate || 0,
          happinessBoost: offer.happinessBoost,
          healthBoost: offer.healthBoost,
        };
        
        newPlayerState.purchaseHistory.push(purchase);
        console.log('✅ Added purchase to history:', purchase);
        
        // Apply immediate boosts
        if (offer.happinessBoost) {
          newPlayerState.happiness = Math.min(100, newPlayerState.happiness + offer.happinessBoost);
        }
        if (offer.healthBoost) {
          newPlayerState.health = Math.min(100, newPlayerState.health + offer.healthBoost);
        }
      }
    }
  }
  
  console.log('After temptations:');
  console.log('Player cash:', newPlayerState.cash);
  console.log('Player debt:', newPlayerState.creditCard.balance);
  console.log('Player purchases:', newPlayerState.purchaseHistory.length);
  console.log('Player subscriptions:', newPlayerState.subscriptions.length);

  // Process car purchases
  if (playerDecisions.car?.action === 'accept') {
    const carOffer = offers.find(o => o.type === 'car' && o.tier === playerDecisions.car?.tier);
    if (carOffer) {
      const downPayment = Math.floor(carOffer.cost * 0.125) as Cents;
      const loanAmount = (carOffer.cost - downPayment) as Cents;
      const apr = newPlayerState.creditScore >= 760 ? 0.045 : 
                  newPlayerState.creditScore >= 700 ? 0.065 : 
                  newPlayerState.creditScore >= 640 ? 0.090 : 0.140;
      const term = playerDecisions.car.loanTerm || 36;
      const monthlyPayment = calculateCarLoanPayment(loanAmount, apr, term);

      newPlayerState.cash -= downPayment;
      newPlayerState.carLoan = {
        remainingBalance: loanAmount,
        monthlyPayment,
        apr,
        remainingMonths: term,
        tier: playerDecisions.car.tier,
      };
    }
  }

  // Guru decisions
  console.log('🧙 Processing Guru decisions');
  const guruResult = makeGuruDecisions(newGuruState, offers);
  const guruDecisions = {
    temptations: guruResult.temptations || [],
    creditCardPayment: guruResult.creditCardPayment || { type: 'minimum' as const },
    car: guruResult.car,
  };
  const explanations = guruResult.explanations || [];

  for (const decision of guruDecisions.temptations) {
    if (decision.action === 'accept') {
      const offer = offers.find(o => o.id === decision.offerId);
      if (!offer) continue;

      if (offer.recurring) {
        const existingSub = newGuruState.subscriptions.find(s => s.name === offer.description);
        if (!existingSub) {
          newGuruState.subscriptions.push({
            name: offer.description,
            monthlyCost: offer.cost,
            category: offer.category,
            icon: getCategoryIcon(offer.category),
            happinessBoost: offer.happinessBoost,
            healthBoost: offer.healthBoost,
          });
        }
      } else {
        if (decision.paymentMethod === 'cash') {
          newGuruState.cash -= offer.cost;
        } else {
          newGuruState.creditCard.balance += offer.cost;
        }

        newGuruState.purchaseHistory.push({
          month: newGuruState.month,
          name: offer.description,
          cost: offer.cost,
          category: offer.category,
          paymentMethod: decision.paymentMethod!,
          icon: getCategoryIcon(offer.category),
          currentValue: offer.cost,
          depreciationRate: offer.depreciationRate || 0,
          happinessBoost: offer.happinessBoost,
          healthBoost: offer.healthBoost,
        });
        
        if (offer.happinessBoost) {
          newGuruState.happiness = Math.min(100, newGuruState.happiness + offer.happinessBoost);
        }
        if (offer.healthBoost) {
          newGuruState.health = Math.min(100, newGuruState.health + offer.healthBoost);
        }
      }
    }
  }

  if (guruDecisions.car?.action === 'accept') {
    const carOffer = offers.find(o => o.type === 'car' && o.tier === guruDecisions.car?.tier);
    if (carOffer) {
      const downPayment = Math.floor(carOffer.cost * 0.125) as Cents;
      const loanAmount = (carOffer.cost - downPayment) as Cents;
      const apr = newGuruState.creditScore >= 760 ? 0.045 : 
                  newGuruState.creditScore >= 700 ? 0.065 : 
                  newGuruState.creditScore >= 640 ? 0.090 : 0.140;
      const term = guruDecisions.car.loanTerm || 36;
      const monthlyPayment = calculateCarLoanPayment(loanAmount, apr, term);

      newGuruState.cash -= downPayment;
      newGuruState.carLoan = {
        remainingBalance: loanAmount,
        monthlyPayment,
        apr,
        remainingMonths: term,
        tier: guruDecisions.car.tier,
      };
    }
  }

  console.log('Before interest:');
  console.log('Player debt:', newPlayerState.creditCard.balance);

  // Credit card interest
  const playerInterest = calculateInterest(newPlayerState.creditCard.balance, newPlayerState.creditCard.apr);
  newPlayerState.creditCard.balance += playerInterest;
  newPlayerState.lifetimeInterestPaid += playerInterest;
  
  console.log('Interest charged:', playerInterest);
  console.log('After interest - Player debt:', newPlayerState.creditCard.balance);

  const guruInterest = calculateInterest(newGuruState.creditCard.balance, newGuruState.creditCard.apr);
  newGuruState.creditCard.balance += guruInterest;
  newGuruState.lifetimeInterestPaid += guruInterest;

  // Credit card payments
  console.log('💳 Processing payment. Type:', playerDecisions.creditCardPayment.type);
  
  if (playerDecisions.creditCardPayment.type === 'full' && newPlayerState.creditCard.balance > 0) {
    const payment = Math.min(newPlayerState.creditCard.balance, newPlayerState.cash);
    console.log('Paying FULL:', payment);
    newPlayerState.cash -= payment;
    newPlayerState.creditCard.balance -= payment;
  } else if (playerDecisions.creditCardPayment.type === 'minimum' && newPlayerState.creditCard.balance > 0) {
    const minPayment = calculateMinimumPayment(newPlayerState.creditCard.balance, 0.02, 2500 as Cents);
    const payment = Math.min(minPayment, newPlayerState.cash);
    console.log('Paying MINIMUM:', payment, '(required:', minPayment, ')');
    newPlayerState.cash -= payment;
    newPlayerState.creditCard.balance -= payment;
  } else if (playerDecisions.creditCardPayment.type === 'custom' && playerDecisions.creditCardPayment.amount && newPlayerState.creditCard.balance > 0) {
    const payment = Math.min(playerDecisions.creditCardPayment.amount, newPlayerState.cash, newPlayerState.creditCard.balance);
    console.log('Paying CUSTOM:', payment);
    newPlayerState.cash -= payment;
    newPlayerState.creditCard.balance -= payment;
  }
  
  console.log('After payment - Player cash:', newPlayerState.cash, 'debt:', newPlayerState.creditCard.balance);
  
  if (guruDecisions.creditCardPayment.type === 'full' && newGuruState.creditCard.balance > 0) {
    const payment = Math.min(newGuruState.creditCard.balance, newGuruState.cash);
    newGuruState.cash -= payment;
    newGuruState.creditCard.balance -= payment;
  } else if (guruDecisions.creditCardPayment.type === 'minimum' && newGuruState.creditCard.balance > 0) {
    const minPayment = calculateMinimumPayment(newGuruState.creditCard.balance, 0.02, 2500 as Cents);
    const payment = Math.min(minPayment, newGuruState.cash);
    newGuruState.cash -= payment;
    newGuruState.creditCard.balance -= payment;
  }

  // Update credit scores
  updateCreditScore(newPlayerState);
  updateCreditScore(newGuruState);

  // Update stress levels
  updateStressLevel(newPlayerState);
  updateStressLevel(newGuruState);
  
  // Update happiness and health
  updateHappinessAndHealth(newPlayerState);
  updateHappinessAndHealth(newGuruState);
  
  // Depreciate items
  depreciateItems(newPlayerState);
  depreciateItems(newGuruState);

  // Check for income milestones
  checkIncomeMilestones(newPlayerState);
  checkIncomeMilestones(newGuruState);

  // Increment month and age
  newPlayerState.month += 1;
  newPlayerState.age += 1/12;
  newGuruState.month += 1;
  newGuruState.age += 1/12;

  // Generate new offers
  const newOffers = generateOffers(newPlayerState, runId);
  
  console.log('🏁 PROCESSING MONTH END');
  console.log('Final player cash:', newPlayerState.cash);
  console.log('Final player debt:', newPlayerState.creditCard.balance);
  console.log('Final player purchases:', newPlayerState.purchaseHistory.length);
  console.log('Final player happiness:', newPlayerState.happiness);
  console.log('Final player health:', newPlayerState.health);
  console.log('==========================================\n');

  return {
    newPlayerState,
    newGuruState,
    newOffers,
    guruExplanations: explanations,
  };
}

function updateCreditScore(state: GameState): void {
  const minPayment = calculateMinimumPayment(state.creditCard.balance, 0.02, 2500 as Cents);
  
  if (state.creditCard.balance === 0) {
    state.creditScore += 2;
  } else if (state.cash >= minPayment) {
    state.creditScore += 1;
  } else {
    state.creditScore -= 50;
  }

  const utilization = state.creditCard.balance / state.creditCard.limit;
  if (utilization > 0.8) {
    state.creditScore -= 3;
  } else if (utilization < 0.3) {
    state.creditScore += 1;
  }

  if (state.month % 12 === 0) {
    state.creditScore += 5;
  }

  state.creditScore = Math.max(300, Math.min(850, state.creditScore));
}

function updateStressLevel(state: GameState): void {
  const totalDebt = state.creditCard.balance + (state.carLoan?.remainingBalance || 0);
  const monthlyIncome = state.monthlyIncome;
  const debtRatio = totalDebt / (monthlyIncome * 6);

  const cashBuffer = state.cash / monthlyIncome;
  const utilization = state.creditCard.balance / state.creditCard.limit;

  let stress = 0;
  stress += Math.min(debtRatio * 50, 50);
  stress += Math.max(0, (1 - cashBuffer) * 20);
  stress += utilization * 30;

  state.stressLevel = Math.max(0, Math.min(100, stress));
}

function checkIncomeMilestones(state: GameState): void {
  const milestones = [6, 12, 18, 24, 30, 36, 48];
  
  if (milestones.includes(state.month)) {
    const increase = Math.floor(state.monthlyIncome * (Math.random() * 0.07 + 0.05)) as Cents;
    state.monthlyIncome += increase;
  }
}