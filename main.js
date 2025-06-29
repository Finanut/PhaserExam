import SceneSelect from './scenes/sceneSelect.js';
import BootScene from './scenes/bootScene.js';
import PreloadScene from './scenes/preLoadScene.js';
import Level1 from './scenes/levels/level1.js';
import Level2 from './scenes/levels/level2.js';
import Level3 from './scenes/levels/level3.js';
import GameOverScene from './scenes/gameOverScene.js';

// Create the Phaser game instance
var game = new Phaser.Game({
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        parent: 'game-container',
        width: 980,
        height: 640,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH
    },
    fixedStep: false,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
});

// Create and add scenes to the game
game.scene.add('BootScene', new BootScene());
game.scene.add('PreloadScene', new PreloadScene());
game.scene.add('SceneSelect', new SceneSelect());
game.scene.add('gameOverScene', new GameOverScene());
game.scene.add('Level1', new Level1());
game.scene.add('Level2', new Level2());
game.scene.add('Level3', new Level3());

// Start the initial scene
game.scene.start('BootScene');