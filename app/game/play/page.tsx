'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GameState, Offer, PlayerDecision, Cents } from '@/types/game';
import { formatCurrency } from '@/lib/simulation/money';

/**
 * UI-only logic:
 * - lanes (grouping)
 * - preview calculations
 * - inventory details rendering
 * - stress heuristic + preview stress delta
 *
 * Engine truth still lives in lib/simulation (guru policy, offer gen, monthly sim).
 */

type LaneKey = 'essentials' | 'investing' | 'growth' | 'giving' | 'pleasure';

type Preview = {
  cash: number;
  debt: number;
  newSubMonthly: number;
  happiness: number;
  health: number;
  stressDelta: number; // UI-only: sum of stress impacts from accepted offers
  soldIndexes: Set<number>;
  pendingPurchases: Array<{
    month: number;
    name: string;
    cost: Cents;
    category: string;
    paymentMethod: 'cash' | 'credit';
    icon?: string;
    currentValue?: Cents;
    depreciationRate?: number;
    happinessBoost?: number;
    healthBoost?: number;
    recurring?: boolean;
    lane?: LaneKey;

    // ✅ NEW (from types): richer scoring
    experienceScore?: number;
    investmentScore?: number;
    stressImpact?: number;
  }>;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Simple UI-only stress heuristic (0..100).
// Higher when debt load + monthly obligations are high vs income.
function computeStress(state: GameState, monthlyObligations: number) {
  const income = Math.max(1, Number((state as any).monthlyIncome || 0));
  const debt = Number(state.creditCard?.balance || 0);

  const debtRatio = clamp(debt / (income * 6), 0, 2); // debt compared to 6 months income
  const obligRatio = clamp(monthlyObligations / income, 0, 2);

  const stress = 15 + debtRatio * 45 + obligRatio * 35;
  return clamp(Math.round(stress), 0, 100);
}

function getIconForCategory(category: string) {
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
    donation: '💝',
    gift: '🎁',
    essentials: '🧾',
    groceries: '🛒',
    rent: '🏠',
    mortgage: '🏠',
    insurance: '🛡️',
    phone: '📞',
    internet: '📶',
    gas: '⛽',
    taxes: '🧾',
    utilities: '💡',
    investing: '📈',
    investments: '📈',
    emergency_fund: '🧯',
    efund: '🧯',
    index_fund: '📈',
    retirement: '🏦',
    '401k': '🏦',
    roth: '🏦',
  };
  return icons[category] || '🛍️';
}

function normalizeCategory(category?: string) {
  return (category || '').trim().toLowerCase();
}

function normalizeLane(lane?: string): LaneKey | null {
  const v = normalizeCategory(lane);
  if (v === 'essentials') return 'essentials';
  if (v === 'giving') return 'giving';
  if (v === 'growth') return 'growth';
  if (v === 'pleasure' || v === 'lifestyle') return 'pleasure';
  if (v === 'investing' || v === 'investments') return 'investing';
  return null;
}

function pickLane(offer: Offer): LaneKey {
  const cat = normalizeCategory((offer as any).category);
  const explicit = normalizeLane((offer as any).lane);
  if (explicit) return explicit;

  // Essentials
  if (
    ['essentials', 'groceries', 'rent', 'mortgage', 'insurance', 'phone', 'internet', 'gas', 'taxes', 'utilities'].includes(cat)
  ) {
    return 'essentials';
  }

  // Giving
  if (['charity', 'donation', 'giving', 'gift'].includes(cat)) {
    return 'giving';
  }

  // Investing (money bucket)
  if (['investing', 'investments', 'index_fund', 'retirement', 'roth', '401k', 'emergency_fund', 'efund'].includes(cat)) {
    return 'investing';
  }

  // Growth (skills/body)
  if (['education', 'health'].includes(cat)) {
    return 'growth';
  }

  // Pleasure default
  return 'pleasure';
}

function sumOfferStressImpact(offer: Offer) {
  const s = Number((offer as any).stressImpact ?? 0);
  return clamp(s, -25, 25);
}

function computePreview(player: GameState, decisions: PlayerDecision, offers: Offer[], month: number): Preview {
  let cash = Number(player.cash || 0);
  let debt = Number(player.creditCard?.balance || 0);

  let newSubMonthly = 0;
  let happiness = Number(player.happiness ?? 0);
  let health = Number(player.health ?? 0);
  let stressDelta = 0;

  const soldIndexes = new Set<number>((decisions.itemsToSell || []).map(s => s.index));

  // SELL preview (cash increases immediately)
  for (const sale of decisions.itemsToSell || []) {
    const item = player.purchaseHistory?.[sale.index];
    if (!item) continue;
    const sellPrice = Number(sale.sellPrice ?? item.currentValue ?? 0);
    cash += sellPrice;
  }

  const pendingPurchases: Preview['pendingPurchases'] = [];

  for (const d of decisions.temptations || []) {
    if (d.action !== 'accept') continue;
    const offer = offers.find(o => o.id === d.offerId);
    if (!offer) continue;

    const lane = pickLane(offer);
    const icon = (offer as any).icon || getIconForCategory(String((offer as any).category || offer.type));

    // Subscriptions: do NOT change cash/debt instantly (monthly obligation)
    if (offer.recurring || offer.type === 'subscription') {
      newSubMonthly += Number(offer.cost);

      if (offer.happinessBoost) happiness += offer.happinessBoost;
      if (offer.healthBoost) health += offer.healthBoost;
      stressDelta += sumOfferStressImpact(offer);

      pendingPurchases.push({
        month,
        name: offer.description,
        cost: offer.cost,
        category: String((offer as any).category || 'subscription'),
        paymentMethod: 'cash',
        icon,
        recurring: true,
        happinessBoost: offer.happinessBoost,
        healthBoost: offer.healthBoost,
        lane,
        experienceScore: (offer as any).experienceScore,
        investmentScore: (offer as any).investmentScore,
        stressImpact: (offer as any).stressImpact,
      });

      continue;
    }

    // One-time purchases: affect cash/debt now.
    if (d.paymentMethod === 'cash') cash -= Number(offer.cost);
    if (d.paymentMethod === 'credit') debt += Number(offer.cost);

    // Depreciation preview for "stuff"
    const cat = normalizeCategory((offer as any).category);
    const isInvestmentLike =
      lane === 'investing' && !['tech', 'fashion', 'entertainment', 'travel', 'social'].includes(cat);

    const defaultDep = isInvestmentLike ? 0.05 : 0.30; // UI-only
    const dep = clamp(Number((offer as any).depreciationRate ?? defaultDep), 0, 0.9);
    const currentValue = Math.max(0, Math.floor(Number(offer.cost) * (1 - dep))) as Cents;

    if (offer.happinessBoost) happiness += offer.happinessBoost;
    if (offer.healthBoost) health += offer.healthBoost;
    stressDelta += sumOfferStressImpact(offer);

    pendingPurchases.push({
      month,
      name: offer.description,
      cost: offer.cost,
      category: String((offer as any).category || offer.type),
      paymentMethod: (d.paymentMethod || 'cash') as 'cash' | 'credit',
      icon,
      currentValue,
      depreciationRate: (offer as any).depreciationRate,
      happinessBoost: offer.happinessBoost,
      healthBoost: offer.healthBoost,
      lane,
      experienceScore: (offer as any).experienceScore,
      investmentScore: (offer as any).investmentScore,
      stressImpact: (offer as any).stressImpact,
    });
  }

  return {
    cash,
    debt,
    newSubMonthly,
    happiness: clamp(happiness, 0, 100),
    health: clamp(health, 0, 100),
    stressDelta: clamp(stressDelta, -40, 40),
    soldIndexes,
    pendingPurchases,
  };
}

function calcAssetsValue(items: Array<any>, soldIndexes?: Set<number>) {
  let total = 0;
  items.forEach((it, idx) => {
    if (soldIndexes?.has(idx)) return;
    const cv = it.currentValue ?? it.cost ?? 0;
    const v = Number(cv);
    if (v > 0) total += v;
  });
  return total;
}

// Derive "emergency fund" balance from items in purchaseHistory by name/category (UI-only until engine supports explicit bucket)
function deriveEmergencyFundBalance(items: any[], soldIndexes?: Set<number>) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (soldIndexes?.has(i)) continue;
    const it = items[i];
    const name = String(it.name || '').toLowerCase();
    const cat = String(it.category || '').toLowerCase();
    const isEFund =
      cat.includes('emergency') || cat === 'efund' || cat === 'emergency_fund' || name.includes('emergency fund');
    if (!isEFund) continue;

    const balance = Number(it.currentValue ?? it.cost ?? 0);
    if (balance > 0) total += balance;
  }
  return total;
}

function groupOffersByLane(offers: Offer[]) {
  const lanes: Record<LaneKey, Offer[]> = {
    essentials: [],
    investing: [],
    growth: [],
    giving: [],
    pleasure: [],
  };

  for (const o of offers) {
    if (o.type === 'car') {
      lanes.pleasure.push(o);
      continue;
    }
    lanes[pickLane(o)].push(o);
  }

  return lanes;
}

function laneMeta(lane: LaneKey) {
  if (lane === 'essentials') return { title: 'ESSENTIALS', subtitle: 'Bills & needs (rent, groceries, insurance)', icon: '🧾' };
  if (lane === 'investing') return { title: 'INVESTING', subtitle: 'Build wealth + safety (funds, emergency fund)', icon: '📈' };
  if (lane === 'growth') return { title: 'GROWTH', subtitle: 'Skills + body (education, health)', icon: '📚' };
  if (lane === 'giving') return { title: 'GIVING', subtitle: 'Donations & gifts (good karma, costs money)', icon: '💝' };
  return { title: 'PLEASURE', subtitle: 'Fun & wants (travel, gadgets, entertainment)', icon: '🎉' };
}

function scoreChip(label: string, value?: number, kind: 'good' | 'neutral' | 'bad' = 'neutral') {
  if (value === undefined || value === null) return null;
  const v = Number(value);
  const base =
    kind === 'good' ? 'bg-green-500/20 border-green-500/40 text-green-200' :
    kind === 'bad' ? 'bg-red-500/20 border-red-500/40 text-red-200' :
    'bg-white/10 border-white/10 text-white/80';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-black ${base}`}>
      {label} <span className="text-white">{v}</span>
    </span>
  );
}

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const runId = searchParams.get('runId');
  const supabase = createClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playerState, setPlayerState] = useState<GameState | null>(null);
  const [guruState, setGuruState] = useState<GameState | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [guruExplanations, setGuruExplanations] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(0);

  const [playerDecisions, setPlayerDecisions] = useState<PlayerDecision>({
    temptations: [],
    creditCardPayment: { type: 'minimum' },
    itemsToSell: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showGuruTip, setShowGuruTip] = useState(false);
  const [showPlayerInventory, setShowPlayerInventory] = useState(false);
  const [showGuruInventory, setShowGuruInventory] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showGuruRules, setShowGuruRules] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    };
    checkAuth();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!runId || !isAuthenticated) return;

    const loadState = async () => {
      try {
        const response = await fetch(`/api/game/state/${runId}`);
        if (!response.ok) throw new Error('Failed to load state');

        const data = await response.json();
        setPlayerState(data.currentState.player);
        setGuruState(data.currentState.guru);
        setOffers(data.currentState.offers);
        setGuruExplanations(data.currentState.guruExplanations);
        setCurrentMonth(data.run.current_month);
        setIsLoading(false);
      } catch (error) {
        console.error('Load state error:', error);
        alert('Failed to load game. Please refresh.');
      }
    };

    loadState();
  }, [runId, isAuthenticated]);

  const preview = useMemo(() => {
    if (!playerState) {
      return {
        cash: 0,
        debt: 0,
        newSubMonthly: 0,
        happiness: 0,
        health: 0,
        stressDelta: 0,
        soldIndexes: new Set<number>(),
        pendingPurchases: [],
      } satisfies Preview;
    }
    return computePreview(playerState, playerDecisions, offers, currentMonth);
  }, [playerState, playerDecisions, offers, currentMonth]);

  const offersByLane = useMemo(() => groupOffersByLane(offers), [offers]);

  const handleOfferDecision = (offerId: string, action: 'accept' | 'decline', paymentMethod?: 'cash' | 'credit') => {
    setPlayerDecisions(prev => ({
      ...prev,
      temptations: [
        ...(prev.temptations || []).filter(t => t.offerId !== offerId),
        { offerId, action, paymentMethod },
      ],
    }));
  };

  const handlePaymentDecision = (type: 'minimum' | 'full', amount?: Cents) => {
    setPlayerDecisions(prev => ({
      ...prev,
      creditCardPayment: { type, amount },
    }));
  };

  const handleCarDecision = (offerId: string, action: 'accept' | 'decline') => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    if (action === 'decline') {
      setPlayerDecisions(prev => ({
        ...prev,
        car: { action: 'decline' },
      }));
    } else {
      setPlayerDecisions(prev => ({
        ...prev,
        car: { action: 'accept', tier: (offer as any).tier || 'used', loanTerm: 36 },
      }));
    }
  };

  const handleSellItem = (index: number, sellPrice: Cents) => {
    setPlayerDecisions(prev => {
      const existing = prev.itemsToSell || [];
      if (existing.some(s => s.index === index)) return prev;

      return {
        ...prev,
        itemsToSell: [...existing, { index, sellPrice }],
      };
    });
  };

  const allDecisionsMade = () => {
    const temptationOffers = offers.filter(o => o.type === 'temptation' || o.type === 'subscription');
    const carOffers = offers.filter(o => o.type === 'car');

    const temptationsDecided = (playerDecisions.temptations || []).length === temptationOffers.length;
    const paymentDecided = playerDecisions.creditCardPayment?.type !== undefined;
    const carDecided = carOffers.length === 0 || playerDecisions.car !== undefined;

    return temptationsDecided && paymentDecided && carDecided;
  };

  const submitDecisions = async () => {
    if (!runId || !allDecisionsMade()) return;

    try {
      await fetch('/api/game/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, month: currentMonth, decisions: playerDecisions }),
      });

      setIsAdvancing(true);

      const response = await fetch('/api/game/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, currentMonth }),
      });

      if (!response.ok) throw new Error('Failed to advance');

      const data = await response.json();

      setPlayerState(data.newState.player);
      setGuruState(data.newState.guru);
      setOffers(data.newState.offers);
      setGuruExplanations(data.newState.guruExplanations);
      setCurrentMonth(prev => prev + 1);

      setPlayerDecisions({
        temptations: [],
        creditCardPayment: { type: 'minimum' },
        itemsToSell: [],
      });

      setIsAdvancing(false);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to advance. Please try again.');
      setIsAdvancing(false);
    }
  };

  if (!isAuthenticated || isLoading || !playerState || !guruState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">💰</div>
          <div className="text-white text-4xl font-black animate-pulse">LOADING...</div>
        </div>
      </div>
    );
  }

  // Base values
  const baseCash = Number(playerState.cash);
  const baseDebt = Number(playerState.creditCard.balance);

  // Preview values
  const previewCash = preview.cash;
  const previewDebt = preview.debt;

  const hasMoneyChanges =
    previewCash !== baseCash ||
    previewDebt !== baseDebt ||
    (playerDecisions.itemsToSell || []).length > 0 ||
    preview.pendingPurchases.length > 0 ||
    Number(preview.newSubMonthly || 0) > 0;

  const displayedCash = hasMoneyChanges ? previewCash : baseCash;
  const displayedDebt = hasMoneyChanges ? previewDebt : baseDebt;

  // Subscriptions base + preview additions
  const baseSubMonthly = (playerState.subscriptions || []).reduce((sum: number, s: any) => sum + Number(s.monthlyCost || 0), 0);
  const previewTotalSubMonthly = baseSubMonthly + Number(preview.newSubMonthly || 0);

  // Monthly obligations
  const playerMinPayment = baseDebt > 0 ? Math.max(Math.round(baseDebt * 0.02), 2500) : 0;
  const playerCarPayment = Number(playerState.carLoan?.monthlyPayment || 0);

  const playerMonthlyObligations = playerMinPayment + playerCarPayment + baseSubMonthly;
  const previewMonthlyObligations = playerMinPayment + playerCarPayment + previewTotalSubMonthly;

  const guruMinPayment =
    Number(guruState.creditCard.balance) > 0 ? Math.max(Math.round(Number(guruState.creditCard.balance) * 0.02), 2500) : 0;
  const guruCarPayment = Number(guruState.carLoan?.monthlyPayment || 0);
  const guruSubMonthly = (guruState.subscriptions || []).reduce((sum: number, s: any) => sum + Number(s.monthlyCost || 0), 0);
  const guruMonthlyObligations = guruMinPayment + guruCarPayment + guruSubMonthly;

  // Assets value
  const baseAssets = calcAssetsValue(playerState.purchaseHistory || [], undefined);
  const previewAssets =
    calcAssetsValue(playerState.purchaseHistory || [], preview.soldIndexes) + calcAssetsValue(preview.pendingPurchases || [], undefined);

  // Net worth includes assets
  const playerNetWorth =
    displayedCash +
    (hasMoneyChanges ? previewAssets : baseAssets) -
    displayedDebt -
    Number(playerState.carLoan?.remainingBalance || 0);

  const guruAssets = calcAssetsValue(guruState.purchaseHistory || [], undefined);
  const guruNetWorth =
    Number(guruState.cash) +
    guruAssets -
    Number(guruState.creditCard.balance) -
    Number(guruState.carLoan?.remainingBalance || 0);

  const gap = guruNetWorth - playerNetWorth;
  const progressPercent = (currentMonth / 60) * 100;

  // Lifestyle preview
  const displayedHappiness = hasMoneyChanges ? preview.happiness : Number(playerState.happiness);
  const displayedHealth = hasMoneyChanges ? preview.health : Number(playerState.health);

  const stressBase = computeStress(playerState, playerMonthlyObligations);
  const stressPreviewRaw = computeStress(
    {
      ...(playerState as any),
      cash: displayedCash as Cents,
      creditCard: { ...(playerState.creditCard as any), balance: displayedDebt as Cents },
    } as GameState,
    previewMonthlyObligations
  );

  // Apply UI-only stress delta from chosen items (negative reduces stress, positive increases)
  const stressPreview = clamp(stressPreviewRaw + Number(preview.stressDelta || 0), 0, 100);

  // Guru lifestyle (show same as user)
  const guruStress = computeStress(guruState, guruMonthlyObligations);

  // Cashflow panel (UI-only)
  const monthlyIncome = Number((playerState as any).monthlyIncome || 0);
  const fixedObligationsNow = playerMonthlyObligations;
  const fixedObligationsPreview = hasMoneyChanges ? previewMonthlyObligations : playerMonthlyObligations;

  const freeCashNow = monthlyIncome - fixedObligationsNow;
  const freeCashPreview = monthlyIncome - fixedObligationsPreview;

  // Emergency Fund (UI-derived)
  const efundBase = deriveEmergencyFundBalance(playerState.purchaseHistory || [], undefined);
  const efundPreview =
    deriveEmergencyFundBalance(playerState.purchaseHistory || [], preview.soldIndexes) +
    deriveEmergencyFundBalance(preview.pendingPurchases || [], undefined);

  // Goals
  const goalPayOffCC = displayedDebt <= 0;
  const goalEFund = (hasMoneyChanges ? efundPreview : efundBase) >= 100000; // $1,000 if cents
  const goalCredit = Number(playerState.creditScore || 0) >= 720;

  // Life events display (only if engine provides something)
  const lastEvent = (playerState as any).lastEvent || (playerState as any).eventLog?.[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* HUD */}
      <div className="bg-black/40 backdrop-blur-md border-b-4 border-yellow-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-black text-2xl shadow-lg">
              MONTH {currentMonth}
            </div>
            <div className="text-xl">
              <span className="text-gray-400">Age:</span>{' '}
              <span className="font-bold text-yellow-400">{playerState.age.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSubscriptions(!showSubscriptions)}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110"
            >
              🔄 SUBSCRIPTIONS
            </button>
            <button
              onClick={() => setShowGuruTip(!showGuruTip)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110"
            >
              🧙 GURU TIP
            </button>
            <button
              onClick={() => setShowGuruRules(!showGuruRules)}
              className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110"
            >
              📜 GURU RULES
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold"
            >
              EXIT
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-black/60 px-4 py-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>GAME PROGRESS</span>
            <span className="font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-yellow-500">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Guru Tip */}
      {showGuruTip && (
        <ModalShell onClose={() => setShowGuruTip(false)}>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 max-w-2xl shadow-2xl border-4 border-yellow-400">
            <div className="text-center mb-4">
              <div className="text-8xl mb-2">🧙</div>
              <div className="text-3xl font-black">GURU'S WISDOM</div>
            </div>
            <div className="space-y-3">
              {guruExplanations.map((exp, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <p className="text-xl font-bold">✓ {exp}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGuruTip(false)}
              className="mt-6 w-full bg-yellow-400 text-green-900 font-black py-3 rounded-xl text-xl hover:bg-yellow-300"
            >
              GOT IT!
            </button>
          </div>
        </ModalShell>
      )}

      {/* Guru Rules */}
      {showGuruRules && (
        <ModalShell onClose={() => setShowGuruRules(false)}>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 max-w-2xl shadow-2xl border-4 border-yellow-400">
            <div className="text-center mb-4">
              <div className="text-7xl mb-2">📜</div>
              <div className="text-3xl font-black">THE GURU’S RULEBOOK</div>
              <div className="text-sm text-white/80 mt-2">
                (We will enforce these in the engine next. This panel sets expectations now.)
              </div>
            </div>

            <div className="space-y-3">
              {[
                'Never take new subscriptions if obligations get too high.',
                'If credit card balance exists: avoid pleasure purchases.',
                'If cash buffer is strong: pay credit card in full.',
                'Prefer investing + emergency fund + growth (health/skills).',
                'Giving is allowed — but only after essentials are covered.',
              ].map((t, idx) => (
                <div key={idx} className="bg-white/15 backdrop-blur rounded-xl p-4">
                  <div className="font-bold text-lg">✓ {t}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGuruRules(false)}
              className="mt-6 w-full bg-yellow-400 text-black font-black py-3 rounded-xl text-xl hover:bg-yellow-300"
            >
              OK
            </button>
          </div>
        </ModalShell>
      )}

      {/* Subscriptions */}
      {showSubscriptions && (
        <SubscriptionsPopup
          subscriptions={playerState.subscriptions || []}
          previewNewMonthly={preview.newSubMonthly}
          onClose={() => setShowSubscriptions(false)}
        />
      )}

      {/* Inventory */}
      {showPlayerInventory && (
        <InventoryPopup
          title="YOUR INVENTORY"
          state={playerState}
          pendingPurchases={preview.pendingPurchases}
          soldIndexes={preview.soldIndexes}
          onClose={() => setShowPlayerInventory(false)}
          onSell={handleSellItem}
          readOnly={false}
          color="blue"
        />
      )}
      {showGuruInventory && (
        <InventoryPopup
          title="GURU'S INVENTORY"
          state={guruState}
          pendingPurchases={[]}
          soldIndexes={new Set<number>()}
          onClose={() => setShowGuruInventory(false)}
          readOnly
          color="green"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top panels: Cashflow + Goals + Life Events */}
        <div className="grid lg:grid-cols-3 gap-6">
          <CashflowPanel
            monthlyIncome={monthlyIncome}
            obligations={fixedObligationsNow}
            obligationsPreview={fixedObligationsPreview}
            freeCash={freeCashNow}
            freeCashPreview={freeCashPreview}
            hasChanges={hasMoneyChanges}
            efundCents={hasMoneyChanges ? efundPreview : efundBase}
          />
          <GoalsPanel
            ccPaid={goalPayOffCC}
            efundHit={goalEFund}
            creditHit={goalCredit}
            creditScore={Number(playerState.creditScore || 0)}
            efundCents={hasMoneyChanges ? efundPreview : efundBase}
          />
          <LifeEventsPanel lastEvent={lastEvent} />
        </div>

        {/* Battle */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl border-4 border-yellow-400 p-8 shadow-2xl">
            {/* VS */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-full w-24 h-24 flex items-center justify-center border-4 border-white shadow-2xl">
                <span className="text-4xl font-black">VS</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* YOU */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">👤</div>
                  <div className="text-3xl font-black text-blue-400">YOU</div>
                  <button
                    onClick={() => setShowPlayerInventory(true)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  >
                    📦 VIEW INVENTORY
                  </button>
                </div>

                {/* Net worth */}
                <div className="bg-gray-900/80 rounded-2xl p-6 border-2 border-blue-400">
                  <div className="text-sm text-gray-400 mb-2">NET WORTH</div>
                  <div className={`text-5xl font-black ${playerNetWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(playerNetWorth as Cents)}
                  </div>

                  {hasMoneyChanges && (
                    <div className="mt-2 text-xs text-yellow-300">
                      Preview is live (not saved until you advance).
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>💵 Cash</span>
                      <span className="font-bold text-green-400">
                        {formatCurrency(displayedCash as Cents)}
                        {hasMoneyChanges && (
                          <span className="text-gray-500 ml-2 line-through">{formatCurrency(baseCash as Cents)}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>💳 Debt</span>
                      <span className="font-bold text-red-400">
                        {formatCurrency(displayedDebt as Cents)}
                        {hasMoneyChanges && (
                          <span className="text-gray-500 ml-2 line-through">{formatCurrency(baseDebt as Cents)}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>📦 Assets</span>
                      <span className="font-bold text-yellow-200">
                        {formatCurrency(((hasMoneyChanges ? previewAssets : baseAssets) || 0) as Cents)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>🧯 Emergency Fund</span>
                      <span className="font-bold text-emerald-200">
                        {formatCurrency(((hasMoneyChanges ? efundPreview : efundBase) || 0) as Cents)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>📊 Credit</span>
                      <span className="font-bold text-yellow-400">{playerState.creditScore}</span>
                    </div>
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="bg-gray-900/80 rounded-2xl p-6 border-2 border-blue-400 space-y-3">
                  <StatBar label="😊 Happiness" value={displayedHappiness} />
                  <StatBar label="❤️ Health" value={displayedHealth} />
                  <StatBar
                    label="🧠 Stress"
                    value={hasMoneyChanges ? stressPreview : stressBase}
                    invert
                    note={hasMoneyChanges && preview.stressDelta !== 0 ? `Decision impact: ${preview.stressDelta > 0 ? '+' : ''}${preview.stressDelta}` : 'Driven by debt load + obligations vs income.'}
                  />
                </div>

                {/* Monthly obligations */}
                {playerMonthlyObligations > 0 && (
                  <div className="bg-orange-900/50 rounded-xl p-4 border-2 border-orange-500">
                    <div className="text-xs text-orange-300 font-bold mb-2">⚠️ MONTHLY OBLIGATIONS</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Credit Min:</span>
                        <span className="font-bold text-orange-400">{formatCurrency(playerMinPayment as Cents)}</span>
                      </div>
                      {playerCarPayment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Car Payment:</span>
                          <span className="font-bold text-orange-400">{formatCurrency(playerCarPayment as Cents)}</span>
                        </div>
                      )}
                      {baseSubMonthly > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Subscriptions:</span>
                          <span className="font-bold text-orange-400">{formatCurrency(baseSubMonthly as Cents)}</span>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-orange-700 pt-1">
                        <span className="text-white font-bold">TOTAL:</span>
                        <span className="font-black text-red-400 text-lg">{formatCurrency(playerMonthlyObligations as Cents)}</span>
                      </div>

                      {hasMoneyChanges && previewTotalSubMonthly !== baseSubMonthly && (
                        <div className="text-xs text-yellow-300 mt-2">
                          Preview total w/ new subs: {formatCurrency(previewMonthlyObligations as Cents)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Interest wasted */}
                <div className="bg-red-900/50 rounded-xl p-4 border-2 border-red-500">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">💸 INTEREST WASTED</span>
                    <span className="text-2xl font-black text-red-400">{formatCurrency(playerState.lifetimeInterestPaid)}</span>
                  </div>
                </div>
              </div>

              {/* GURU */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">🧙</div>
                  <div className="text-3xl font-black text-green-400">GURU</div>
                  <button
                    onClick={() => setShowGuruInventory(true)}
                    className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  >
                    📦 VIEW INVENTORY
                  </button>
                </div>

                <div className="bg-gray-900/80 rounded-2xl p-6 border-2 border-green-400">
                  <div className="text-sm text-gray-400 mb-2">NET WORTH</div>
                  <div className={`text-5xl font-black ${guruNetWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(guruNetWorth as Cents)}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>💵 Cash</span>
                      <span className="font-bold text-green-400">{formatCurrency(guruState.cash)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>💳 Debt</span>
                      <span className="font-bold text-red-400">{formatCurrency(guruState.creditCard.balance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>📦 Assets</span>
                      <span className="font-bold text-yellow-200">{formatCurrency(guruAssets as Cents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>📊 Credit</span>
                      <span className="font-bold text-yellow-400">{guruState.creditScore}</span>
                    </div>
                  </div>
                </div>

                {/* ✅ Guru Lifestyle (mirrors player) */}
                <div className="bg-gray-900/80 rounded-2xl p-6 border-2 border-green-400 space-y-3">
                  <StatBar label="😊 Happiness" value={Number(guruState.happiness)} />
                  <StatBar label="❤️ Health" value={Number(guruState.health)} />
                  <StatBar
                    label="🧠 Stress"
                    value={guruStress}
                    invert
                    note="Guru avoids debt + high obligations."
                  />
                </div>

                {/* Monthly obligations */}
                {guruMonthlyObligations > 0 && (
                  <div className="bg-emerald-900/50 rounded-xl p-4 border-2 border-emerald-500">
                    <div className="text-xs text-emerald-300 font-bold mb-2">⚠️ MONTHLY OBLIGATIONS</div>
                    <div className="space-y-1 text-sm">
                      {guruMinPayment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Credit Min:</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(guruMinPayment as Cents)}</span>
                        </div>
                      )}
                      {guruCarPayment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Car Payment:</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(guruCarPayment as Cents)}</span>
                        </div>
                      )}
                      {guruSubMonthly > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Subscriptions:</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(guruSubMonthly as Cents)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-emerald-700 pt-1">
                        <span className="text-white font-bold">TOTAL:</span>
                        <span className="font-black text-green-400 text-lg">{formatCurrency(guruMonthlyObligations as Cents)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-900/50 rounded-xl p-4 border-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">💸 INTEREST WASTED</span>
                    <span className="text-2xl font-black text-green-400">{formatCurrency(guruState.lifetimeInterestPaid)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap */}
            <div className="mt-8 text-center">
              {gap > 0 ? (
                <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6">
                  <div className="text-2xl font-black text-red-400 mb-2">📉 BEHIND BY</div>
                  <div className="text-6xl font-black text-red-400">${Math.abs(gap / 100).toLocaleString()}</div>
                </div>
              ) : gap < 0 ? (
                <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6">
                  <div className="text-2xl font-black text-green-400 mb-2">🎉 AHEAD BY</div>
                  <div className="text-6xl font-black text-green-400">${Math.abs(gap / 100).toLocaleString()}</div>
                </div>
              ) : (
                <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl p-6">
                  <div className="text-4xl font-black text-yellow-400">⚖️ TIED!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OFFERS: grouped into lanes */}
        {offers.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-5xl font-black text-yellow-400 mb-2">🛍️ THIS MONTH’S CHOICES</div>
              <div className="text-xl text-gray-300">Essentials → Investing/Growth → Giving → Pleasure.</div>
            </div>

            {(Object.keys(offersByLane) as LaneKey[]).map(lane => {
              const laneOffers = offersByLane[lane];
              if (!laneOffers || laneOffers.length === 0) return null;
              const meta = laneMeta(lane);

              return (
                <div key={lane} className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black text-yellow-300">
                        {meta.icon} {meta.title}
                      </div>
                      <div className="text-sm text-white/70">{meta.subtitle}</div>
                    </div>
                    <div className="text-xs text-white/60">
                      {lane === 'essentials' && 'Rule: essentials prevent “bad debt” later.'}
                      {lane === 'investing' && 'Rule: investing increases safety + net worth.'}
                      {lane === 'growth' && 'Rule: growth improves long-term outcomes (skills/health).'}
                      {lane === 'giving' && 'Rule: giving is great… but don’t do it on credit.'}
                      {lane === 'pleasure' && 'Rule: pleasure is last. Don’t buy fun with high-interest debt.'}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {laneOffers.map(offer => (
                      <OfferGameCard
                        key={offer.id}
                        offer={offer}
                        cash={displayedCash}
                        creditAvailable={Number(playerState.creditCard.limit) - displayedDebt}
                        creditScore={playerState.creditScore}
                        onDecision={offer.type === 'car' ? handleCarDecision : handleOfferDecision}
                        decided={
                          offer.type === 'car'
                            ? playerDecisions.car !== undefined
                            : (playerDecisions.temptations || []).some(t => t.offerId === offer.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Credit card payment */}
        {playerState.creditCard.balance > 0 && (
          <CreditCardGameUI
            balance={playerState.creditCard.balance}
            cash={displayedCash}
            onDecision={handlePaymentDecision}
            decided={playerDecisions.creditCardPayment.type !== undefined}
          />
        )}

        {/* Advance */}
        <div className="sticky bottom-4">
          <button
            onClick={submitDecisions}
            disabled={!allDecisionsMade() || isAdvancing}
            className={`w-full py-8 rounded-3xl font-black text-4xl shadow-2xl transition-all transform border-4 ${
              allDecisionsMade() && !isAdvancing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-yellow-400 hover:scale-105 animate-pulse'
                : 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isAdvancing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mr-4"></div>
                PROCESSING...
              </span>
            ) : allDecisionsMade() ? (
              '▶️ ADVANCE TO NEXT MONTH ▶️'
            ) : (
              '🔒 MAKE ALL DECISIONS FIRST'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Small UI components ------------------------------ */

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function StatBar({ label, value, invert, note }: { label: string; value: number; invert?: boolean; note?: string }) {
  const v = clamp(Math.round(value), 0, 100);
  const good = invert ? v < 35 : v > 70;
  const mid = invert ? v < 70 : v > 40;
  const color = good ? 'bg-green-500' : mid ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">{v}/100</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${color}`} style={{ width: `${v}%` }} />
      </div>
      {note && <div className="text-xs text-gray-400 mt-1">{note}</div>}
    </div>
  );
}

function CashflowPanel({
  monthlyIncome,
  obligations,
  obligationsPreview,
  freeCash,
  freeCashPreview,
  hasChanges,
  efundCents,
}: {
  monthlyIncome: number;
  obligations: number;
  obligationsPreview: number;
  freeCash: number;
  freeCashPreview: number;
  hasChanges: boolean;
  efundCents: number;
}) {
  const freeColor = freeCashPreview >= 0 ? 'text-green-300' : 'text-red-300';

  return (
    <div className="bg-black/50 border-2 border-yellow-400 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-black">💸 CASHFLOW</div>
        <div className="text-xs text-white/70">Monthly snapshot</div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/70">Income</span>
          <span className="font-black text-white">{formatCurrency(monthlyIncome as any)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/70">Fixed obligations</span>
          <span className="font-black text-white">
            {formatCurrency((hasChanges ? obligationsPreview : obligations) as any)}
            {hasChanges && obligationsPreview !== obligations && (
              <span className="text-white/50 ml-2 line-through">{formatCurrency(obligations as any)}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/70">Free cash</span>
          <span className={`font-black ${freeColor}`}>
            {formatCurrency((hasChanges ? freeCashPreview : freeCash) as any)}
            {hasChanges && freeCashPreview !== freeCash && (
              <span className="text-white/50 ml-2 line-through">{formatCurrency(freeCash as any)}</span>
            )}
          </span>
        </div>

        <div className="mt-3 bg-emerald-900/30 border border-emerald-500/40 rounded-xl p-3">
          <div className="flex justify-between">
            <span className="text-emerald-200 font-bold">🧯 Emergency Fund</span>
            <span className="text-emerald-100 font-black">{formatCurrency(efundCents as any)}</span>
          </div>
          <div className="text-xs text-white/70 mt-1">
            Having this reduces “bad event” damage (we’ll enforce in engine next).
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsPanel({
  ccPaid,
  efundHit,
  creditHit,
  creditScore,
  efundCents,
}: {
  ccPaid: boolean;
  efundHit: boolean;
  creditHit: boolean;
  creditScore: number;
  efundCents: number;
}) {
  const goalRow = (done: boolean, title: string, subtitle: string) => (
    <div className={`rounded-xl p-3 border ${done ? 'bg-green-500/15 border-green-500/40' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center justify-between">
        <div className="font-black">{title}</div>
        <div className={`text-sm font-black ${done ? 'text-green-300' : 'text-white/60'}`}>{done ? '✅' : '⬜'}</div>
      </div>
      <div className="text-xs text-white/70 mt-1">{subtitle}</div>
    </div>
  );

  return (
    <div className="bg-black/50 border-2 border-yellow-400 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-black">🏆 GOALS</div>
        <div className="text-xs text-white/70">Mini-wins = retention</div>
      </div>

      <div className="space-y-3">
        {goalRow(ccPaid, 'Pay off credit card', 'No high-interest debt = huge stress drop')}
        {goalRow(efundHit, 'Emergency fund: $1,000', `Current: ${formatCurrency(efundCents as any)}`)}
        {goalRow(creditHit, 'Credit score 720+', `Current: ${creditScore}`)}
      </div>

      <div className="text-xs text-white/60 mt-3">
        Next: badges + streaks + “level up” when goals complete.
      </div>
    </div>
  );
}

function LifeEventsPanel({ lastEvent }: { lastEvent: any }) {
  return (
    <div className="bg-black/50 border-2 border-yellow-400 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-black">🎲 LIFE EVENTS</div>
        <div className="text-xs text-white/70">Fair randomness</div>
      </div>

      {lastEvent ? (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          <div className="font-black text-lg">Last event</div>
          <div className="text-sm text-white/80 mt-1">
            {typeof lastEvent === 'string' ? lastEvent : JSON.stringify(lastEvent)}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-white/10 border border-white/10 rounded-xl p-4">
            <div className="font-black text-lg">No event shown yet</div>
            <div className="text-sm text-white/70 mt-1">
              When you advance, you can get: car repair, medical bill, bonus, tax refund.
            </div>
          </div>

          <div className="text-xs text-white/60">
            Rule we’ll enforce: emergency fund absorbs shocks. If not → it hits credit card.
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Existing popups/cards ------------------------------ */

/** Subscriptions Popup */
function SubscriptionsPopup({ subscriptions, previewNewMonthly = 0, onClose }: any) {
  const totalMonthly = subscriptions.reduce((sum: number, sub: any) => sum + (sub.monthlyCost || 0), 0);
  const previewTotal = totalMonthly + (previewNewMonthly || 0);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border-4 border-yellow-400"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🔄</div>
          <div className="text-3xl font-black">ACTIVE SUBSCRIPTIONS</div>
          <div className="text-xl mt-2">
            Monthly Cost: {formatCurrency(totalMonthly)}
            {previewNewMonthly > 0 && <span className="text-yellow-300 ml-2">→ {formatCurrency(previewTotal)}</span>}
          </div>
        </div>

        <div className="space-y-4">
          {subscriptions.length > 0 ? (
            subscriptions.map((sub: any, idx: number) => (
              <div key={idx} className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{sub.name}</div>
                    <div className="text-sm opacity-90">{formatCurrency(sub.monthlyCost)}/month</div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {sub.happinessBoost ? scoreChip('😊', sub.happinessBoost, 'good') : null}
                      {sub.healthBoost ? scoreChip('❤️', sub.healthBoost, 'good') : null}
                      {sub.experienceScore != null ? scoreChip('EXP', sub.experienceScore, 'neutral') : null}
                      {sub.investmentScore != null ? scoreChip('INV', sub.investmentScore, 'neutral') : null}
                      {sub.stressImpact != null
                        ? scoreChip('STRESS', sub.stressImpact, Number(sub.stressImpact) > 0 ? 'bad' : 'good')
                        : null}
                    </div>
                  </div>
                  <div className="text-4xl">{sub.icon}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">📭</div>
              <div>No active subscriptions</div>
            </div>
          )}
        </div>

        <button onClick={onClose} className="mt-6 w-full bg-yellow-400 text-black font-black py-3 rounded-xl text-xl hover:bg-yellow-300">
          CLOSE
        </button>
      </div>
    </div>
  );
}

/** Inventory Popup */
function InventoryPopup({
  title,
  state,
  pendingPurchases = [],
  soldIndexes = new Set<number>(),
  onClose,
  onSell,
  color,
  readOnly,
}: any) {
  const purchaseHistory = (state.purchaseHistory || []).filter((_: any, idx: number) => !soldIndexes.has(idx));
  const merged = [...purchaseHistory, ...pendingPurchases];

  const laneLabel = (lane?: string) => {
    const l = normalizeLane(lane);
    if (!l) return null;
    const map: Record<LaneKey, string> = {
      essentials: 'ESSENTIALS',
      investing: 'INVESTING',
      growth: 'GROWTH',
      giving: 'GIVING',
      pleasure: 'PLEASURE',
    };
    return map[l];
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-gradient-to-br ${
          color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-green-500 to-emerald-600'
        } rounded-3xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border-4 border-yellow-400`}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">📦</div>
          <div className="text-3xl font-black">{title}</div>
          <div className="text-xs text-white/80 mt-2">
            Every item shows: value + happiness/health + experience/investment + stress impact.
          </div>
        </div>

        <div className="space-y-4">
          {/* Car */}
          {state.carLoan && (
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl">🚗</div>
                <div className="text-xs bg-orange-500 px-2 py-1 rounded font-bold">FINANCED</div>
              </div>
              <div className="font-bold text-lg">Car ({state.carLoan.tier || 'used'})</div>
              <div className="text-sm opacity-90">
                Remaining: {formatCurrency(state.carLoan.remainingBalance)} ({state.carLoan.remainingMonths} months)
              </div>
              <div className="text-sm opacity-90">Monthly: {formatCurrency(state.carLoan.monthlyPayment)}</div>
            </div>
          )}

          {/* Items */}
          {merged.length > 0 ? (
            <>
              <div className="text-lg font-bold text-white/80">ITEMS:</div>
              {merged.map((item: any, idx: number) => {
                const isPending = idx >= purchaseHistory.length;
                const paid = Number(item.cost || 0);
                const worthNow = Number(item.currentValue ?? item.cost ?? 0);
                const canSell = !readOnly && !isPending && worthNow > 0;

                const laneText = laneLabel(item.lane);
                const cat = String(item.category || '');

                return (
                  <div key={idx} className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold flex flex-wrap items-center gap-2">
                          <span>{item.name}</span>
                          {laneText && <span className="text-[10px] bg-black/30 border border-white/10 px-2 py-0.5 rounded-full font-black">{laneText}</span>}
                          {item.recurring && <span className="text-[10px] bg-purple-600/60 px-2 py-0.5 rounded-full font-black">RECURRING</span>}
                          {isPending && (
                            <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-black">PREVIEW</span>
                          )}
                        </div>

                        <div className="text-xs opacity-90 mt-1">
                          Category: <span className="font-bold">{cat || '—'}</span> • Month {item.month}
                        </div>

                        <div className="text-sm opacity-90 mt-2">
                          Paid:{' '}
                          <span className="font-bold">{formatCurrency(paid as Cents)}</span>{' '}
                          <span className="opacity-90">{item.paymentMethod === 'credit' ? '💳' : '💵'}</span>
                        </div>

                        <div className="text-sm font-black text-yellow-200 mt-1 flex items-center gap-2 flex-wrap">
                          <span>Worth now: {formatCurrency(worthNow as Cents)}</span>
                          {typeof item.depreciationRate === 'number' && (
                            <span className="text-[10px] bg-black/30 border border-white/10 px-2 py-0.5 rounded-full">
                              Dep: {(Number(item.depreciationRate) * 100).toFixed(0)}%
                            </span>
                          )}
                          {canSell && (
                            <button
                              onClick={() => onSell(idx, worthNow as Cents)}
                              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs font-black"
                            >
                              SELL
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.happinessBoost ? scoreChip('😊', item.happinessBoost, 'good') : null}
                          {item.healthBoost ? scoreChip('❤️', item.healthBoost, 'good') : null}
                          {item.experienceScore != null ? scoreChip('EXP', item.experienceScore, 'neutral') : null}
                          {item.investmentScore != null ? scoreChip('INV', item.investmentScore, 'neutral') : null}
                          {item.stressImpact != null
                            ? scoreChip('STRESS', item.stressImpact, Number(item.stressImpact) > 0 ? 'bad' : 'good')
                            : null}
                        </div>
                      </div>

                      <div className="text-3xl">{item.icon || getIconForCategory(cat)}</div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">📭</div>
              <div>No items purchased yet</div>
            </div>
          )}
        </div>

        <button onClick={onClose} className="mt-6 w-full bg-yellow-400 text-black font-black py-3 rounded-xl text-xl hover:bg-yellow-300">
          CLOSE
        </button>
      </div>
    </div>
  );
}

/** Offer Card */
function OfferGameCard({ offer, cash, creditAvailable, creditScore, onDecision, decided }: any) {
  const canPayCash = cash >= offer.cost;
  const canPayCredit = creditAvailable >= offer.cost;

  // Car offer
  if (offer.type === 'car') {
    const downPayment = Math.floor(offer.cost * 0.125);
    const loanAmount = offer.cost - downPayment;
    const canAffordDownPayment = cash >= downPayment;

    const apr = creditScore >= 760 ? 0.045 : creditScore >= 700 ? 0.065 : creditScore >= 640 ? 0.09 : 0.14;
    const aprPercent = (apr * 100).toFixed(1);

    const termMonths = 36;
    const monthlyRate = apr / 12;
    const monthlyPayment = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    );
    const totalPaid = downPayment + monthlyPayment * termMonths;
    const totalInterest = totalPaid - offer.cost;

    return (
      <div className={`relative group ${decided ? 'opacity-75' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border-4 border-orange-500 shadow-2xl transform hover:scale-105 transition-all">
          <div className="text-center">
            <div className="text-7xl mb-3">🚗</div>
            <div className="text-2xl font-black mb-2">{offer.description}</div>
            <div className="text-5xl font-black text-yellow-400 mb-2">{formatCurrency(offer.cost)}</div>
          </div>

          <div className="bg-blue-900/50 rounded-xl p-4 mb-4 border border-blue-500">
            <div className="text-xs text-blue-300 font-bold mb-2">💰 FINANCING DETAILS</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Down Payment:</span>
                <span className="font-bold text-white">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Loan Amount:</span>
                <span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APR:</span>
                <span className="font-bold text-yellow-400">{aprPercent}%</span>
              </div>
              <div className="flex justify-between border-t border-blue-700 pt-1 mt-1">
                <span className="text-gray-400">Monthly:</span>
                <span className="font-bold text-green-400">{formatCurrency(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Interest:</span>
                <span className="text-red-400 font-bold">{formatCurrency(totalInterest)}</span>
              </div>
            </div>
          </div>

          {!decided ? (
            <div className="space-y-3">
              <button
                onClick={() => onDecision(offer.id, 'accept')}
                disabled={!canAffordDownPayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 rounded-xl text-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
              >
                🚗 BUY {(offer as any).tier?.toUpperCase()} CAR
              </button>
              <button
                onClick={() => onDecision(offer.id, 'decline')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-4 rounded-xl text-xl transition-all"
              >
                ❌ PASS
              </button>
              {!canAffordDownPayment && (
                <div className="text-xs text-red-400 text-center bg-red-900/30 rounded p-2">
                  ⚠️ Need {formatCurrency(downPayment - cash)} more for down payment
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-500 text-white font-black py-4 rounded-xl text-center text-xl animate-pulse">✓ DECIDED</div>
          )}
        </div>
      </div>
    );
  }

  // Regular / subscription offers
  const cat = String((offer as any).category || '');
  const isRecurring = offer.recurring || offer.type === 'subscription';
  const icon = (offer as any).icon || getIconForCategory(cat);

  const exp = (offer as any).experienceScore;
  const inv = (offer as any).investmentScore;
  const sImpact = (offer as any).stressImpact;

  return (
    <div className={`relative group ${decided ? 'opacity-75' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border-4 border-purple-500 shadow-2xl transform hover:scale-105 transition-all">
        <div className="text-center">
          <div className="text-7xl mb-3">{icon || '🛍️'}</div>
          <div className="text-2xl font-black mb-2">{offer.description}</div>
          {isRecurring && <div className="text-xs bg-purple-600 px-2 py-1 rounded-full inline-block mb-2">🔄 RECURRING</div>}
          <div className="text-5xl font-black text-yellow-400 mb-2">
            {formatCurrency(offer.cost)}
            {isRecurring && '/mo'}
          </div>
        </div>

        {/* ✅ Show full impacts (not only happiness/health) */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {offer.happinessBoost ? scoreChip('😊', offer.happinessBoost, 'good') : null}
          {offer.healthBoost ? scoreChip('❤️', offer.healthBoost, 'good') : null}
          {exp != null ? scoreChip('EXP', exp, 'neutral') : null}
          {inv != null ? scoreChip('INV', inv, 'neutral') : null}
          {sImpact != null ? scoreChip('STRESS', sImpact, Number(sImpact) > 0 ? 'bad' : 'good') : null}
        </div>

        {!decided ? (
          <div className="space-y-3">
            {!isRecurring && (
              <>
                <button
                  onClick={() => onDecision(offer.id, 'accept', 'cash')}
                  disabled={!canPayCash}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 rounded-xl text-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
                >
                  💵 PAY CASH
                </button>
                <button
                  onClick={() => onDecision(offer.id, 'accept', 'credit')}
                  disabled={!canPayCredit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 rounded-xl text-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
                >
                  💳 USE CREDIT
                </button>
              </>
            )}

            {isRecurring && (
              <button
                onClick={() => onDecision(offer.id, 'accept', 'cash')}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black py-4 rounded-xl text-xl transition-all transform hover:scale-105"
              >
                🔄 SUBSCRIBE
              </button>
            )}

            <button
              onClick={() => onDecision(offer.id, 'decline')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-4 rounded-xl text-xl transition-all"
            >
              ❌ PASS
            </button>

            {!isRecurring && (!canPayCash && !canPayCredit) && (
              <div className="text-xs text-red-300 text-center bg-red-900/25 border border-red-500/30 rounded-lg p-2">
                Not enough cash or credit for this right now.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-500 text-white font-black py-4 rounded-xl text-center text-xl animate-pulse">✓ DECIDED</div>
        )}
      </div>
    </div>
  );
}

/** Credit card UI */
function CreditCardGameUI({ balance, cash, onDecision, decided }: any) {
  const minPayment = Math.max(Math.round(balance * 0.02), 2500);
  const interest = Math.round(balance * (0.24 / 12));

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur-xl opacity-50"></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">💳</div>
          <div className="text-4xl font-black text-yellow-400">CREDIT CARD PAYMENT</div>
        </div>

        <div className="bg-red-900/50 border-2 border-red-500 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">BALANCE</div>
            <div className="text-6xl font-black text-red-400 mb-4">{formatCurrency(balance)}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">MINIMUM</div>
                <div className="text-2xl font-black text-orange-400">{formatCurrency(minPayment)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">INTEREST</div>
                <div className="text-2xl font-black text-red-400">{formatCurrency(interest)}</div>
              </div>
            </div>
          </div>
        </div>

        {!decided ? (
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => onDecision('minimum')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black py-6 rounded-2xl text-2xl transition-all transform hover:scale-105"
            >
              <div className="mb-2">PAY MINIMUM</div>
              <div className="text-sm">{formatCurrency(minPayment)}</div>
              <div className="text-xs mt-1">⚠️ Costs {formatCurrency(interest)} interest</div>
            </button>
            <button
              onClick={() => onDecision('full')}
              disabled={cash < balance}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-6 rounded-2xl text-2xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              <div className="mb-2">PAY FULL</div>
              <div className="text-sm">{formatCurrency(balance)}</div>
              <div className="text-xs mt-1">✓ Saves {formatCurrency(interest)}!</div>
            </button>
          </div>
        ) : (
          <div className="bg-green-500 text-white font-black py-6 rounded-2xl text-center text-2xl animate-pulse">✓ PAYMENT DECIDED</div>
        )}
      </div>
    </div>
  );
}
