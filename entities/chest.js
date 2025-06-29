export default class Chest extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, value) {
        super(scene, x, y, texture);

        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.value = value; // The value of the reward (e.g., coins or items)
        this.setScale(1); // Adjust size if needed
        this.body.setSize(32, 32); // Adjust hitbox size
    }

    collect(player) {
        // Emit audio event for chest collection
        this.scene.events.emit('chest-collected');
        // Emit an event for inventory/reward tracking (optional)
        this.destroy(); // Remove the chest from the scene
    }
}