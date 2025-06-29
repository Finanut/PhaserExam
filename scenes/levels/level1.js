import BaseLevel from './baseLevel.js';

export default class Level1 extends BaseLevel {
    constructor() {
        super({ key: 'Level1' });
    }

    loadLevelAssets() {
        // Load Level 1 specific assets
        this.load.image('level1_tiles', 'assets/img/placeholder_tilemap.png');
        this.load.tilemapTiledJSON('level1_tilemap', 'assets/map1.tmj');
        this.load.image('level1_enemy', 'assets/img/goblin.png'); // Unique key for Level 1
    }

    getMapConfig() {
        return {
            key: 'level1_tilemap',
            tileWidth: 32,
            tileHeight: 32,
            tilesetName: 'TestTileset',
            tilesetImage: 'level1_tiles'
        };
    }

    getPlayerSpawnPoint() {
        return { x: 200, y: 200 };
    }

    spawnEnemies() {
        // Level 1 enemy spawning - single enemy for easy start
        this.enemyManager.enemyLimit = 1; // Set limit to 1 enemy
        this.enemyManager.spawnEnemy(400, 400, 'level1_enemy');
    }

    getNextLevel() {
        return 'Level2'; // Level 1 progresses to Level 2
    }

    getScoreTarget() {
        return 50; // Lower score target for first level
    }

    getLevelInfo() {
        return {
            name: 'Level 1: The Beginning',
            description: 'Defeat the goblin OR reach 50 points to progress!'
        };
    }

    update(time, delta) {
        super.update(time, delta);
        // Check if level is complete
        this.checkLevelCompletion();
    }
}