export class Spit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
      super(scene, x, y, 'spit');
      scene.add.existing(this);
      scene.physics.add.existing(this);
  }

  fire(direction) {
      const speed = 400;
      this.setVelocityX(direction === 'left' ? -speed : speed);
      this.body.setAllowGravity(false);
      this.scene.time.delayedCall(1000, () => this.destroy());
  }
}
