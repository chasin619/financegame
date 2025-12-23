import * as Phaser from "phaser";
import { GameState } from "@/types/game";

type OfferId =
  | "cash"
  | "credit"
  | "coupon"
  | "sidegig"
  | "emergency"
  | "health"
  | "insurance"
  | "netflix"
  | "coffee";

export class Level1Scene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;

  private blocks!: Phaser.Physics.Arcade.StaticGroup; // offer blocks (question blocks)
  private coins!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;

  // Game state
  private gameState!: GameState;
  private localCash = 0;
  private localDebt = 0;
  private localHappiness = 70;
  private localHealth = 80;
  private localStress = 0;

  private usedCredit = false;
  private hasSubscription = false;
  private hasEmergencyFund = false;
  private hasInsurance = false;

  // UI
  private cashText!: Phaser.GameObjects.Text;
  private debtText!: Phaser.GameObjects.Text;
  private happinessBar!: Phaser.GameObjects.Graphics;
  private healthBar!: Phaser.GameObjects.Graphics;
  private stressBar!: Phaser.GameObjects.Graphics;

  // Chaser
  private debtGhost?: Phaser.Physics.Arcade.Sprite;

  // Finish
  private finishFlag!: Phaser.GameObjects.Container;
  private wonGame = false;

  // Offer blocks - hit tracking
  private hitBlocks: Set<string> = new Set();

  // Jump feel
  private lastGroundedAt = 0;
  private jumpPressedAt = 0;

  // === TUNING ===
  private readonly COYOTE_MS = 140;
  private readonly JUMP_BUFFER_MS = 140;

  // main jump control:
  private readonly JUMP_VELOCITY = -860; // <- change this
  private readonly GRAVITY_Y = 1150; // <- and/or this

  private readonly RUN_SPEED = 270;
  private readonly RUN_SPEED_SLOW = 210;

  // sizing
  private readonly BLOCK_SIZE = 56;
  private readonly WORLD_W = 5200;
  private readonly WORLD_H = 900;

  constructor() {
    super({ key: "Level1Scene" });
  }

  create() {
    // Initial state
    this.gameState = this.registry.get("initialGameState");
    this.localCash = this.gameState.cash / 100;
    this.localDebt = this.gameState.creditCard.balance / 100;
    this.localHappiness = this.gameState.happiness;
    this.localHealth = this.gameState.health;
    this.localStress = this.gameState.stressLevel;

    // World bounds
    this.physics.world.setBounds(0, 0, this.WORLD_W, this.WORLD_H);

    // Build world
    this.createBackground();
    this.createGround();
    this.createPlatforms();
    this.createMovingPlatforms();

    this.createPlayer();

    this.createOfferBlocks();
    this.createCoins();
    this.createHazards();

    this.createFinishFlag();
    this.createUI();

    // Camera
    this.cameras.main.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(160, 120);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Colliders / overlaps
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    // IMPORTANT: offer block collider with callback (reliable “hit from below”)
    this.physics.add.collider(this.player, this.blocks, (pObj, bObj) => {
      const p = pObj as Phaser.Physics.Arcade.Sprite;
      const b = bObj as Phaser.Physics.Arcade.Sprite;

      const pBody = p.body as Phaser.Physics.Arcade.Body;
      const bBody = b.body as Phaser.Physics.Arcade.Body;

      // Arcade is quirky: “touching.up” is the most reliable for head bumps.
      // Also require upward velocity to avoid triggering when standing on top.
      const hitFromBelow =
        (pBody.touching.up || pBody.blocked.up) &&
        (bBody.touching.down || bBody.blocked.down) &&
        pBody.velocity.y < 0;

      if (hitFromBelow) {
        this.tryHitOfferBlock(b);
      }
    });

    // Player <-> coins
    this.physics.add.overlap(this.player, this.coins, (_, coinObj) => {
      const coin = coinObj as Phaser.Physics.Arcade.Sprite;
      coin.disableBody(true, true);
      this.localCash += 5;
      this.showFloatingText(this.player.x, this.player.y - 70, "+$5", 0x22c55e);
      this.updateUI();
    });

    // Player <-> hazards
    this.physics.add.overlap(this.player, this.hazards, () => {
      this.takeDamageFromHazard();
    });
  }

  // ---------- WORLD ----------

  private createBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x7dd3fc, 0x7dd3fc, 0xe0f2fe, 0xe0f2fe, 1);
    g.fillRect(0, 0, this.WORLD_W, this.WORLD_H);

    for (let i = 0; i < 20; i++) {
      this.add.ellipse(
        Phaser.Math.Between(80, this.WORLD_W - 80),
        Phaser.Math.Between(50, 260),
        Phaser.Math.Between(140, 240),
        Phaser.Math.Between(60, 110),
        0xffffff,
        0.7
      );
    }

    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(0, this.WORLD_W);
      const y = Phaser.Math.Between(540, 720);
      const r = Phaser.Math.Between(90, 180);
      const c = Phaser.Display.Color.IntegerToColor(0x22c55e).darken(25).color;
      this.add.circle(x, y, r, c, 0.35);
    }
  }

  private createGround() {
    this.platforms = this.physics.add.staticGroup();

    const groundH = 90;
    const groundY = 850;

    for (let x = 0; x < this.WORLD_W; x += 240) {
      const dirt = this.add.rectangle(x + 120, groundY, 240, groundH, 0x16a34a);
      this.platforms.add(dirt);

      const grass = this.add.rectangle(x + 120, groundY - groundH / 2, 240, 12, 0x22c55e);
      this.platforms.add(grass);
    }
  }

  private createPlatforms() {
    const plat = [
      // Intro ramps
      { x: 420, y: 700, w: 320, h: 32 },
      { x: 760, y: 620, w: 260, h: 32 },
      { x: 1040, y: 560, w: 240, h: 32 },

      // Cash vs credit arena + steps
      { x: 1300, y: 520, w: 320, h: 32 },
      { x: 1500, y: 610, w: 220, h: 32 },
      { x: 1700, y: 690, w: 220, h: 32 },

      // Fun + coupon corridor
      { x: 2000, y: 560, w: 340, h: 32 },
      { x: 2260, y: 480, w: 220, h: 32 },
      { x: 2500, y: 540, w: 220, h: 32 },

      // Side gig + hazard pit
      { x: 2800, y: 640, w: 360, h: 32 },
      { x: 3120, y: 560, w: 260, h: 32 },
      { x: 3360, y: 480, w: 240, h: 32 },

      // Emergency fund section
      { x: 3660, y: 620, w: 320, h: 32 },
      { x: 3920, y: 540, w: 240, h: 32 },

      // Insurance / subscription stairs
      { x: 4160, y: 660, w: 260, h: 32 },
      { x: 4400, y: 580, w: 220, h: 32 },
      { x: 4620, y: 520, w: 220, h: 32 },

      // Final stretch
      { x: 4880, y: 680, w: 320, h: 32 },
    ];

    plat.forEach((p) => {
      const platform = this.add.rectangle(p.x, p.y, p.w, p.h, 0x8b5a2b);
      platform.setStrokeStyle(4, 0x5b3a1a);
      this.platforms.add(platform);

      this.add.rectangle(p.x, p.y - p.h / 2 - 4, p.w, 10, 0x22c55e).setAlpha(0.9);
    });
  }

  private createMovingPlatforms() {
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });

    const p = this.add.rectangle(3100, 720, 200, 28, 0x334155);
    this.physics.add.existing(p);
    const body = p.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);

    this.movingPlatforms.add(p);

    this.tweens.add({
      targets: p,
      x: 3400,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
      onUpdate: () => body.updateFromGameObject(),
    });
  }

  // ---------- PLAYER ----------

  private createPlayer() {
    this.player = this.physics.add.sprite(120, 720, "") as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    // Texture
    const g = this.add.graphics();
    g.fillStyle(0x0b1020, 0.25);
    g.fillRoundedRect(7, 48, 34, 7, 4);

    g.lineStyle(3, 0x111827, 1);

    g.fillStyle(0xef4444, 1);
    g.fillRoundedRect(10, 5, 28, 14, 7);
    g.strokeRoundedRect(10, 5, 28, 14, 7);

    g.fillStyle(0xfcc9a7, 1);
    g.fillRoundedRect(12, 18, 24, 16, 7);
    g.strokeRoundedRect(12, 18, 24, 16, 7);

    g.fillStyle(0xffffff, 1);
    g.fillCircle(20, 26, 3);
    g.fillCircle(28, 26, 3);
    g.fillStyle(0x111827, 1);
    g.fillCircle(20, 26, 1.5);
    g.fillCircle(28, 26, 1.5);

    g.fillStyle(0x2563eb, 1);
    g.fillRoundedRect(12, 34, 24, 10, 5);
    g.strokeRoundedRect(12, 34, 24, 10, 5);

    g.fillStyle(0x1e3a8a, 1);
    g.fillRoundedRect(14, 40, 20, 12, 5);
    g.strokeRoundedRect(14, 40, 20, 12, 5);

    g.fillStyle(0xfbbf24, 1);
    g.fillCircle(18, 44, 1.8);
    g.fillCircle(30, 44, 1.8);

    g.fillStyle(0x111827, 1);
    g.fillRoundedRect(14, 52, 10, 4, 2);
    g.fillRoundedRect(24, 52, 10, 4, 2);

    g.generateTexture("player", 48, 56);
    g.destroy();

    this.player.setTexture("player");

    // Physics feel
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(this.GRAVITY_Y);
    this.player.setDragX(1800);
    this.player.setMaxVelocity(330, 1200);

    // IMPORTANT: collider size/offset (head must reach blocks!)
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(26, 46, true);
    body.setOffset(11, 8);
  }

  // ---------- OFFERS (BLOCKS) ----------

  private createOfferBlocks() {
    this.blocks = this.physics.add.staticGroup();

    const offers: Array<{ x: number; y: number; id: OfferId; emoji: string; label: string; color: number }> = [
      { x: 1280, y: 450, id: "cash", emoji: "💵", label: "Cash\n+$50", color: 0x16a34a },
      { x: 1480, y: 450, id: "credit", emoji: "💳", label: "Credit\n+$120", color: 0xdb2777 },

      { x: 2060, y: 490, id: "coffee", emoji: "☕", label: "Coffee\n-$6", color: 0x92400e },
      { x: 2260, y: 410, id: "coupon", emoji: "🏷️", label: "Coupon\n+20% Cash", color: 0x0ea5e9 },

      { x: 2800, y: 570, id: "sidegig", emoji: "🧰", label: "Side Gig\n+$80", color: 0x9333ea },

      { x: 3660, y: 550, id: "emergency", emoji: "🛡️", label: "Emergency\n-$50", color: 0xf59e0b },
      { x: 3920, y: 470, id: "health", emoji: "❤️", label: "Health\n+15", color: 0xef4444 },

      { x: 4400, y: 510, id: "insurance", emoji: "📄", label: "Insurance\n-$30", color: 0x22c55e },
      { x: 4620, y: 450, id: "netflix", emoji: "📺", label: "Netflix\n-$15/mo", color: 0xef4444 },
    ];

    offers.forEach((o) => this.createOfferBlock(o.x, o.y, o.emoji, o.label, o.color, o.id));
  }

  private createOfferBlock(x: number, y: number, emoji: string, label: string, color: number, id: OfferId) {
    const size = this.BLOCK_SIZE;

    const key = `block_${id}`;
    if (!this.textures.exists(key)) {
      const graphics = this.add.graphics();
      const base = color;
      const light = Phaser.Display.Color.IntegerToColor(base).lighten(25).color;
      const dark = Phaser.Display.Color.IntegerToColor(base).darken(25).color;

      graphics.fillStyle(base, 1);
      graphics.fillRoundedRect(0, 0, size, size, 10);

      graphics.fillStyle(light, 0.55);
      graphics.fillRoundedRect(6, 6, size * 0.6, size * 0.28, 8);

      graphics.lineStyle(4, dark, 1);
      graphics.strokeRoundedRect(0, 0, size, size, 10);

      graphics.lineStyle(2, 0xffffff, 0.35);
      graphics.strokeRoundedRect(5, 5, size - 10, size - 10, 9);

      graphics.generateTexture(key, size, size);
      graphics.destroy();
    }

    // IMPORTANT: use staticGroup.create + refreshBody
    const block = this.blocks.create(x, y, key) as Phaser.Physics.Arcade.Sprite;
    block.setData("id", id);
    block.refreshBody();

    const emojiText = this.add.text(x, y - 8, emoji, { fontSize: "28px", align: "center" }).setOrigin(0.5);
    const labelText = this.add
      .text(x, y + 22, label, {
        fontSize: "13px",
        color: "#fff",
        align: "center",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 4,
        lineSpacing: 2,
      })
      .setOrigin(0.5);

    emojiText.setDepth(5);
    labelText.setDepth(5);

    block.setData("emojiText", emojiText);
    block.setData("labelText", labelText);
  }

  private tryHitOfferBlock(block: Phaser.Physics.Arcade.Sprite) {
    const id = block.getData("id") as OfferId;
    const key = `${id}_${Math.round(block.x)}_${Math.round(block.y)}`;
    if (this.hitBlocks.has(key)) return;
    this.hitBlocks.add(key);
    this.handleOffer(id, block);
  }

  // ---------- COINS ----------

  private createCoins() {
    this.coins = this.physics.add.group({ allowGravity: false });

    const points = [
      { x: 420, y: 650 },
      { x: 460, y: 650 },
      { x: 500, y: 650 },

      { x: 1260, y: 390 },
      { x: 1300, y: 390 },
      { x: 1340, y: 390 },

      { x: 2260, y: 360 },
      { x: 2300, y: 360 },
      { x: 2340, y: 360 },

      { x: 3100, y: 680 },
      { x: 3150, y: 680 },
      { x: 3200, y: 680 },

      { x: 4880, y: 630 },
      { x: 4920, y: 630 },
    ];

    if (!this.textures.exists("coin")) {
      const g = this.add.graphics();
      g.fillStyle(0xfbbf24, 1);
      g.fillCircle(12, 12, 12);
      g.lineStyle(3, 0xffffff, 0.6);
      g.strokeCircle(12, 12, 11);
      g.generateTexture("coin", 24, 24);
      g.destroy();
    }

    points.forEach((p) => {
      const c = this.coins.create(p.x, p.y, "coin") as Phaser.Physics.Arcade.Sprite;
      c.setCircle(12);
      this.tweens.add({
        targets: c,
        y: p.y - 10,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    });
  }

  // ---------- HAZARDS ----------

  private createHazards() {
    this.hazards = this.physics.add.staticGroup();

    if (!this.textures.exists("spike")) {
      const g = this.add.graphics();
      g.fillStyle(0x111827, 1);
      g.fillTriangle(18, 0, 0, 28, 36, 28);
      g.fillStyle(0xef4444, 1);
      g.fillTriangle(18, 6, 6, 26, 30, 26);
      g.generateTexture("spike", 36, 28);
      g.destroy();
    }

    const spikes = [
      { x: 3020, y: 830 },
      { x: 3080, y: 830 },
      { x: 3140, y: 830 },
      { x: 3200, y: 830 },
      { x: 3260, y: 830 },
    ];

    spikes.forEach((s) => {
      const sp = this.hazards.create(s.x, s.y, "spike") as Phaser.Physics.Arcade.Sprite;
      sp.refreshBody();
    });
  }

  private takeDamageFromHazard() {
    if ((this.player as any).__invuln) return;
    (this.player as any).__invuln = true;

    this.localStress = Math.min(100, this.localStress + 10);
    this.localHealth = Math.max(0, this.localHealth - 8);
    this.cameras.main.shake(140, 0.01);

    const dir = this.player.flipX ? 1 : -1;
    this.player.setVelocityX(260 * dir);
    this.player.setVelocityY(this.JUMP_VELOCITY * 0.65);

    this.showFloatingText(this.player.x, this.player.y - 70, "+STRESS", 0xfbbf24);
    this.updateUI();

    this.time.delayedCall(650, () => {
      (this.player as any).__invuln = false;
    });
  }

  // ---------- FINISH ----------

  private createFinishFlag() {
    const flagContainer = this.add.container(this.WORLD_W - 220, 760);

    const pole = this.add.rectangle(-30, 0, 16, 190, 0x111827);
    const flag = this.add.rectangle(20, -55, 110, 70, 0x22c55e);
    flag.setStrokeStyle(6, 0xffffff);

    const flagText = this.add.text(20, -55, "🏁", {
      fontSize: "34px",
      color: "#fff",
      align: "center",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 5,
    });
    flagText.setOrigin(0.5);

    const label = this.add.text(20, 35, "FINISH", {
      fontSize: "22px",
      color: "#fff",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 5,
    });
    label.setOrigin(0.5);

    flagContainer.add([pole, flag, flagText, label]);
    this.finishFlag = flagContainer;
  }

  // ---------- UI ----------

  private createUI() {
    const panel = this.add.rectangle(150, 80, 280, 160, 0x000000, 0.85);
    panel.setScrollFactor(0);
    panel.setStrokeStyle(4, 0xfbbf24);

    this.cashText = this.add
      .text(30, 25, "", { fontSize: "24px", color: "#22c55e", fontStyle: "bold", stroke: "#000", strokeThickness: 4 })
      .setScrollFactor(0);

    this.debtText = this.add
      .text(30, 65, "", { fontSize: "24px", color: "#ef4444", fontStyle: "bold", stroke: "#000", strokeThickness: 4 })
      .setScrollFactor(0);

    this.add.text(30, 110, "😊", { fontSize: "20px" }).setScrollFactor(0);
    this.happinessBar = this.add.graphics().setScrollFactor(0);

    this.add.text(30, 140, "❤️", { fontSize: "20px" }).setScrollFactor(0);
    this.healthBar = this.add.graphics().setScrollFactor(0);

    this.add.text(30, 170, "😰", { fontSize: "20px" }).setScrollFactor(0);
    this.stressBar = this.add.graphics().setScrollFactor(0);

    this.updateUI();
  }

  private updateUI() {
    this.cashText.setText(`💵 $${this.localCash.toFixed(0)}`);
    this.debtText.setText(`💳 $${this.localDebt.toFixed(0)}`);

    this.happinessBar.clear();
    this.happinessBar.fillStyle(0x22c55e);
    this.happinessBar.fillRoundedRect(65, 113, this.localHappiness * 1.9, 18, 5);
    this.happinessBar.lineStyle(2, 0xffffff);
    this.happinessBar.strokeRoundedRect(65, 113, 190, 18, 5);

    this.healthBar.clear();
    this.healthBar.fillStyle(0xef4444);
    this.healthBar.fillRoundedRect(65, 143, this.localHealth * 1.9, 18, 5);
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRoundedRect(65, 143, 190, 18, 5);

    this.stressBar.clear();
    this.stressBar.fillStyle(0xfbbf24);
    this.stressBar.fillRoundedRect(65, 173, this.localStress * 1.9, 18, 5);
    this.stressBar.lineStyle(2, 0xffffff);
    this.stressBar.strokeRoundedRect(65, 173, 190, 18, 5);
  }

  private showFloatingText(x: number, y: number, text: string, color: number) {
    const floatingText = this.add.text(x, y, text, {
      fontSize: "28px",
      color: `#${color.toString(16).padStart(6, "0")}`,
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 6,
    });
    floatingText.setOrigin(0.5);

    this.tweens.add({
      targets: floatingText,
      y: y - 80,
      alpha: 0,
      scale: 1.2,
      duration: 1200,
      onComplete: () => floatingText.destroy(),
    });
  }

  // ---------- OFFER EFFECTS ----------

  private handleOffer(id: OfferId, block: Phaser.Physics.Arcade.Sprite) {
    block.setTint(0x9ca3af);
    block.setAlpha(0.8);

    const emojiText = block.getData("emojiText") as Phaser.GameObjects.Text | undefined;
    const labelText = block.getData("labelText") as Phaser.GameObjects.Text | undefined;
    emojiText?.setAlpha(0.55);
    labelText?.setAlpha(0.55);

    this.tweens.add({
      targets: block,
      y: block.y - 14,
      duration: 90,
      yoyo: true,
    });

    switch (id) {
      case "cash":
        this.localCash += 50;
        this.showFloatingText(block.x, block.y - 70, "+$50", 0x22c55e);
        break;

      case "credit":
        this.localCash += 120;
        this.localDebt += 120;
        this.usedCredit = true;
        this.showFloatingText(block.x, block.y - 70, "+$120 DEBT!", 0xdb2777);
        this.time.delayedCall(1200, () => this.spawnDebtGhost());
        break;

      case "coupon": {
        const bonus = Math.max(10, Math.floor(this.localCash * 0.2));
        this.localCash += bonus;
        this.showFloatingText(block.x, block.y - 70, `+${bonus} BONUS`, 0x0ea5e9);
        break;
      }

      case "sidegig":
        this.localCash += 80;
        this.localStress = Math.min(100, this.localStress + 5);
        this.showFloatingText(block.x, block.y - 70, "+$80 (+stress)", 0x9333ea);
        break;

      case "emergency":
        if (this.localCash >= 50) {
          this.localCash -= 50;
          this.hasEmergencyFund = true;
          this.localStress = Math.max(0, this.localStress - 12);
          this.showFloatingText(block.x, block.y - 70, "EMERGENCY FUND!", 0xf59e0b);
        } else {
          this.showFloatingText(block.x, block.y - 70, "Need $50", 0xef4444);
        }
        break;

      case "health":
        this.localHealth = Math.min(100, this.localHealth + 15);
        this.localHappiness = Math.min(100, this.localHappiness + 6);
        this.showFloatingText(block.x, block.y - 70, "+Health", 0xef4444);
        break;

      case "insurance":
        if (this.localCash >= 30) {
          this.localCash -= 30;
          this.hasInsurance = true;
          this.showFloatingText(block.x, block.y - 70, "INSURED!", 0x22c55e);
        } else {
          this.showFloatingText(block.x, block.y - 70, "Need $30", 0xef4444);
        }
        break;

      case "netflix":
        if (!this.hasSubscription) {
          this.hasSubscription = true;
          this.showFloatingText(block.x, block.y - 70, "SUBSCRIBED…", 0xef4444);
          this.player.setMaxVelocity(280, 1200);

          this.time.addEvent({
            delay: 4500,
            loop: true,
            callback: () => {
              if (!this.wonGame && this.hasSubscription) {
                this.localCash -= 15;
                this.localStress = Math.min(100, this.localStress + 2);
                this.showFloatingText(this.player.x, this.player.y - 90, "-$15", 0xef4444);
                this.updateUI();
              }
            },
          });
        }
        break;

      case "coffee":
        this.localCash = Math.max(0, this.localCash - 6);
        this.localStress = Math.max(0, this.localStress - 3);
        this.localHappiness = Math.min(100, this.localHappiness + 3);
        this.showFloatingText(block.x, block.y - 70, "☕ (+happy)", 0x92400e);
        break;
    }

    this.updateUI();
  }

  private spawnDebtGhost() {
    if (this.debtGhost) return;

    const size = 72;
    const r = size / 2;

    if (!this.textures.exists("ghost")) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xef4444, 0.85);
      graphics.fillCircle(r, r, r);
      graphics.fillCircle(r - 18, r - 10, 18);
      graphics.fillCircle(r + 18, r - 10, 18);

      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(r - 10, r - 6, 7);
      graphics.fillCircle(r + 10, r - 6, 7);

      graphics.fillStyle(0x111827, 1);
      graphics.fillCircle(r - 10, r - 6, 3.5);
      graphics.fillCircle(r + 10, r - 6, 3.5);

      graphics.generateTexture("ghost", size, size);
      graphics.destroy();
    }

    this.debtGhost = this.physics.add.sprite(this.player.x - 220, 420, "ghost");
    this.debtGhost.body!.setAllowGravity(false);

    this.physics.add.overlap(this.player, this.debtGhost, () => {
      const stressGain = this.hasInsurance ? 2 : 5;
      const happyLoss = this.hasInsurance ? 1 : 3;

      this.localStress = Math.min(100, this.localStress + stressGain);
      this.localHappiness = Math.max(0, this.localHappiness - happyLoss);
      this.cameras.main.shake(120, 0.01);
      this.updateUI();
    });

    const ghostText = this.add.text(0, -60, "👻 DEBT", {
      fontSize: "18px",
      color: "#ef4444",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4,
      align: "center",
    });
    ghostText.setOrigin(0.5);
    this.debtGhost.setData("text", ghostText);
  }

  // ---------- UPDATE LOOP ----------

  update() {
    if (this.wonGame) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const isGrounded = body.blocked.down || body.touching.down;

    if (isGrounded) this.lastGroundedAt = this.time.now;

    const speed = this.hasSubscription ? this.RUN_SPEED_SLOW : this.RUN_SPEED;

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.jumpPressedAt = this.time.now;
    }

    const canCoyote = this.time.now - this.lastGroundedAt <= this.COYOTE_MS;
    const hasBuffered = this.time.now - this.jumpPressedAt <= this.JUMP_BUFFER_MS;

    if (hasBuffered && (isGrounded || canCoyote)) {
      this.jumpPressedAt = 0;
      this.player.setVelocityY(this.JUMP_VELOCITY);
    }

    if (this.debtGhost) {
      const speedG = 150;
      const dx = this.player.x - this.debtGhost.x;
      const dy = this.player.y - this.debtGhost.y;

      this.debtGhost.setVelocityX(dx > 0 ? speedG : -speedG);
      this.debtGhost.setVelocityY(dy * 0.5);

      const text = this.debtGhost.getData("text") as Phaser.GameObjects.Text | undefined;
      if (text) text.setPosition(this.debtGhost.x, this.debtGhost.y - 60);
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.finishFlag.x,
      this.finishFlag.y
    );
    if (distance < 150) this.finishLevel();
  }

  private finishLevel() {
    if (this.wonGame) return;
    this.wonGame = true;

    this.physics.pause();

    const netWorth = this.localCash - this.localDebt;

    const overlay = this.add.container(this.cameras.main.scrollX + 800, 450);
    overlay.setScrollFactor(0);

    const bg = this.add.rectangle(0, 0, 900, 700, 0x000000, 0.95);
    bg.setStrokeStyle(6, 0xfbbf24);

    const title = this.add.text(0, -280, "🏁 LEVEL COMPLETE!", {
      fontSize: "56px",
      color: "#fbbf24",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 8,
    });
    title.setOrigin(0.5);

    const results = [
      `💰 Net Worth: $${netWorth}`,
      `😊 Happiness: ${Math.round(this.localHappiness)}/100`,
      `❤️ Health: ${Math.round(this.localHealth)}/100`,
      `😰 Stress: ${Math.round(this.localStress)}/100`,
      ``,
      this.usedCredit ? "⚠️ Used credit (debt chased you)" : "✅ Avoided credit",
      this.hasEmergencyFund ? "🛡️ Emergency fund reduced stress" : "❌ No emergency fund",
      this.hasInsurance ? "📄 Insurance reduced damage" : "❌ No insurance",
      this.hasSubscription ? "📺 Subscription drained cash" : "✅ No subscription trap",
    ];

    const resultsText = this.add.text(0, -80, results.join("\n"), {
      fontSize: "26px",
      color: "#fff",
      align: "center",
      lineSpacing: 12,
    });
    resultsText.setOrigin(0.5);

    const replayBtn = this.add.rectangle(-200, 260, 250, 80, 0x22c55e);
    replayBtn.setStrokeStyle(4, 0xffffff);
    replayBtn.setInteractive();
    replayBtn.on("pointerdown", () => this.scene.restart());

    const replayText = this.add.text(-200, 260, "REPLAY", {
      fontSize: "32px",
      color: "#000",
      fontStyle: "bold",
    });
    replayText.setOrigin(0.5);

    const nextBtn = this.add.rectangle(200, 260, 250, 80, 0x2563eb);
    nextBtn.setStrokeStyle(4, 0xffffff);
    nextBtn.setInteractive();
    nextBtn.on("pointerdown", () => alert("Level 2 coming soon!"));

    const nextText = this.add.text(200, 260, "NEXT", {
      fontSize: "32px",
      color: "#fff",
      fontStyle: "bold",
    });
    nextText.setOrigin(0.5);

    overlay.add([bg, title, resultsText, replayBtn, replayText, nextBtn, nextText]);
  }
}
