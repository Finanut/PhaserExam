export default class EXPOrb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, value) {
        super(scene, x, y, texture);

        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.value = value; // The value of the reward (e.g., exp points)
        this.setScale(0.5); // Adjust size if needed
        this.body.setCircle(10); // Circular hitbox
        this.body.setOffset(5, 5); // Center the circle
        this.attractionRadius = 100; // Distance within which the orb moves toward the player
        this.speed = 100; // Speed at which the orb moves toward the player

                
    }

    collect(player) {
        // Emit audio event for orb collection
        this.scene.events.emit('orb-collected');
        // Emit an event for score/reward tracking
        this.scene.events.emit('reward-collected', this.value);
        this.destroy(); // Remove the reward from the scene
    }

    update() {
    const player = this.scene.player; // Get player from scene
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.attractionRadius) {
        const angle = Math.atan2(dy, dx);
        this.body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    } else {
        this.body.setVelocity(0, 0);
    }
    //console.log(`Orb position: (${this.x}, ${this.y})`); // Debug log
}
}