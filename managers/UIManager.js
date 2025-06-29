export default class UIManager {
    constructor(scene) {
        this.scene = scene;

        // Create UI elements
        this.createHealthBar();
        this.createScoreText();
        this.createEnemiesRemainingText();
        this.createWinText();

        // Listen for events
        this.scene.events.on('update-health', this.updateHealth, this);
        this.scene.events.on('update-score', this.updateScore, this);
        this.scene.events.on('update-enemies', this.updateEnemiesRemaining, this);
        this.scene.events.on('player-lose', this.showLoseText, this);
        this.scene.events.on('show-loot', this.showLootUI, this);
    }

    createHealthBar() {
        this.healthText = this.scene.add.text(200, 150, `Health: ${this.scene.player.health}`, {
            fontSize: '16px',
            fill: '#fff',
        });
        this.healthText.setDepth(10);
        this.healthText.setScrollFactor(0);
    }

    createScoreText() {

        this.scoreText = this.scene.add.text(200, 175, 'Score: 0', {
            fontSize: '16px',
            fill: '#fff',
        });
        this.scoreText.setDepth(10);
        this.scoreText.setScrollFactor(0);
    }

    createEnemiesRemainingText() {

        this.enemiesText = this.scene.add.text(200, 200, 'Enemies: 0', {
            fontSize: '16px',
            fill: '#fff',
        });
        this.enemiesText.setDepth(10);
        this.enemiesText.setScrollFactor(0);
    }

    createWinText() {
        const { width, height } = this.scene.cameras.main;
        console.log(width, height );
        this.winText = this.scene.add.text(width / 2, height / 2, 'YOU WIN', {
            fontSize: '32px',
            fill: '#fff',
        });
        this.winText.setOrigin(0.5);
        this.winText.setDepth(10);
        this.winText.setScrollFactor(0);
        this.winText.setVisible(false);
        
        this.loseText = this.scene.add.text(width / 2, height / 2, 'YOU LOSE', {
            fontSize: '32px',
            fill: '#fff',
        });
        this.loseText.setOrigin(0.5);
        this.loseText.setDepth(10);
        this.loseText.setScrollFactor(0);
        this.loseText.setVisible(false);
    }



    showLootUI(options) {
        // Pause the game
        this.scene.physics.world.pause();
        this.isPaused = true;

        // Get camera center relative to world position
        const camera = this.scene.cameras.main;
        const centerX = camera.worldView.x + camera.width / 2;
        const centerY = camera.worldView.y + camera.height / 2;

        // Create a UI element
        this.lootText = this.scene.add.text(centerX-125, centerY - 200, 'Choose Your Reward', {
            fontSize: '32px',
            fill: '#fff',
        });
        this.lootText.setOrigin(0.5);
        this.lootText.setDepth(100); // High depth to ensure visibility

        // Store buttons to destroy later
        this.lootButtons = [];

        // Create 3 buttons for each option
        options.forEach((option, i) => {
            const button = this.scene.add.text(centerX-125, centerY -150 + i * 50, option, {
                fontSize: '24px',
                fill: '#0f0',
                backgroundColor: '#222',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setDepth(100) // High depth to ensure visibility
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log(`Player selected loot: ${option}`);
                
                // Emit the selected option
                this.scene.events.emit('loot-chosen', option);

                // Clean up UI
                this.cleanupLootUI();
            });

            this.lootButtons.push(button);
        });
    }

    cleanupLootUI() {
        
        // Destroy loot text
        if (this.lootText) {
            this.lootText.destroy();
            this.lootText = null;
        }
        
        // Destroy buttons
        if (this.lootButtons) {
            this.lootButtons.forEach(btn => {
                if (btn && btn.destroy) {
                    btn.destroy();
                }
            });
            this.lootButtons = [];
        }

        // Resume game
        if (this.scene && this.scene.physics) {
            this.scene.physics.world.resume();
        }
        this.isPaused = false;
    }




    updateHealth(health) {
        if (this.healthText && !this.healthText.scene) {
            console.warn('UIManager: healthText is destroyed, skipping update');
            return;
        }
        if (this.healthText) {
            this.healthText.setText(`Health: ${health}`);
        }
    }

    updateScore(score) {
        // Immediately return if this manager has been destroyed
        if (this.isDestroyed) {
            console.warn(`[${this.managerId}] Manager is destroyed, ignoring score update`);
            return;
        }
        
        // Check if this is the active manager
        if (this.scene?.activeUIManager !== this) {
            console.warn(`[${this.managerId}] Not the active UIManager, skipping score update`);
            return;
        }
        
        if (this.scoreText && !this.scoreText.scene) {
            console.warn(`[${this.managerId}] UIManager: scoreText is destroyed, skipping update`);
            return;
        }
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${score}`);
        }
    }

    updateEnemiesRemaining(enemiesRemaining) {
        if (this.enemiesText && !this.enemiesText.scene) {
            console.warn('UIManager: enemiesText is destroyed, skipping update');
            return;
        }
        if (this.enemiesText) {
            this.enemiesText.setText(`Enemies: ${enemiesRemaining}`);
        }
    }

    showWinText() {
        if (this.winText && this.winText.scene) {
            this.winText.setVisible(true);
        }
    }
    
    showLoseText() {
        if (this.loseText && this.loseText.scene) {
            this.loseText.setVisible(true);
        }
    }

    destroy() {

        if (this.scene && this.scene.events) {
            this.scene.events.off('update-health', this.updateHealth, this);
            this.scene.events.off('update-score', this.updateScore, this);
            this.scene.events.off('update-enemies', this.updateEnemiesRemaining, this);
            this.scene.events.off('player-lose', this.showLoseText, this);
            this.scene.events.off('show-loot', this.showLootUI, this);
        }
        
        // Clean up loot UI if it exists
        this.cleanupLootUI();
        
        // Destroy UI elements
        if (this.healthText) {
            this.healthText.destroy();
            this.healthText = null;
        }
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null;
        }
        if (this.enemiesText) {
            this.enemiesText.destroy();
            this.enemiesText = null;
        }
        if (this.winText) {
            this.winText.destroy();
            this.winText = null;
        }
        if (this.loseText) {
            this.loseText.destroy();
            this.loseText = null;
        }
        
        // Clear scene reference
        this.scene = null;
        
    }
}