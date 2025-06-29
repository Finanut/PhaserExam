export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Load assets here
        console.log('PreLoadScene is loading assets');
        this.load.image('loading', 'assets/img/matlo.jpg');
        
        // Load audio files (with error handling for missing files)
        this.load.on('loaderror', (file) => {
            console.log(`Audio file not found: ${file.key} - will use fallback beep sounds`);
        });
        
        // Try to load audio files - these are optional and will use beeps if missing
        this.load.audio('backgroundMusic', ['assets/audio/background-music.mp3', 'assets/audio/background-music.ogg']);
        this.load.audio('spellCast', ['assets/audio/spell-cast.mp3', 'assets/audio/spell-cast.wav']);
        this.load.audio('orbCollect', ['assets/audio/orb-collect.mp3', 'assets/audio/orb-collect.wav']);
        this.load.audio('chestCollect', ['assets/audio/chest-collect.mp3', 'assets/audio/chest-collect.wav']);
        this.load.audio('playerDeath', ['assets/audio/player-death.mp3', 'assets/audio/player-death.wav']);
        this.load.audio('enemyDeath', ['assets/audio/enemy-death.mp3', 'assets/audio/enemy-death.wav']);
    }
    create() {
        // Display loading image
        this.add.image(400, 300, 'loading');

        // Start the PreloadScene after a short delay
        console.log('PreLoadScene complete, starting SceneSelect');
        this.scene.start('SceneSelect');
    }
    update() {
        // Update logic here if needed
    }
}