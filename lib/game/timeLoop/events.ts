import type { Prompt } from "./types";

export const PROMPTS: Prompt[] = [
  {
    id: "mon_offer",
    dayIndex: 0,
    title: "Monday: New Shoes",
    subtitle: "They look amazing. You want them now.",
    choices: [
      { id: "buy", label: "Buy now (+style)", effects: { cash: -60, stress: -5 }, tag: "fast" },
      { id: "wait", label: "Wait for sale (safe)", effects: { stress: +2 }, tag: "safe" },
      { id: "credit", label: "Put on credit (risky)", effects: { debt: +70, stress: -8 }, tag: "risky" },
    ],
  },
  {
    id: "wed_shift",
    dayIndex: 2,
    title: "Wednesday: Extra Shift",
    subtitle: "You can earn cash, but you'll be tired.",
    choices: [
      { id: "take", label: "Take shift (+cash)", effects: { cash: +70, stress: +18 }, tag: "safe" },
      { id: "skip", label: "Skip (rest)", effects: { stress: -8 }, tag: "fast" },
      { id: "borrow", label: "Borrow from friend", effects: { cash: +40, debt: +30, stress: +6 }, tag: "risky" },
    ],
  },
  {
    id: "fri_fun",
    dayIndex: 4,
    title: "Friday: Friends Invite You",
    subtitle: "Big night out. Big bill.",
    choices: [
      { id: "go", label: "Go out (fun)", effects: { cash: -50, stress: -10 }, tag: "fast" },
      { id: "cheap", label: "Go cheap (smart)", effects: { cash: -15, stress: -6 }, tag: "safe" },
      { id: "flex", label: "Flex with credit", effects: { debt: +60, stress: -12 }, tag: "risky" },
    ],
  },
];
