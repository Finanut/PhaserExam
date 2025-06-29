// BootScene.js - Fixed version

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        console.log('BootScene created');
        
        // Continue with your boot scene logic
        // For example, start the preload scene
        this.scene.start('PreloadScene');
    }
}