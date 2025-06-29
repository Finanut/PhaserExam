import BaseLevel from './baseLevel.js';

export default class Level2 extends BaseLevel {
    constructor() {
        super({ key: 'Level2' });
    }

    loadLevelAssets() {
        // Load Level 2 specific assets
        this.load.image('level2_tiles', 'assets/img/placeholder_tilemap.png');
        this.load.tilemapTiledJSON('level2_tilemap', 'assets/map2.tmj');
        this.load.image('level2_enemy', 'assets/img/witch.png'); // Unique key for Level 2
    }

    getMapConfig() {
        return {
            key: 'level2_tilemap', // Different map for level 2
            tileWidth: 32,
            tileHeight: 32,
            tilesetName: 'TestTileset',
            tilesetImage: 'level2_tiles'
        };
    }

    getPlayerSpawnPoint() {
        return { x: 150, y: 150 }; // Different spawn point
    }

    spawnEnemies() {
        // Level 2 enemy spawning - more enemies than level 1
        this.enemyManager.enemyLimit = 3; // Set limit to 3 enemies
        this.enemyManager.spawnEnemy(300, 300, 'level2_enemy');
        this.enemyManager.spawnEnemy(500, 200, 'level2_enemy');
        this.enemyManager.spawnEnemy(200, 500, 'level2_enemy');
    }

    getNextLevel() {
        return 'Level3'; // Level 2 progresses to Level 3
    }

    getScoreTarget() {
        return 100; // Standard score target
    }

    getLevelInfo() {
        return {
            name: 'Level 2: The Witches',
            description: 'Defeat all 3 witches OR reach 100 points!'
        };
    }

    update(time, delta) {
        super.update(time, delta);
        // Check if level is complete
        this.checkLevelCompletion();
    }
}
