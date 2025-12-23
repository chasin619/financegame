export const LOOP_CONFIG = {
  weekSeconds: 90,
  decisionWindowSeconds: 7, // how long a prompt stays before auto-pick
  startingStats: { cash: 120, debt: 0, stress: 0 },
  thresholds: {
    brokeCash: 0,       // <= 0 cash => BROKE
    burnoutStress: 100, // >= 100 stress => BURNOUT
    maxDebt: 150,       // too much debt increases stress tick
  },
  tick: {
    // every "day" we apply a passive drain
    cashDailyDrain: 20,
    stressDailyBase: 6,
  },
};
