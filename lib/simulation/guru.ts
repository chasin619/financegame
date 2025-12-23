// ===== FILE: ./lib/simulation/guru.ts =====
import { GameState, PlayerDecision, Offer, Cents } from '@/types/game';

export function makeGuruDecisions(
  state: GameState,
  offers: Offer[]
): {
  temptations: Array<{
    offerId: string;
    action: 'accept' | 'decline';
    paymentMethod?: 'cash' | 'credit';
  }>;
  car?: {
    action: 'accept' | 'decline';
    tier?: 'used' | 'mid' | 'new';
    loanTerm?: number;
  };
  creditCardPayment: {
    type: 'minimum' | 'full';
  };
  explanations: string[];
} {
  const explanations: string[] = [];
  const decisions: PlayerDecision = {
    temptations: [],
    creditCardPayment: { type: 'minimum' },
  };

  // --- Guardrails (Guru should be disciplined) ---
  const EMERGENCY_FUND_TARGET = 150000 as Cents; // $1,500
  const BUFFER_AMOUNT = 50000 as Cents;          // $500 kept untouched
  const MAX_ITEMS_PER_MONTH = 1;
  const MAX_SPEND_RATIO = 0.05;                  // spend max 5% of monthly income on non-essentials
  const MAX_RECURRING_TOTAL = 20000 as Cents;    // $200/mo recurring cap
  const MAX_SINGLE_PURCHASE = 35000 as Cents;    // $350 max for a temptation item

  const currentEmergencyFund = state.cash;
  const hasEmergencyFund = currentEmergencyFund >= EMERGENCY_FUND_TARGET;

  const availableCashAfterBuffer = Math.max(0, state.cash - BUFFER_AMOUNT) as Cents;
  const monthlySpendCap = Math.round(state.monthlyIncome * MAX_SPEND_RATIO) as Cents;

  // Helper: compute current recurring total from state (if present)
  const currentRecurringTotal = (state.subscriptions || []).reduce((sum, s) => sum + (s.monthlyCost || 0), 0 as Cents);

  // Helper: “good” categories
  const isGoodCategory = (cat?: string) =>
    cat === 'health' || cat === 'education' || cat === 'charity' || cat === 'home';

  const boostScore = (o: Offer) => (o.happinessBoost || 0) + (o.healthBoost || 0);

  // RULE 1: No emergency fund => decline all temptations and car
  if (!hasEmergencyFund) {
    explanations.push(
      `Building emergency fund (${formatCents(currentEmergencyFund)}/${formatCents(
        EMERGENCY_FUND_TARGET
      )}) — declining all non-essentials`
    );

    for (const offer of offers) {
      if (offer.type === 'temptation' || offer.type === 'subscription') {
        decisions.temptations.push({ offerId: offer.id, action: 'decline' });
      }
    }

    if (offers.some(o => o.type === 'car')) {
      decisions.car = { action: 'decline' };
      explanations.push('Declining car — emergency fund not complete');
    }

    // Credit card rule still applies below
  } else {
    explanations.push(
      `Emergency fund complete. Buffer kept: ${formatCents(BUFFER_AMOUNT)}. Monthly fun cap: ${formatCents(
        monthlySpendCap
      )}`
    );

    // --- Handle temptations/subscriptions with strict caps ---
    let itemsAccepted = 0;
    let spentThisMonth = 0 as Cents;
    let plannedRecurring = 0 as Cents;

    // Prefer high-value offers first (health/education/charity w/ boosts)
    const sortedOffers = [...offers].sort((a, b) => {
      const aScore = (isGoodCategory(a.category) ? 10 : 0) + boostScore(a);
      const bScore = (isGoodCategory(b.category) ? 10 : 0) + boostScore(b);
      return bScore - aScore;
    });

    for (const offer of sortedOffers) {
      if (offer.type !== 'temptation' && offer.type !== 'subscription') continue;

      // Default decline
      let action: 'accept' | 'decline' = 'decline';
      let paymentMethod: 'cash' | 'credit' | undefined;

      // Never use credit as Guru (keeps discipline)
      const canUseCash =
        availableCashAfterBuffer - spentThisMonth >= offer.cost &&
        spentThisMonth + offer.cost <= monthlySpendCap;

      // SUBSCRIPTIONS: only accept if boosts are strong AND recurring cap allows
      if (offer.recurring) {
        const score = boostScore(offer);
        const recurringWouldBe = (currentRecurringTotal + plannedRecurring + offer.cost) as Cents;

        const worthIt = score >= 6 && isGoodCategory(offer.category); // only “good” recurring
        const withinRecurringCap = recurringWouldBe <= MAX_RECURRING_TOTAL;

        if (worthIt && withinRecurringCap) {
          action = 'accept';
          paymentMethod = 'cash';
          plannedRecurring += offer.cost;
          explanations.push(
            `Subscribed to ${offer.description} (${formatCents(offer.cost)}/mo) — boosts=${score}, recurring total stays under ${formatCents(
              MAX_RECURRING_TOTAL
            )}`
          );
        } else {
          const reason = !worthIt
            ? `boosts too low or not a good category`
            : `recurring cap exceeded`;
          explanations.push(`Declined subscription ${offer.description} — ${reason}`);
        }
      } else {
        // ONE-TIME PURCHASES: accept max 1 item, only if “good” or very small
        const score = boostScore(offer);
        const isCheap = offer.cost <= 15000; // $150
        const isAllowedCategory = isGoodCategory(offer.category) || (isCheap && score > 0);

        const withinSingleLimit = offer.cost <= MAX_SINGLE_PURCHASE;

        if (
          itemsAccepted < MAX_ITEMS_PER_MONTH &&
          isAllowedCategory &&
          withinSingleLimit &&
          canUseCash
        ) {
          action = 'accept';
          paymentMethod = 'cash';
          spentThisMonth += offer.cost;
          itemsAccepted += 1;
          explanations.push(
            `Bought ${offer.description} with cash (${formatCents(offer.cost)}) — items this month: ${itemsAccepted}/${MAX_ITEMS_PER_MONTH}`
          );
        } else {
          // Keep explanation short to avoid spam
          // (you can remove this if you want fewer logs)
        }
      }

      decisions.temptations.push({ offerId: offer.id, action, paymentMethod });
    }

    // --- Car decision (only “used”, only if affordable + not stressed by obligations) ---
    const carOffers = offers.filter(o => o.type === 'car');
    if (carOffers.length > 0 && !state.carLoan) {
      // buy used only if credit is decent + down payment affordable + monthly income can handle it
      const used = carOffers.find(o => o.tier === 'used') || carOffers[0];
      const downPayment = Math.floor(used.cost * 0.125) as Cents;

      const hasDownPayment = availableCashAfterBuffer >= downPayment;
      const creditOk = state.creditScore >= 680;

      if (hasDownPayment && creditOk) {
        decisions.car = { action: 'accept', tier: used.tier || 'used', loanTerm: 36 };
        explanations.push(
          `Bought used car — down payment ${formatCents(downPayment)} is affordable and credit score is ${state.creditScore}`
        );
      } else {
        decisions.car = { action: 'decline' };
        explanations.push(
          `Declined car — ${!hasDownPayment ? 'not enough down payment' : 'credit score too low'}`
        );
      }
    } else if (state.carLoan) {
      explanations.push('Already has a car');
    }
  }

  // RULE 3: Always pay credit card in full if possible
  if (state.creditCard.balance > 0) {
    if (state.cash >= state.creditCard.balance) {
      decisions.creditCardPayment = { type: 'full' };
      explanations.push(`Paying credit card in full (${formatCents(state.creditCard.balance)}) — avoid interest`);
    } else {
      decisions.creditCardPayment = { type: 'minimum' };
      explanations.push(`Paying minimum — will prioritize payoff next month`);
    }
  } else {
    decisions.creditCardPayment = { type: 'minimum' };
  }

  return {
    temptations: decisions.temptations,
    car: decisions.car,
    creditCardPayment: decisions.creditCardPayment,
    explanations,
  };
}

function formatCents(cents: Cents): string {
  return `$${(cents / 100).toFixed(0)}`;
}
