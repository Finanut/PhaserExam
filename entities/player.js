import BaseEntity from "/entities/baseEntity.js"

export default class Player extends BaseEntity{
    constructor(scene, x, y, texture, name){
    super(scene, x, y, texture);
    // Player-specific properties
        this.name = name;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 500; // Movement speed
        this.spells = [];
        this.score = 0;
        this.faction = 'player';
        
        // Adjust hitbox
        this.setScale(0.5);
        this.body.setCircle(24); // Circular hitbox
        this.body.setOffset(8, 40); // Offset to center the circle

        this.basicSpellSlot = {
            spellType: 'fireball',
            cooldown: 0,
            maxCooldown: 500 // Increased from 50 to 500ms for reasonable cooldown
        };

        this.skillSpellSlot = {
            spellType: 'energy-burst',
            cooldown: 0,
            maxCooldown: 3000
        };
        
        }


// Method to move the player
  move(cursorKeys, delta) {
  // Base velocity for 60fps
  const baseSpeed = this.speed;
  // Calculate delta-adjusted speed
  const adjustedSpeed = baseSpeed * (delta / 16.666);
  
  if (cursorKeys.left.isDown) {
    this.setVelocityX(-adjustedSpeed);
  } else if (cursorKeys.right.isDown) {
    this.setVelocityX(adjustedSpeed);
  } else {
    this.setVelocityX(0);
  }
  
  if (cursorKeys.up.isDown) {
    this.setVelocityY(-adjustedSpeed);
  } else if (cursorKeys.down.isDown) {
    this.setVelocityY(adjustedSpeed);
  } else {
    this.setVelocityY(0);
  }
}



takeDamage(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.error('Invalid damage amount:', amount); // Debug log
        return;
    }

    this.health -= amount;
    if (this.health < 0) {
        this.health = 0; // Prevent negative health
        // Emit player death event for audio
        this.scene.events.emit("player-lose");
    }
}

heal(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    console.error('Invalid heal amount:', amount);
    return;
  }
  this.health += amount;
  if (this.health > this.maxHealth) {
    this.health = this.maxHealth;
  }
}

castBasicSpell() {
    console.log("Attempting to cast spell, cooldown:", this.basicSpellSlot.cooldown);
    if (this.basicSpellSlot.cooldown <= 0) {
        console.log("Casting spell!");
        const pointer = this.scene.input.activePointer;
        const direction = {
        x: pointer.worldX - this.x,
        y: pointer.worldY - this.y
    };

    this.emit('cast-basic', {
        spellType: this.basicSpellSlot.spellType,
        x: this.x,
        y: this.y,
        direction: direction,
        faction: this.faction
    });

    this.basicSpellSlot.cooldown = this.basicSpellSlot.maxCooldown;

}}
update(time, delta) {
    // Reduce cooldowns (prevent going negative)
    if (this.basicSpellSlot.cooldown > 0) {
        this.basicSpellSlot.cooldown = Math.max(0, this.basicSpellSlot.cooldown - delta);
    }
    if (this.skillSpellSlot.cooldown > 0) {
        this.skillSpellSlot.cooldown = Math.max(0, this.skillSpellSlot.cooldown - delta);
    }
}
changeBasicWeapon(weapon){

  switch(weapon){

    case('cluster-bomb'):
      this.basicSpellSlot = {
            spellType: 'cluster-bomb',
            cooldown: 0,
            maxCooldown: 500
        };
        break;

    default:
        console.log('invalid weapon');
        break;
}

}

}
