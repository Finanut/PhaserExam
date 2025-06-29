import EXPOrb from '../entities/expOrb.js';
import RewardFactory from '/factories/rewardFactory.js';

export default class RewardManager {
    constructor(scene) {
        console.log('RewardManager constructor called for scene:', scene.scene.key);
        this.scene = scene;
        this.managerId = `RewardManager_${Date.now()}_${Math.random()}`;
        this.isDestroyed = false;

        // Separate groups for orbs and chests
        this.orbs = this.scene.physics.add.group({ runChildUpdate: true }); // Group for exp orbs
        this.chests = this.scene.physics.add.group({ runChildUpdate: true }); // Group for chests

        // Add collision between player and rewards
        this.scene.physics.add.overlap(
            this.scene.player,
            this.orbs,
            this.collectOrb,
            null,
            this
        );

        this.scene.physics.add.overlap(
            this.scene.player,
            this.chests,
            this.collectChest,
            null,
            this
        );

        // Listen for reward-related events
        this.scene.events.on('reward-drop', this.spawnReward, this);
        this.scene.events.on('reward-collected', this.handleOrbCollected, this);
        this.scene.events.on('chest-collected', this.handleChestCollected,this);
        
        console.log('RewardManager initialization complete');
    }

    spawnReward({ x, y, type = 'exp-orb' }) {
        // Defensive check - ensure manager is not destroyed and groups exist
        if (this.isDestroyed || !this.orbs || !this.chests) {
            console.warn(`[${this.managerId}] Cannot spawn reward - manager destroyed or groups missing`);
            return;
        }
        
        try {
            const reward = RewardFactory.createReward(this.scene, x, y, type);
            
            if (!reward) {
                console.error(`[${this.managerId}] Failed to create reward of type: ${type}`);
                return;
            }
            
            if (reward instanceof EXPOrb) {
                if (this.orbs && this.orbs.add) {
                    this.orbs.add(reward); // Add to orbs group
                } else {
                    console.error(`[${this.managerId}] Orbs group is invalid:`, this.orbs);
                }
            } else {
                if (this.chests && this.chests.add) {
                    this.chests.add(reward); // Add to chests group
                } else {
                    console.error(`[${this.managerId}] Chests group is invalid:`, this.chests);
                }
            }
        } catch (error) {
            console.error(`[${this.managerId}] Error spawning reward:`, error);
        }
    }

    collectOrb(player, orb) {
       
        orb.collect(player); // Call the collect method on the orb
    }

    collectChest(player, chest) {
        console.log('Player collected a chest:', chest); // Debug log
        chest.collect(player); // Call the collect method on the chest
    }

    handleOrbCollected(value) {
        this.scene.player.score += value; 
        
        // Only emit if scene events still exist
        if (this.scene.events) {
            this.scene.events.emit('update-score', this.scene.player.score);
        }
    }
    
    handleChestCollected() {
        const possibleRewards = ['heal', 'cluster', 'maxHP']; // Hardcoded for now
        const pickedRewards = [];

        // Randomly pick 3 rewards
        while (pickedRewards.length < 3 && possibleRewards.length > 0) {
            const idx = Math.floor(Math.random() * possibleRewards.length);
            pickedRewards.push(possibleRewards.splice(idx, 1)[0]);
        }

        // Emit the 'show-loot' event with the picked rewards
        if (this.scene.events) {
            this.scene.events.emit('show-loot', pickedRewards);
        }

        // Listen for the player's choice
        this.scene.events.once('loot-chosen', (chosenReward) => {
            switch (chosenReward) {
                case 'heal':
                    this.scene.player.heal(100); // Heal the player
                    if (this.scene.events) {
                        this.scene.events.emit('update-health', this.scene.player.health);
                    }
                    break;
                case 'cluster':
                    this.scene.player.changeBasicWeapon('cluster-bomb'); // Example: Add a cluster bomb ability
                    break;
                case 'maxHP':
                    this.scene.player.maxHealth += 10; // Increase max health
                    this.scene.player.heal(10);
                    if (this.scene.events) {
                        this.scene.events.emit('update-health', this.scene.player.health);
                    }
                    break;
                default:
                    console.error(`Unknown reward: ${chosenReward}`);
            }
        });
    }

    destroy() {
        console.log(`[${this.managerId}] RewardManager cleanup started`);
        
        // Immediately mark this manager as destroyed
        this.isDestroyed = true;
        
        // Clear the active manager reference if this is the active one
        if (this.scene && this.scene.activeRewardManager === this) {
            console.log(`[${this.managerId}] Clearing active manager reference`);
            this.scene.activeRewardManager = null;
        }
        
        // Remove event listeners
        if (this.scene && this.scene.events) {
            this.scene.events.off('reward-drop', this.spawnReward, this);
            this.scene.events.off('reward-collected', this.handleOrbCollected, this);
            this.scene.events.off('chest-collected', this.handleChestCollected, this);
        }
        
        // Clear groups
        if (this.orbs) {
            this.orbs.clear(true, true); // Remove and destroy all children
        }
        if (this.chests) {
            this.chests.clear(true, true); // Remove and destroy all children
        }
        
        this.orbs = null;
        this.chests = null;
        this.scene = null;
        
        console.log(`[${this.managerId}] RewardManager cleanup completed`);
    }
}