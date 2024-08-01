export class Fart extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
      super(scene, x, y, 'fart');
      scene.add.existing(this);
      scene.physics.add.existing(this);
  }

  fire(direction) {
      const speed = 300;
      const angle = direction === 'left' ? 315 : 225; // 45 degrees up from horizontal
      const radians = Phaser.Math.DegToRad(angle);
      
      this.setVelocityX(speed * Math.cos(radians));
      this.setVelocityY(speed * Math.sin(radians));
      
      this.scene.time.delayedCall(1000, () => this.destroy());
  }
}
