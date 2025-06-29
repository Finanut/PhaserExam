export default class BaseEntity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.maxHealth;
        this.health;
        this.isAlive = true;
    }
    
    takeDamage(amount) {
        this.health -= amount; 
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isAlive = false;
        this.emit('entity-died', this);
        this.destroy();
    }
}