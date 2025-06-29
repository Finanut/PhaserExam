export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOverScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Display "Game Over" text
        this.add.text(width / 2, height / 2, 'Game Over', {
            fontSize: '48px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Add restart button
        const restartButton = this.add.text(width / 2, height / 2 + 100, 'Restart Game', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            console.log('Restart button clicked - manually restarting Level1');
            
            // Manual scene transition - you can customize this as needed
            this.scene.start('Level1');
        });
    }
}