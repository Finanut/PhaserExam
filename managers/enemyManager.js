import Enemy from "/entities/enemy.js";
export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = this.scene.physics.add.group();
        this.enemyLimit = 1;
        this.currentEnemyTexture = 'enemy'; // Store current enemy texture for respawning
    }

    spawnEnemy(x, y, texture = 'enemy') {
        // Store the texture for future respawning
        this.currentEnemyTexture = texture;
        
        // You should have an Enemy class; using Phaser.Sprite as placeholder
        const enemy = new Enemy(this.scene, x, y, texture);
        enemy.isEnemy = true; // For collision logic
        this.enemies.add(enemy);
        //console.log(enemy.damage);
        return enemy;
    }

    setupCollisions(targetGroups) {
    targetGroups.forEach(group => {
        this.scene.physics.add.collider(
            this.enemies,  // Enemies group
            group,         // Obstacles or walls
        );
    });

    this.scene.physics.add.collider(
        this.enemies, 
        this.enemies 
    );

    this.scene.physics.add.collider(
    this.enemies,
    this.scene.player,
    this.handlePlayerCollision,
    null,
    this
);
}


    update(time, delta, player) {
        // Update all enemies (AI, movement, etc.)
        this.enemies.children.iterate(enemy => {
            if (enemy && enemy.active) {
                enemy.update(time, delta, player); // If you have an Enemy class with update
            }
        });


        if (this.enemyLimit >= this.enemies.countActive(true)) {
            // Spawn enemies at random positions until the limit is reached
            const toSpawn = this.enemyLimit - this.enemies.countActive(true);
            for (let i = 0; i < toSpawn; i++) {
                const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
                const y = Phaser.Math.Between(50, this.scene.scale.height - 50);
                // Use the stored texture for respawning
                this.spawnEnemy(x, y, this.currentEnemyTexture);
            }
        }
    }

    getEnemies() {
        return this.enemies;
    }

    handlePlayerCollision(player, enemy) {
    if (enemy.damage === undefined) {
        console.error('Enemy does not have a damage property!');
        return;
    }
    this.scene.player.takeDamage(enemy.damage);
    this.scene.events.emit('update-health', this.scene.player.health);
}

    destroy() {
        console.log('EnemyManager cleanup started');
        
        // Destroy all enemies
        if (this.enemies) {
            this.enemies.clear(true, true); // Remove and destroy all children
        }
        
        // Clear references
        this.enemies = null;
        this.scene = null;
        
        console.log('EnemyManager cleanup completed');
    }
}