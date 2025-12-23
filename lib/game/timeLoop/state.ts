import type { LoopMemory, LoopStats, WeekOutcome } from "./types";
import { LOOP_CONFIG } from "./config";

export type LoopState = {
  // time
  t: number; // 0..weekSeconds
  dayIndex: number; // 0..6
  // stats
  stats: LoopStats;
  // prompt
  activePromptId?: string;
  promptExpiresAt?: number;
  // memory (persists across runs)
  memory: LoopMemory;
  // week status
  outcome?: WeekOutcome;
};

export const createInitialState = (): LoopState => ({
  t: 0,
  dayIndex: 0,
  stats: { ...LOOP_CONFIG.startingStats },
  memory: { lastRunIcons: [], runs: 0 },
});

export function resetWeekKeepMemory(prev: LoopState): LoopState {
  return {
    ...prev,
    t: 0,
    dayIndex: 0,
    stats: { ...LOOP_CONFIG.startingStats },
    activePromptId: undefined,
    promptExpiresAt: undefined,
    outcome: undefined,
    memory: {
      ...prev.memory,
      runs: prev.memory.runs + 1,
      // keep lastRunIcons as-is; new run adds on top
      lastRunIcons: [],
    },
  };
}

export function applyEffects(state: LoopState, effects: Partial<LoopStats>): LoopState {
  const next = {
    ...state,
    stats: {
      cash: state.stats.cash + (effects.cash ?? 0),
      debt: state.stats.debt + (effects.debt ?? 0),
      stress: state.stats.stress + (effects.stress ?? 0),
    },
  };
  // clamp a bit
  next.stats.cash = Math.round(next.stats.cash);
  next.stats.debt = Math.max(0, Math.round(next.stats.debt));
  next.stats.stress = Math.max(0, Math.round(next.stats.stress));
  return next;
}

export function computeOutcome(stats: LoopStats): WeekOutcome | undefined {
  if (stats.cash <= LOOP_CONFIG.thresholds.brokeCash) return "BROKE";
  if (stats.stress >= LOOP_CONFIG.thresholds.burnoutStress) return "BURNOUT";
  return undefined;
}
