export class BootScene extends Phaser.Scene {
  constructor() {
      super('BootScene');
  }

  preload() {
      this.load.svg('logo', 'assets/images/logo.svg');
  }

  create() {
      this.scene.start('PreloadScene');
  }
}
