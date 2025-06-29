export default class SceneSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneSelect' });
    }

    preload() {
        // Load assets here
        this.load.image('buttons', 'assets/img/matlo.jpg');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Title
        this.add.text(width / 2, 100, 'Select Level', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        let tint = 0x44ff44;

        // Level 1 Button
        const btn_level1 = this.add.image(width / 2, 200, 'buttons').setInteractive();
        btn_level1.setScale(0.2);
        btn_level1.on('pointerdown', () => this.scene.start('Level1'));
        btn_level1.on('pointerover', () => btn_level1.setTint(tint));
        btn_level1.on('pointerout', () => btn_level1.clearTint());
        
        this.add.text(width / 2, 200, 'Level 1', {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);
        
        // Level 2 Button
        const btn_level2 = this.add.image(width / 2, 300, 'buttons').setInteractive();
        btn_level2.setScale(0.2);
        btn_level2.on('pointerdown', () => this.scene.start('Level2'));
        btn_level2.on('pointerover', () => btn_level2.setTint(tint));
        btn_level2.on('pointerout', () => btn_level2.clearTint());

        this.add.text(width / 2, 300, 'Level 2', {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        // Level 3 Button
        const btn_level3 = this.add.image(width / 2, 400, 'buttons').setInteractive();
        btn_level3.setScale(0.2);
        btn_level3.on('pointerdown', () => this.scene.start('Level3'));
        btn_level3.on('pointerover', () => btn_level3.setTint(tint));
        btn_level3.on('pointerout', () => btn_level3.clearTint());

        this.add.text(width / 2, 400, 'Level 3', {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);
    }

    update(time, delta) {
        // Update logic here
    }
}