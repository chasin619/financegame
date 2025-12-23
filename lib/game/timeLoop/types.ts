export type LoopStatKey = "cash" | "debt" | "stress";

export type LoopStats = {
  cash: number;
  debt: number;
  stress: number;
};

export type LoopDay =
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT"
  | "SUN";

export type Choice = {
  id: string;
  label: string;
  effects: Partial<LoopStats>;
  tag?: "fast" | "safe" | "risky";
};

export type Prompt = {
  id: string;
  dayIndex: number; // 0..6
  title: string;
  subtitle: string;
  choices: Choice[];
};

export type WeekOutcome = "SURVIVED" | "BROKE" | "BURNOUT";

export type LoopMemory = {
  // small visible "scars" that persist between runs
  lastRunOutcome?: WeekOutcome;
  lastRunIcons: Array<{ dayIndex: number; icon: string }>;
  runs: number;
};
