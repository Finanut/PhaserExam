import BaseLevel from './baseLevel.js';

export default class Level3 extends BaseLevel {
    constructor() {
        super({ key: 'Level3' });
    }

    loadLevelAssets() {
        // Load Level 3 specific assets
        this.load.image('level3_tiles', 'assets/img/placeholder_tilemap.png');
        this.load.tilemapTiledJSON('level3_tilemap', 'assets/map3.tmj');
        this.load.image('level3_enemy', 'assets/img/gord.png'); // Unique key for Level 3
    }

    getMapConfig() {
        return {
            key: 'level3_tilemap', // Different map for level 3
            tileWidth: 32,
            tileHeight: 32,
            tilesetName: 'TestTileset',
            tilesetImage: 'level3_tiles'
        };
    }

    getPlayerSpawnPoint() {
        return { x: 100, y: 100 }; // Different spawn point
    }

    spawnEnemies() {
        // Level 3 enemy spawning - even more enemies than level 2
        this.enemyManager.enemyLimit = 5; // Set limit to 5 enemies
        this.enemyManager.spawnEnemy(250, 250, 'level3_enemy');
        this.enemyManager.spawnEnemy(450, 150, 'level3_enemy');
        this.enemyManager.spawnEnemy(150, 450, 'level3_enemy');
        this.enemyManager.spawnEnemy(350, 400, 'level3_enemy');
        this.enemyManager.spawnEnemy(500, 500, 'level3_enemy');
    }

    getNextLevel() {
        return null; // Level 3 is the final level
    }

    getScoreTarget() {
        return 150; // Higher score target for final level
    }

    getLevelInfo() {
        return {
            name: 'Level 3: Final Challenge',
            description: 'Defeat all 5 enemies OR reach 150 points to win!'
        };
    }

    update(time, delta) {
        super.update(time, delta);
        // Check if level is complete
        this.checkLevelCompletion();
    }
}
