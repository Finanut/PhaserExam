import Player from '/entities/player.js';
import ProjectileManager from '/managers/projectileManager.js';
import EnemyManager from '/managers/enemyManager.js';
import UIManager from '/managers/UIManager.js';
import RewardManager from '/managers/rewardsManager.js';
import AudioManager from '/managers/audioManager.js';

export default class BaseLevel extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    preload() {
        // Load common assets that all levels use
        this.load.image('player', 'assets/img/player.png');
        this.load.image('projectile', 'assets/img/matlo.jpg');
        this.load.image('fireball', 'assets/img/fireball2.png');
        
        // Load audio files with error handling for missing files
        this.load.on('loaderror', (file) => {
            console.log(`Audio file not found: ${file.key} - will use fallback beep sounds`);
        });
        
        // Try to load audio files - these are optional and will use beeps if missing
        this.load.audio('backgroundMusic', ['assets/audio/background-music.mp3']);
        this.load.audio('spellCast', ['assets/audio/spell-cast.mp3']);
        this.load.audio('orbCollect', ['assets/audio/orb-collect.mp3']);
        this.load.audio('chestCollect', ['assets/audio/chest-collect.mp3']);
        this.load.audio('playerDeath', ['assets/audio/player-death.mp3']);
        this.load.audio('enemyDeath', ['assets/audio/enemy-death.mp3']);
        
        // Load level-specific assets (to be overridden by child classes)
        this.loadLevelAssets();
    }

    create() {
        console.log(`[${this.scene.key}] create() called - initializing scene`);
        console.log(`[${this.scene.key}] Expected score target: ${this.getScoreTarget()}`);

        // Initialize level completion flag
        this.levelCompleted = false;

        // Immediately clear any existing manager references
        this.activeRewardManager = null;
        this.activeUIManager = null;

        // Initialize player
        const playerSpawn = this.getPlayerSpawnPoint();
        this.player = new Player(this, playerSpawn.x, playerSpawn.y, 'player', 'Player1');
        
        // Reset player score for new level
        this.player.score = 0;
        console.log(`[${this.scene.key}] Player score reset to 0`);
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Initialize managers
        this.audioManager = new AudioManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.enemyManager = new EnemyManager(this);
        this.UIManager = new UIManager(this);
        this.rewardManager = new RewardManager(this);

        // Setup tilemap
        this.setupTilemap();

        // Set up the camera
        this.setupCamera();

        // Setup event listeners
        this.setupEventListeners();

        // Setup collisions
        this.setupCollisions();

        // Display level-specific UI
        this.displayLevelInfo();

        // Spawn enemies (level-specific)
        this.spawnEnemies();
    }

    setupTilemap() {
        const mapConfig = this.getMapConfig();
        const map = this.make.tilemap({ 
            key: mapConfig.key, 
            tileWidth: mapConfig.tileWidth || 32, 
            tileHeight: mapConfig.tileHeight || 32 
        });
        
        const tileset = map.addTilesetImage(mapConfig.tilesetName, mapConfig.tilesetImage);
        
        // Create layers
        this.floorLevel = map.createLayer('floorLevel', tileset, 0, 0);
        this.playerLevel = map.createLayer('playerLevel', tileset, 0, 0);
        this.abovePlayerLevel = map.createLayer('abovePlayerLevel', tileset, 0, 0);
        this.worldBarrier = map.createLayer('worldBarrier', tileset, 0, 0);
        
        // Set depths
        this.playerLevel.setDepth(0);
        this.abovePlayerLevel.setDepth(2);
        this.player.setDepth(1);

        // Set collision for layers
        this.playerLevel.setCollision([14, 31]);
        this.floorLevel.setCollision(1);
        this.worldBarrier.setCollision(1);
        
        // Store map reference for camera bounds
        this.map = map;
    }

    setupCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
        this.cameras.main.setZoom(1.5);
    }

    setupEventListeners() {
        // Player spell casting
        this.player.on('cast-basic', this.handleCastSpell, this);
        
        // Manual scene transition when player dies
        this.events.once('player-lose', () => {
            console.log('Player died - transitioning to Game Over scene');
            this.scene.start('gameOverScene');
        });
        
        // Add input handler for mouse clicks
        this.input.on('pointerdown', () => {
            this.player.castBasicSpell();
        });
    }

    setupCollisions() {
        // Add collision between the player and layers
        this.physics.add.collider(this.player, this.playerLevel);
        this.physics.add.collider(this.player, this.worldBarrier);
        this.physics.add.collider(this.player, this.floorLevel);

        // Setup projectile collisions
        this.projectileManager.setupFriendlyCollisions([
            this.playerLevel, 
            this.worldBarrier,  
            this.enemyManager.enemies
        ]);
        
        // Setup enemy collisions
        this.enemyManager.setupCollisions([this.playerLevel, this.worldBarrier, this.floorLevel]);
    }

    handleCastSpell(data) {
        // Extract properties and pass as individual parameters
        this.projectileManager.createProjectile(
            data.x,
            data.y,
            data.direction,
            data.spellType,
            data.faction
        );
        
        // Emit spell cast event for audio
        this.events.emit('spell-cast', data);
    }

    displayLevelInfo() {
        const levelInfo = this.getLevelInfo();
        const scoreTarget = this.getScoreTarget();
        
        // Level info that fades out
        const levelText = this.add.text(20, 20, `${levelInfo.name}\n${levelInfo.description}\nScore Target: ${scoreTarget}`, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0); // Keep UI fixed to camera
        
        // Permanent level indicator (doesn't fade out)
        this.levelIndicator = this.add.text(20, 120, `Current: ${levelInfo.name}`, {
            fontSize: '14px',
            fill: '#ffff00',
            backgroundColor: '#000',
            padding: { x: 5, y: 3 }
        }).setScrollFactor(0);
        
        // Fade out the level info after 4 seconds (longer to read score target)
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: levelText,
                alpha: 0,
                duration: 1000,
                onComplete: () => levelText.destroy()
            });
        });
    }

    update(time, delta) {
        // Don't update if level is completed
        if (this.levelCompleted) {
            return;
        }
        
        this.player.move(this.cursorKeys, delta);
        this.player.update(time, delta);
        this.enemyManager.update(time, delta, this.player);
    }

    shutdown() {
        console.log(`${this.scene.key} shutdown - cleaning up`);
        
        // First, stop checking for level completion
        this.levelCompleted = true;
        
        // Remove ALL event listeners from scene events
        if (this.events) {
            console.log('Removing all scene event listeners');
            this.events.removeAllListeners();
            this.events.destroy();
            this.events = new Phaser.Events.EventEmitter();
        }
        
        // Clean up player event listeners
        if (this.player) {
            this.player.off('cast-basic', this.handleCastSpell, this);
        }
        
        // Clean up managers in the correct order with aggressive cleanup
        if (this.audioManager) {
            console.log('Destroying audio manager');
            this.audioManager.destroy();
            this.audioManager = null;
        }
        
        if (this.rewardManager) {
            console.log('Destroying reward manager');
            this.rewardManager.destroy();
            this.rewardManager = null;
        }
        
        if (this.projectileManager) {
            console.log('Destroying projectile manager');
            if (this.projectileManager.destroy) {
                this.projectileManager.destroy();
            }
            this.projectileManager = null;
        }
        
        if (this.enemyManager) {
            console.log('Destroying enemy manager');
            if (this.enemyManager.destroy) {
                this.enemyManager.destroy();
            }
            this.enemyManager = null;
        }
        
        if (this.UIManager) {
            console.log('Destroying UI manager');
            if (this.UIManager.destroy) {
                this.UIManager.destroy();
            }
            this.UIManager = null;
        }
        
        // Remove ALL input listeners
        if (this.input) {
            this.input.removeAllListeners();
        }
        
        // Clear player reference
        if (this.player) {
            this.player = null;
        }
        
        console.log(`${this.scene.key} shutdown completed`);
    }

    // Level progression methods
    completeLevel() {
        console.log(`[${this.scene.key}] completeLevel() called`);
        this.levelCompleted = true; // Ensure completion flag is set
        
        const nextLevel = this.getNextLevel();
        console.log(`[${this.scene.key}] Next level should be: ${nextLevel}`);
        
        if (nextLevel) {
            console.log(`[${this.scene.key}] Progressing to ${nextLevel}`);
            // Small delay to ensure cleanup completes
            setTimeout(() => {
                console.log(`[${this.scene.key}] Actually stopping scene and starting ${nextLevel}`);
                this.scene.stop();
                this.scene.start(nextLevel);
            }, 100);
        } else {
            console.log(`[${this.scene.key}] All levels completed! Returning to scene select.`);
            // Small delay to ensure cleanup completes
            setTimeout(() => {
                console.log(`[${this.scene.key}] Actually stopping scene and returning to SceneSelect`);
                this.scene.stop();
                this.scene.start('SceneSelect');
            }, 100);
        }
    }

    getNextLevel() {
        // Override this method in child classes to define level progression
        return null;
    }

    getLevelInfo() {
        // Override this method in child classes to provide level-specific info
        return {
            name: 'Unknown Level',
            description: 'No description available'
        };
    }

    checkLevelCompletion() {
        // Prevent multiple completions
        if (this.levelCompleted) {
            return;
        }
        
        // Check multiple win conditions
        const allEnemiesDefeated = this.enemyManager && this.enemyManager.enemies.children.size === 0;
        const scoreTarget = this.getScoreTarget();
        const currentScore = this.player ? this.player.score : 0;
        const scoreReached = currentScore >= scoreTarget;

        // Debug logging
        if (currentScore > 0) {
            console.log(`[${this.scene.key}] Score check: ${currentScore}/${scoreTarget}, Target reached: ${scoreReached}`);
        }

        if (allEnemiesDefeated) {
            console.log(`[${this.scene.key}] All enemies defeated! Level complete!`);
            this.levelCompleted = true; // Mark as completed immediately
            this.showCompletionMessage('All Enemies Defeated!');
            setTimeout(() => {
                this.completeLevel();
            }, 2000); // Wait 2 seconds before progressing
        } else if (scoreReached) {
            console.log(`[${this.scene.key}] Score target of ${scoreTarget} reached! Level complete!`);
            this.levelCompleted = true; // Mark as completed immediately
            this.showCompletionMessage(`Score Target Reached! (${currentScore}/${scoreTarget})`);
            setTimeout(() => {
                this.completeLevel();
            }, 2000); // Wait 2 seconds before progressing
        }
    }

    showCompletionMessage(message) {
        const { width, height } = this.cameras.main;
        
        const completionText = this.add.text(width / 2, height / 2, `Level Complete!\n${message}`, {
            fontSize: '24px',
            fill: '#ffff00',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Make it flash for attention
        this.tweens.add({
            targets: completionText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: 3
        });
    }

    getScoreTarget() {
        // Override this method in child classes to set score target for level completion
        return 100; // Default score target
    }

    // Abstract methods to be implemented by child classes
    loadLevelAssets() {
        // Override this method in child classes to load level-specific assets
        throw new Error('loadLevelAssets() must be implemented by child class');
    }

    getMapConfig() {
        // Override this method in child classes to return map configuration
        throw new Error('getMapConfig() must be implemented by child class');
    }

    getPlayerSpawnPoint() {
        // Override this method in child classes to return player spawn coordinates
        throw new Error('getPlayerSpawnPoint() must be implemented by child class');
    }

    spawnEnemies() {
        // Override this method in child classes to spawn level-specific enemies
        throw new Error('spawnEnemies() must be implemented by child class');
    }
}
