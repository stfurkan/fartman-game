export class DataManagementScene extends Phaser.Scene {
  constructor() {
      super('DataManagementScene');
  }

  init() {
      // Initialize default values if they don't exist
      if (this.data.get('backgroundMusicOn') === undefined) {
          this.data.set('backgroundMusicOn', true);
      }
      if (this.data.get('soundEffectsOn') === undefined) {
          this.data.set('soundEffectsOn', true);
      }
  }

  create() {
      // This scene doesn't need to do anything visually
      this.scene.launch('MainMenuScene');
  }

  toggleBackgroundMusic(value) {
      this.data.set('backgroundMusicOn', value);
  }

  toggleSoundEffects(value) {
      this.data.set('soundEffectsOn', value);
  }

  getBackgroundMusicState() {
      return this.data.get('backgroundMusicOn');
  }

  getSoundEffectsState() {
      return this.data.get('soundEffectsOn');
  }
}
