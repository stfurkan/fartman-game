export class PreloadScene extends Phaser.Scene {
  constructor() {
      super('PreloadScene');
  }

  preload() {
      this.load.svg('logo', 'assets/images/logo.svg');
      this.load.svg('sky', 'assets/images/sky.svg');
      this.load.svg('platform', 'assets/images/platform.svg');
      this.load.svg('ground', 'assets/images/ground.svg');
      this.load.spritesheet('fartman', 'assets/images/fartman-spritesheet.svg', { 
        frameWidth: 64, 
        frameHeight: 64 
      });
      this.load.svg('enemy', 'assets/images/enemy.svg');
      this.load.svg('spit', 'assets/images/spit.svg');
      this.load.svg('fart', 'assets/images/fart.svg');

      // Load audio files
      this.load.audio('soundtrack', 'assets/audio/soundtrack.wav');
      this.load.audio('fart', 'assets/audio/fart.wav');
      this.load.audio('spit', 'assets/audio/spit.wav');

      // Add a loading bar
      let progressBar = this.add.graphics();
      let progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(240, 270, 320, 50);
      
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      let loadingText = this.make.text({
          x: width / 2,
          y: height / 2 - 50,
          text: 'Loading...',
          style: {
              font: '20px monospace',
              fill: '#ffffff'
          }
      });
      loadingText.setOrigin(0.5, 0.5);
      
      this.load.on('progress', function (value) {
          progressBar.clear();
          progressBar.fillStyle(0xffffff, 1);
          progressBar.fillRect(250, 280, 300 * value, 30);
      });
              
      this.load.on('complete', function () {
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
      });
  }

  init() {
      this.dataManagement = this.scene.get('DataManagementScene');
  }

  create() {
      this.dataManagement.toggleBackgroundMusic(true);
      this.dataManagement.toggleSoundEffects(true);
      this.scene.start('MainMenuScene');
  }
}
