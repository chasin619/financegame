import Phaser from 'phaser';
import { GameState, Cents } from '@/types/game';

export class Level1Scene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  
  // Offer blocks
  private cashBlock!: Phaser.Physics.Arcade.Sprite;
  private creditBlock!: Phaser.Physics.Arcade.Sprite;
  private gameBlock!: Phaser.Physics.Arcade.Sprite;
  private bankBlock!: Phaser.Physics.Arcade.Sprite;
  private subscriptionBlock!: Phaser.Physics.Arcade.Sprite;
  
  // Chasers
  private debtGhost?: Phaser.Physics.Arcade.Sprite;
  private stressFog?: Phaser.GameObjects.Rectangle;
  
  // UI
  private cashText!: Phaser.GameObjects.Text;
  private debtText!: Phaser.GameObjects.Text;
  private happinessBar!: Phaser.GameObjects.Graphics;
  private healthBar!: Phaser.GameObjects.Graphics;
  private stressBar!: Phaser.GameObjects.Graphics;
  
  // Game state
  private gameState!: GameState;
  private localCash: number = 0;
  private localDebt: number = 0;
  private localHappiness: number = 70;
  private localHealth: number = 80;
  private localStress: number = 0;
  private usedCredit: boolean = false;
  private hasSubscription: boolean = false;
  private hasFun: boolean = false;
  private hasBank: boolean = false;
  
  // Flag
  private finishFlag!: Phaser.GameObjects.Rectangle;
  private wonGame: boolean = false;

  constructor() {
    super({ key: 'Level1Scene' });
  }

  create() {
    // Get initial game state
    this.gameState = this.registry.get('initialGameState');
    this.localCash = this.gameState.cash / 100;
    this.localDebt = this.gameState.creditCard.balance / 100;
    this.localHappiness = this.gameState.happiness;
    this.localHealth = this.gameState.health;
    this.localStress = this.gameState.stressLevel;

    // Create world
    this.createWorld();
    this.createPlayer();
    this.createOfferBlocks();
    this.createUI();
    this.createFinishFlag();
    
    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  createWorld() {
    // Sky
    this.add.rectangle(600, 300, 1200, 600, 0x87CEEB);
    
    // Ground platform
    this.platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(600, 570, 1200, 60, 0x8B4513);
    this.platforms.add(ground);
    
    // Some floating platforms
    const platform1 = this.add.rectangle(300, 450, 200, 30, 0x654321);
    this.platforms.add(platform1);
    
    const platform2 = this.add.rectangle(700, 350, 200, 30, 0x654321);
    this.platforms.add(platform2);
    
    const platform3 = this.add.rectangle(1000, 450, 200, 30, 0x654321);
    this.platforms.add(platform3);
  }

  createPlayer() {
    // Simple rectangle player (add sprite later)
    this.player = this.physics.add.sprite(100, 450, '') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    
    // Draw player as rectangle
    const graphics = this.add.graphics();
    graphics.fillStyle(0x0000FF, 1);
    graphics.fillRect(-15, -20, 30, 40);
    graphics.generateTexture('player', 30, 40);
    graphics.destroy();
    this.player.setTexture('player');
    
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    
    this.physics.add.collider(this.player, this.platforms);
  }

  createOfferBlocks() {
    // LESSON 1: Cash vs Credit
    this.cashBlock = this.createBlock(250, 380, 0x00FF00, '💵\n$50');
    this.creditBlock = this.createBlock(350, 380, 0xFF00FF, '💳\n$100');
    
    // LESSON 2: Fun vs Savings
    this.gameBlock = this.createBlock(650, 280, 0xFF69B4, '🎮\nGame');
    this.bankBlock = this.createBlock(750, 480, 0xFFD700, '🏦\nBank');
    
    // LESSON 3: Subscription
    this.subscriptionBlock = this.createBlock(950, 380, 0xFF0000, '📺\nNetflix');
    
    // Setup collisions for each block
    this.setupBlockCollision(this.cashBlock, () => this.hitCashBlock());
    this.setupBlockCollision(this.creditBlock, () => this.hitCreditBlock());
    this.setupBlockCollision(this.gameBlock, () => this.hitGameBlock());
    this.setupBlockCollision(this.bankBlock, () => this.hitBankBlock());
    this.setupBlockCollision(this.subscriptionBlock, () => this.hitSubscriptionBlock());
  }

  createBlock(x: number, y: number, color: number, label: string): Phaser.Physics.Arcade.Sprite {
    // Create block
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-25, -25, 50, 50, 5);
    graphics.lineStyle(3, 0xFFFFFF);
    graphics.strokeRoundedRect(-25, -25, 50, 50, 5);
    const key = `block_${x}_${y}`;
    graphics.generateTexture(key, 50, 50);
    graphics.destroy();
    
    const block = this.physics.add.sprite(x, y, key);
    block.setImmovable(true);
    block.body!.setAllowGravity(false);
    
    // Add label
    const text = this.add.text(x, y, label, {
      fontSize: '14px',
      color: '#fff',
      align: 'center',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    
    return block as Phaser.Physics.Arcade.Sprite;
  }

  setupBlockCollision(block: Phaser.Physics.Arcade.Sprite, callback: () => void) {
    let hasHit = false;
    this.physics.add.collider(this.player, block, () => {
      if (!hasHit && this.player.body!.velocity.y > 0) {
        hasHit = true;
        callback();
        block.setAlpha(0.3); // Visual feedback
      }
    });
  }

  // LESSON 1: Cash Block
  hitCashBlock() {
    this.localCash += 50;
    this.showFloatingText(this.cashBlock.x, this.cashBlock.y - 50, '+$50', 0x00FF00);
    this.playSound('cash');
    this.updateUI();
  }

  // LESSON 1: Credit Block
  hitCreditBlock() {
    this.localCash += 100;
    this.usedCredit = true;
    this.localDebt += 100;
    this.showFloatingText(this.creditBlock.x, this.creditBlock.y - 50, '+$100!', 0xFF00FF);
    this.playSound('credit');
    this.updateUI();
    
    // Spawn debt ghost after 2 seconds
    this.time.delayedCall(2000, () => {
      this.spawnDebtGhost();
    });
  }

  // LESSON 2: Game Block (Fun)
  hitGameBlock() {
    if (this.localCash >= 30) {
      this.localCash -= 30;
      this.localHappiness = Math.min(100, this.localHappiness + 20);
      this.hasFun = true;
      this.showFloatingText(this.gameBlock.x, this.gameBlock.y - 50, '🎉 +20 Happy!', 0xFFFF00);
      this.playSound('fun');
      
      // Fun visual effect
      this.cameras.main.flash(200, 255, 255, 0);
    } else {
      this.showFloatingText(this.gameBlock.x, this.gameBlock.y - 50, 'Need $30!', 0xFF0000);
    }
    this.updateUI();
  }

  // LESSON 2: Bank Block (Savings)
  hitBankBlock() {
    if (this.localCash >= 50) {
      this.localCash -= 50;
      this.hasBank = true;
      this.showFloatingText(this.bankBlock.x, this.bankBlock.y - 50, '🛡️ Protected!', 0xFFD700);
      this.playSound('bank');
      
      // Give shield visual
      const shield = this.add.circle(this.player.x, this.player.y, 25, 0xFFD700, 0.3);
      shield.setStrokeStyle(2, 0xFFD700);
      this.tweens.add({
        targets: shield,
        alpha: 0,
        duration: 1000,
        onComplete: () => shield.destroy()
      });
    } else {
      this.showFloatingText(this.bankBlock.x, this.bankBlock.y - 50, 'Need $50!', 0xFF0000);
    }
    this.updateUI();
  }

  // LESSON 3: Subscription Block
  hitSubscriptionBlock() {
    if (!this.hasSubscription) {
      this.hasSubscription = true;
      this.showFloatingText(this.subscriptionBlock.x, this.subscriptionBlock.y - 50, '📺 Subscribed!', 0xFF0000);
      this.playSound('subscription');
      
      // Reduce player speed
      this.player.setMaxVelocity(100, 500);
      
      // Start monthly charge
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          if (this.hasSubscription && !this.wonGame) {
            this.localCash -= 15;
            this.showFloatingText(this.player.x, this.player.y - 50, '-$15/mo', 0xFF0000);
            this.updateUI();
          }
        },
        loop: true
      });
    }
    this.updateUI();
  }

  spawnDebtGhost() {
    if (this.debtGhost) return;
    
    // Create ghost
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFF0000, 0.7);
    graphics.fillCircle(0, 0, 20);
    graphics.fillCircle(-10, -5, 10);
    graphics.fillCircle(10, -5, 10);
    graphics.generateTexture('ghost', 40, 40);
    graphics.destroy();
    
    this.debtGhost = this.physics.add.sprite(50, 300, 'ghost');
    this.debtGhost.body!.setAllowGravity(false);
    
    // Ghost chases player
    this.physics.add.overlap(this.player, this.debtGhost, () => {
      this.localStress = Math.min(100, this.localStress + 5);
      this.localHappiness = Math.max(0, this.localHappiness - 3);
      this.cameras.main.shake(100, 0.002);
      this.updateUI();
    });
    
    // Add floating text above ghost
    const ghostText = this.add.text(50, 280, '👻 DEBT', {
      fontSize: '12px',
      color: '#ff0000',
      fontStyle: 'bold'
    });
    ghostText.setOrigin(0.5);
    
    this.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.debtGhost && this.player) {
          ghostText.setPosition(this.debtGhost.x, this.debtGhost.y - 30);
        }
      },
      loop: true
    });
  }

  createFinishFlag() {
    this.finishFlag = this.add.rectangle(1150, 520, 40, 80, 0x00FF00);
    this.finishFlag.setStrokeStyle(3, 0xFFFFFF);
    
    const flagText = this.add.text(1150, 520, '🏁\nFINISH', {
      fontSize: '16px',
      color: '#fff',
      align: 'center',
      fontStyle: 'bold'
    });
    flagText.setOrigin(0.5);
  }

  createUI() {
    // Stats panel
    const panel = this.add.rectangle(100, 50, 180, 120, 0x000000, 0.7);
    panel.setScrollFactor(0);
    
    this.cashText = this.add.text(20, 20, '', {
      fontSize: '16px',
      color: '#00FF00',
      fontStyle: 'bold'
    });
    this.cashText.setScrollFactor(0);
    
    this.debtText = this.add.text(20, 45, '', {
      fontSize: '16px',
      color: '#FF0000',
      fontStyle: 'bold'
    });
    this.debtText.setScrollFactor(0);
    
    // Bars
    const barY = 85;
    this.add.text(20, barY, '😊', { fontSize: '14px' }).setScrollFactor(0);
    this.happinessBar = this.add.graphics();
    this.happinessBar.setScrollFactor(0);
    
    this.add.text(20, barY + 20, '❤️', { fontSize: '14px' }).setScrollFactor(0);
    this.healthBar = this.add.graphics();
    this.healthBar.setScrollFactor(0);
    
    this.add.text(20, barY + 40, '😰', { fontSize: '14px' }).setScrollFactor(0);
    this.stressBar = this.add.graphics();
    this.stressBar.setScrollFactor(0);
    
    this.updateUI();
  }

  updateUI() {
    this.cashText.setText(`💵 Cash: $${this.localCash.toFixed(0)}`);
    this.debtText.setText(`💳 Debt: $${this.localDebt.toFixed(0)}`);
    
    // Update bars
    this.happinessBar.clear();
    this.happinessBar.fillStyle(0x00FF00);
    this.happinessBar.fillRect(40, 87, this.localHappiness * 1.2, 10);
    
    this.healthBar.clear();
    this.healthBar.fillStyle(0xFF0000);
    this.healthBar.fillRect(40, 107, this.localHealth * 1.2, 10);
    
    this.stressBar.clear();
    this.stressBar.fillStyle(0xFFFF00);
    this.stressBar.fillRect(40, 127, this.localStress * 1.2, 10);
  }

  showFloatingText(x: number, y: number, text: string, color: number) {
    const floatingText = this.add.text(x, y, text, {
      fontSize: '20px',
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3
    });
    floatingText.setOrigin(0.5);
    
    this.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => floatingText.destroy()
    });
  }

  playSound(type: string) {
    // Add sound effects later
    // For now, just console log
    console.log(`Sound: ${type}`);
  }

  update() {
    if (this.wonGame) return;
    
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(this.hasSubscription ? -100 : -160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.hasSubscription ? 100 : 160);
    } else {
      this.player.setVelocityX(0);
    }
    
    // Jump
    if (this.cursors.up.isDown && this.player.body!.touching.down) {
      this.player.setVelocityY(-400);
    }
    
    // Ghost chases player
    if (this.debtGhost && this.player) {
      const speed = 80;
      if (this.debtGhost.x < this.player.x) {
        this.debtGhost.setVelocityX(speed);
      } else {
        this.debtGhost.setVelocityX(-speed);
      }
      
      if (this.debtGhost.y < this.player.y) {
        this.debtGhost.setVelocityY(speed * 0.5);
      } else {
        this.debtGhost.setVelocityY(-speed * 0.5);
      }
    }
    
    // Check if reached finish
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.finishFlag.getBounds()
    )) {
      this.finishLevel();
    }
  }

  finishLevel() {
    if (this.wonGame) return;
    this.wonGame = true;
    
    // Stop physics
    this.physics.pause();
    
    // Calculate final score
    const netWorth = this.localCash - this.localDebt;
    
    // Show results
    const resultsBg = this.add.rectangle(600, 300, 600, 400, 0x000000, 0.9);
    resultsBg.setScrollFactor(0);
    
    const title = this.add.text(600, 150, '🏁 LEVEL COMPLETE!', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);
    
    const results = [
      `💰 Net Worth: $${netWorth}`,
      `😊 Happiness: ${Math.round(this.localHappiness)}/100`,
      `❤️ Health: ${Math.round(this.localHealth)}/100`,
      `😰 Stress: ${Math.round(this.localStress)}/100`,
      ``,
      this.usedCredit ? '⚠️ Used credit (ghost chased you!)' : '✅ Avoided credit',
      this.hasFun ? '🎮 Had fun!' : '😐 No fun',
      this.hasBank ? '🛡️ Protected savings!' : '❌ No emergency fund',
      this.hasSubscription ? '📺 Subscription slowed you down' : '✅ No subscriptions',
    ];
    
    const resultsText = this.add.text(600, 250, results.join('\n'), {
      fontSize: '18px',
      color: '#fff',
      align: 'center'
    });
    resultsText.setOrigin(0.5);
    resultsText.setScrollFactor(0);
    
    // Buttons
    const replayBtn = this.add.rectangle(500, 450, 150, 50, 0x00FF00);
    replayBtn.setScrollFactor(0);
    replayBtn.setInteractive();
    replayBtn.on('pointerdown', () => {
      this.scene.restart();
    });
    
    const replayText = this.add.text(500, 450, 'REPLAY', {
      fontSize: '20px',
      color: '#000',
      fontStyle: 'bold'
    });
    replayText.setOrigin(0.5);
    replayText.setScrollFactor(0);
    
    const nextBtn = this.add.rectangle(700, 450, 150, 50, 0x0000FF);
    nextBtn.setScrollFactor(0);
    nextBtn.setInteractive();
    nextBtn.on('pointerdown', () => {
      alert('Level 2 coming soon!');
    });
    
    const nextText = this.add.text(700, 450, 'NEXT LEVEL', {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold'
    });
    nextText.setOrigin(0.5);
    nextText.setScrollFactor(0);
  }
}