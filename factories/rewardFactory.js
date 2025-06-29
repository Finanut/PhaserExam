import EXPOrb from '/entities/expOrb.js';
import Chest from '/entities/chest.js'; // Assuming you have a Chest class

export default class RewardFactory {
    static createReward(scene, x, y, type = 'exp-orb') {
        let texture, value;

        switch (type) {
            case 'exp-orb':
                texture = 'expOrbTexture'; // Replace with your texture key
                value = 10; // Example value for exp
                return new EXPOrb(scene, x, y, texture, value);

            case 'chest':
                texture = 'chestTexture'; // Replace with your texture key
                value = 50; // Example value for chest
                return new Chest(scene, x, y, texture, value);

            default:
                console.error(`Unknown reward type: ${type}`);
                return null;
        }
    }
}