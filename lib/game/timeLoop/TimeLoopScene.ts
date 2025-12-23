import Phaser from "phaser";
import { LOOP_CONFIG } from "./config";
import { PROMPTS } from "./events";
import { applyEffects, computeOutcome, createInitialState, resetWeekKeepMemory, type LoopState } from "./state";
import type { Prompt } from "./types";

export class TimeLoopScene extends Phaser.Scene {
  private s!: LoopState;

  // UI
  private hudText!: Phaser.GameObjects.Text;
  private timelineBg!: Phaser.GameObjects.Rectangle;
  private timelineFill!: Phaser.GameObjects.Rectangle;
  private dayLabels: Phaser.GameObjects.Text[] = [];
  private promptCard?: Phaser.GameObjects.Container;

  // World
  private player!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("TimeLoopScene");
  }

  create() {
    this.s = createInitialState();

    // --- Background (simple "room")
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x0b1220).setDepth(0);
    this.add.rectangle(w / 2, h - 80, w, 160, 0x121a2b).setDepth(0);

    // "room props"
    this.add.rectangle(180, h - 150, 220, 140, 0x0f172a).setStrokeStyle(2, 0x1f2a44);
    this.add.rectangle(w - 180, h - 160, 220, 240, 0x0f172a).setStrokeStyle(2, 0x1f2a44); // door zone

    // Player (simple block, can later be sprite)
    this.player = this.add.rectangle(240, h - 120, 28, 44, 0xe2e8f0).setDepth(2);

    // --- Timeline UI
    this.timelineBg = this.add.rectangle(w / 2, 22, w - 40, 18, 0x111827).setDepth(10);
    this.timelineFill = this.add
      .rectangle(20, 22, 0, 14, 0x22c55e)
      .setOrigin(0, 0.5)
      .setDepth(11);

    const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const left = 20;
    const width = w - 40;

    labels.forEach((d, i) => {
      const x = left + (width * i) / 6;
      const t = this.add
        .text(x, 44, d, { fontFamily: "system-ui, -apple-system, Segoe UI, Roboto", fontSize: "11px", color: "#94a3b8" })
        .setOrigin(i === 0 ? 0 : 0.5, 0)
        .setDepth(12);
      this.dayLabels.push(t);
    });

    // --- HUD stats
    this.hudText = this.add
      .text(18, 64, "", {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "14px",
        color: "#e5e7eb",
      })
      .setDepth(12);

    // Start week
    this.refreshHUD();
    this.schedulePrompts();
  }

  update(_, deltaMs: number) {
    const delta = deltaMs / 1000;

    if (this.s.outcome) return;

    // advance time
    this.s.t += delta;
    const progress = Phaser.Math.Clamp(this.s.t / LOOP_CONFIG.weekSeconds, 0, 1);

    // timeline fill
    const fullW = this.scale.width - 40;
    this.timelineFill.width = Math.floor(fullW * progress);

    // compute day index (0..6)
    const newDayIndex = Math.min(6, Math.floor(progress * 7));
    if (newDayIndex !== this.s.dayIndex) {
      this.s.dayIndex = newDayIndex;
      this.onDayChanged(newDayIndex);
    }

    // If a prompt is active and expired, auto pick the "middle" choice (safe default)
    if (this.s.activePromptId && this.s.promptExpiresAt && this.s.t >= this.s.promptExpiresAt) {
      const prompt = PROMPTS.find((p) => p.id === this.s.activePromptId);
      if (prompt) {
        const auto = prompt.choices[1] ?? prompt.choices[0];
        this.pickChoice(prompt, auto.id, true);
      }
    }

    // End of week => resolve & reset
    if (this.s.t >= LOOP_CONFIG.weekSeconds) {
      const outcome = computeOutcome(this.s.stats) ?? "SURVIVED";
      this.finishWeek(outcome);
    }
  }

  private onDayChanged(dayIndex: number) {
    // Passive drain + mild stress tick, increased by debt
    const debtPenalty = this.s.stats.debt > LOOP_CONFIG.thresholds.maxDebt ? 6 : 0;

    this.s = applyEffects(this.s, {
      cash: -LOOP_CONFIG.tick.cashDailyDrain,
      stress: LOOP_CONFIG.tick.stressDailyBase + debtPenalty,
    });

    // outcome check mid-week
    const outcome = computeOutcome(this.s.stats);
    if (outcome) {
      this.finishWeek(outcome);
      return;
    }

    // subtle player "move" just to feel alive
    const targetX = 240 + dayIndex * 22;
    this.tweens.add({
      targets: this.player,
      x: targetX,
      duration: 220,
      ease: "Sine.easeOut",
    });

    this.refreshHUD();
    this.highlightDay(dayIndex);
  }

  private highlightDay(dayIndex: number) {
    this.dayLabels.forEach((t, i) => t.setColor(i === dayIndex ? "#e5e7eb" : "#94a3b8"));
  }

  private schedulePrompts() {
    // We trigger prompts as time passes their day boundary
    // simplest: poll each update? We'll instead schedule timed events by dayIndex
    PROMPTS.forEach((p) => {
      const triggerAt = (p.dayIndex / 7) * LOOP_CONFIG.weekSeconds + 2; // slight offset into day
      this.time.addEvent({
        delay: triggerAt * 1000,
        callback: () => {
          if (this.s.outcome) return;
          // if already a prompt open, skip (avoid stacking)
          if (this.s.activePromptId) return;
          this.openPrompt(p);
        },
      });
    });
  }

  private openPrompt(prompt: Prompt) {
    this.s.activePromptId = prompt.id;
    this.s.promptExpiresAt = this.s.t + LOOP_CONFIG.decisionWindowSeconds;

    // build a "card" overlay
    const w = this.scale.width;
    const h = this.scale.height;

    const cardW = Math.min(720, w - 60);
    const cardH = 210;

    const bg = this.add.rectangle(w / 2, h - 155, cardW, cardH, 0x0f172a).setStrokeStyle(2, 0x1f2a44);
    const title = this.add.text(w / 2 - cardW / 2 + 18, h - 155 - cardH / 2 + 16, prompt.title, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "16px",
      color: "#e5e7eb",
    });

    const sub = this.add.text(w / 2 - cardW / 2 + 18, h - 155 - cardH / 2 + 40, prompt.subtitle, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "13px",
      color: "#94a3b8",
      wordWrap: { width: cardW - 36 },
    });

    const buttons: Phaser.GameObjects.Container[] = [];
    const btnY = h - 155 + 38;
    const spacing = 12;
    const btnW = (cardW - 36 - spacing * 2) / 3;
    const btnH = 54;
    const leftX = w / 2 - cardW / 2 + 18;

    prompt.choices.slice(0, 3).forEach((c, i) => {
      const x = leftX + i * (btnW + spacing);
      const rect = this.add.rectangle(x + btnW / 2, btnY, btnW, btnH, 0x111827).setStrokeStyle(2, 0x24324d);
      const label = this.add.text(x + 12, btnY - 12, c.label, {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "13px",
        color: "#e5e7eb",
        wordWrap: { width: btnW - 24 },
      });

      const hint = this.add.text(x + 12, btnY + 10, this.effectsHint(c.effects), {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "12px",
        color: "#94a3b8",
      });

      const hit = this.add.rectangle(x + btnW / 2, btnY, btnW, btnH, 0x000000, 0).setInteractive({ useHandCursor: true });
      hit.on("pointerdown", () => this.pickChoice(prompt, c.id, false));

      const group = this.add.container(0, 0, [rect, label, hint, hit]).setDepth(50);
      buttons.push(group);
    });

    // countdown bar
    const barBg = this.add.rectangle(w / 2, h - 155 + 86, cardW - 36, 8, 0x111827).setDepth(51);
    const barFill = this.add.rectangle(w / 2 - (cardW - 36) / 2, h - 155 + 86, cardW - 36, 6, 0x22c55e).setOrigin(0, 0.5).setDepth(52);

    const container = this.add.container(0, 0, [bg, title, sub, ...buttons, barBg, barFill]).setDepth(50);
    this.promptCard = container;

    // animate in
    container.setAlpha(0);
    this.tweens.add({ targets: container, alpha: 1, duration: 160, ease: "Sine.easeOut" });

    // animate countdown fill
    this.tweens.add({
      targets: barFill,
      width: 0,
      duration: LOOP_CONFIG.decisionWindowSeconds * 1000,
      ease: "Linear",
    });
  }

  private pickChoice(prompt: Prompt, choiceId: string, isAuto: boolean) {
    const choice = prompt.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // close prompt
    this.promptCard?.destroy(true);
    this.promptCard = undefined;

    // apply effects
    this.s = applyEffects(this.s, choice.effects);

    // "memory icon" (simple)
    const icon = choice.effects.debt ? "💳" : choice.effects.cash && choice.effects.cash > 0 ? "💼" : choice.effects.cash && choice.effects.cash < 0 ? "💸" : "✅";
    this.s.memory.lastRunIcons.push({ dayIndex: prompt.dayIndex, icon });

    // clear prompt state
    this.s.activePromptId = undefined;
    this.s.promptExpiresAt = undefined;

    // tiny feedback toast
    this.flashToast(isAuto ? "Auto choice" : "Choice locked", `${icon} applied`);

    // outcome check
    const outcome = computeOutcome(this.s.stats);
    if (outcome) {
      this.finishWeek(outcome);
      return;
    }

    this.refreshHUD();
  }

  private finishWeek(outcome: "SURVIVED" | "BROKE" | "BURNOUT") {
    this.s.outcome = outcome;

    // Overlay summary
    const w = this.scale.width;
    const h = this.scale.height;

    const modalBg = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55).setDepth(100);
    const card = this.add.rectangle(w / 2, h / 2, 560, 260, 0x0f172a).setStrokeStyle(2, 0x1f2a44).setDepth(101);

    const title = this.add.text(w / 2, h / 2 - 86, outcome === "SURVIVED" ? "You survived the week" : outcome === "BROKE" ? "You went broke" : "You burned out", {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "20px",
      color: "#e5e7eb",
    }).setOrigin(0.5).setDepth(101);

    const icons = this.s.memory.lastRunIcons
      .slice(0, 7)
      .sort((a, b) => a.dayIndex - b.dayIndex)
      .map((x) => `${["MON","TUE","WED","THU","FRI","SAT","SUN"][x.dayIndex]} ${x.icon}`)
      .join("   ");

    const detail = this.add.text(w / 2, h / 2 - 40, `Run #${this.s.memory.runs + 1}\n${icons || "No major choices logged"}`, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "14px",
      color: "#94a3b8",
      align: "center",
    }).setOrigin(0.5).setDepth(101);

    const stats = this.add.text(w / 2, h / 2 + 18, `Cash: ${this.s.stats.cash}   Debt: ${this.s.stats.debt}   Stress: ${this.s.stats.stress}`, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "14px",
      color: "#e5e7eb",
    }).setOrigin(0.5).setDepth(101);

    const btn = this.add.rectangle(w / 2, h / 2 + 86, 220, 44, 0x111827).setStrokeStyle(2, 0x24324d).setDepth(101);
    const btnText = this.add.text(w / 2, h / 2 + 86, "One more try", {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "14px",
      color: "#e5e7eb",
    }).setOrigin(0.5).setDepth(101);

    const hit = this.add.rectangle(w / 2, h / 2 + 86, 220, 44, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(102);
    hit.on("pointerdown", () => {
      modalBg.destroy();
      card.destroy();
      title.destroy();
      detail.destroy();
      stats.destroy();
      btn.destroy();
      btnText.destroy();
      hit.destroy();

      // reset, keep "learning"
      this.s.memory.lastRunOutcome = outcome;
      this.s = resetWeekKeepMemory(this.s);

      this.refreshHUD();
      this.highlightDay(0);

      // re-schedule prompts cleanly by restarting scene timers
      this.time.removeAllEvents();
      this.schedulePrompts();
    });
  }

  private refreshHUD() {
    const { cash, debt, stress } = this.s.stats;
    this.hudText.setText(
      `Cash: ${cash}   Debt: ${debt}   Stress: ${stress}   •   Day: ${["MON","TUE","WED","THU","FRI","SAT","SUN"][this.s.dayIndex]}`
    );
  }

  private effectsHint(effects: any) {
    const parts: string[] = [];
    if (effects.cash) parts.push(`${effects.cash > 0 ? "+" : ""}${effects.cash} cash`);
    if (effects.debt) parts.push(`${effects.debt > 0 ? "+" : ""}${effects.debt} debt`);
    if (effects.stress) parts.push(`${effects.stress > 0 ? "+" : ""}${effects.stress} stress`);
    return parts.join(" • ") || "No change";
  }

  private flashToast(title: string, subtitle: string) {
    const w = this.scale.width;
    const y = 110;

    const bg = this.add.rectangle(w - 20, y, 260, 54, 0x0f172a, 0.9).setOrigin(1, 0.5).setDepth(200).setStrokeStyle(2, 0x1f2a44);
    const t1 = this.add.text(w - 20 - 248, y - 10, title, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "13px",
      color: "#e5e7eb",
    }).setDepth(201);
    const t2 = this.add.text(w - 20 - 248, y + 10, subtitle, {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      fontSize: "12px",
      color: "#94a3b8",
    }).setDepth(201);

    this.tweens.add({
      targets: [bg, t1, t2],
      alpha: 0,
      delay: 900,
      duration: 220,
      onComplete: () => {
        bg.destroy();
        t1.destroy();
        t2.destroy();
      },
    });
  }
}
