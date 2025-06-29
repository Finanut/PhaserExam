import BaseEntity from  "/entities/baseEntity.js"

export default class Enemy extends BaseEntity{ // example enemy ra

    constructor(scene, x, y, texture){
         super(scene, x, y, texture);
        this.maxHealth = 25;
        this.health = this.maxHealth;
        this.speed = 200;
        this.damage = 10; // Ensure this is set

        this.setScale(1);
        this.body.setCircle(12);
   

        this.state;
    }


    chase(player){
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) { // Don't jitter when close
        this.setVelocity((dx / dist) * this.speed, (dy / dist) * this.speed);
    } else {
        this.setVelocity(0, 0);
    }
    }
    die() {
        // Check if this enemy's scene is still active before emitting events
        if (!this.scene || !this.scene.scene || !this.scene.scene.isActive()) {
            console.log('Enemy from inactive scene died, not emitting events');
            this.isAlive = false;
            this.destroy();
            return;
        }
        
        console.log('Enemy died, emitting reward-drop and enemy-death events'); // Debug log
        
        // Emit audio event for enemy death
        this.scene.events.emit('enemy-death');
        
        // Emit reward drop events
        this.scene.events.emit('reward-drop', { x: this.x, y: this.y, type: 'exp-orb' });
        if (Math.random() < 0.5) {
            this.scene.events.emit('reward-drop', { x: this.x, y: this.y, type: 'chest' });
        }
        
        this.isAlive = false;
        this.emit('entity-died', this);
        this.destroy();
    }

    update(time, delta, player){
    this.chase(player);

}
}

