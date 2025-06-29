import Projectile from "/entities/projectile.js";
import BaseEntity from "/entities/baseEntity.js";
import SpellFactory from "/factories/basicSpellFactory.js";
export default class ProjectileManager{

    constructor(scene){
        this.scene = scene;
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        
    }


    createProjectile(x, y, direction, projectileType, faction){
        let projectile = SpellFactory.createSpell(this.scene, x, y, direction, projectileType, faction );
        projectile.faction = faction

         // Calculate angle from direction vector
        const angle = Math.atan2(direction.y, direction.x);
        
        // Set velocity and rotation on the projectile (not on this manager)
        projectile.setVelocityX(Math.cos(angle) * projectile.speed);
        projectile.setVelocityY(Math.sin(angle) * projectile.speed);
        projectile.setRotation(angle + Math.PI/2);
    
        if (projectile.faction == 'player')
            this.playerProjectiles.push(projectile);
        else if (projectile.faction == 'enemy')
            this.enemyProjectiles.push(projectile)
        
        this.scene.time.delayedCall(2000, () => {
            this.destroyProjectile(projectile)
            });

        
    }



    setupFriendlyCollisions(targetGroups){
        targetGroups.forEach(group => {
            this.scene.physics.add.collider(
                this.playerProjectiles,  
                group,
                this.handleCollision,
                null,
                this

        );
    })
    }
    setupEnemyCollisions(targetGroups){
        targetGroups.forEach(group => {
            this.scene.physics.add.collider(
                this.enemyProjectiles,  
                group,
                this.handleCollision,
                null,
                this

        );
    })
    }
    handleCollision(projectile, target){
        projectile.handleCollision();
        if (projectile.aoe != 0){
            projectile.setCenteredCircleBody(256);
}           this.scene.physics.overlap(
            projectile, // The projectile with the expanded hitbox
            this.scene.enemyManager.getEnemies(), // Group of enemies
            (aoeProjectile, aoeTarget) => {
                if (aoeTarget !== target) { // Avoid reprocessing the original target
                    aoeTarget.takeDamage(aoeProjectile.damage);
                }
            }
        );

        if (projectile.faction == 'player'){
            if (target instanceof BaseEntity){
                target.takeDamage(projectile.damage)
            }


            const index = this.playerProjectiles.indexOf(projectile);
            if(index > -1){
            this.playerProjectiles.splice(index, 1);
        }}
        else if (projectile.faction == 'enemy'){
            const index = this.playerProjectiles.indexOf(projectile);
            if(index > -1){
            this.enemyProjectiles.splice(index, 1);
        }}
        projectile.destroyProjectile();
    }
        
        






    destroyProjectile(projectile){
        if (projectile && projectile.active){
            projectile.setActive(false);
            projectile.setVisible(false);
            projectile.body.enable = false;   
            projectile.destroy();
        }
        
        
    }  

    destroy() {
        console.log('ProjectileManager cleanup started');
        
        // Destroy all active projectiles
        this.playerProjectiles.forEach(projectile => {
            if (projectile && projectile.destroy) {
                projectile.destroy();
            }
        });
        
        this.enemyProjectiles.forEach(projectile => {
            if (projectile && projectile.destroy) {
                projectile.destroy();
            }
        });
        
        // Clear arrays
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        
        // Clear scene reference
        this.scene = null;
        
        console.log('ProjectileManager cleanup completed');
    }
}
