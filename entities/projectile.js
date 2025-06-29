export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, faction) {
    super(scene, x, y, texture);
    
    // Add the projectile to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set properties
    this.speed = 500;
    this.damage = 10;
    this.faction = faction;
    this.aoe = 0;
    this.setCollideWorldBounds(true);

    
    this.setCenteredCircleBody(24);
    this.setScale(0.5);
  }

  // handleCollision(){
  //   this.setCenteredCircleBody(256);
  //   this.setVelocity(0)
  //   this.scene.time.delayedCall(100, () => this.destroy())
  // }



  setCenteredCircleBody(radius) {
    if (!this.body) return;
    
    const offsetX = this.width / 2 - radius;
    const offsetY = this.height / 2 - radius;
    
    this.body.setCircle(radius, offsetX, offsetY);
    
  }
  destroyProjectile(){
    this.destroy();
  }
  handleCollision(){

  }


}



