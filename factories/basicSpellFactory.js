import ClusterBomb from '../entities/clusterBomb.js';
import Projectile from '/entities/projectile.js';

export default class SpellFactory {
    static createSpell(scene, x, y, direction, spellType, faction) {
        let projectile;

        switch (spellType) {
            case 'fireball':
                projectile = new Projectile(scene, x, y, 'fireball', faction);
                projectile.damage = 20;
                projectile.speed = 400;
                projectile.aoe = 0;
                break;

            case 'ice-shard':
                projectile = new Projectile(scene, x, y, 'iceShardTexture', faction);
                projectile.damage = 10;
                projectile.speed = 300;
                break;

            case 'lightning-bolt':
                projectile = new Projectile(scene, x, y, 'lightningTexture', faction);
                projectile.damage = 30;
                projectile.speed = 500;
                break;
            
            case 'cluster-bomb':
                projectile = new ClusterBomb(scene, x, y, 'fireball', faction);
                projectile.damage = 30;
                projectile.speed = 500;
                projectile.explosionRadius = 8;
                break;

            case 'tornado':
                projectile = new Projectile(scene, x, y, 'tornadoTexture', faction);
                projectile.damage = 15;
                projectile.speed = 350;
                break;

            default:
                console.error(`Unknown spell type: ${spellType}`);
                return null;
        }

        return projectile;
    }
}