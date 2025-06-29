import Projectile from "/entities/projectile.js";
export default class ClusterBomb extends Projectile{

    constructor(scene, x, y, texture, faction){
        super(scene, x, y, texture, faction);
        this.explosionRadius;   
        
    }
    handleCollision(){
        

        const angleStep = (2 * Math.PI) / this.explosionRadius; // Divide 360° into equal parts
        for (let i = 0; i < this.explosionRadius; i++) {
            const angle = i * angleStep;

           
            const direction = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            };

            // Create a new projectile (you can use the ProjectileManager or directly create it)
            const newProjectile = this.scene.projectileManager.createProjectile(this.x, this.y, direction, 'fireball', this.faction);

        }

        
    }

}