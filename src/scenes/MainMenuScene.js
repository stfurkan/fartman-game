export class MainMenuScene extends Phaser.Scene {
  constructor() {
      super('MainMenuScene');
  }

  create() {
    const logo = this.add.image(this.cameras.main.width / 2, 500, 'logo');

      this.add.text(400, 100, 'Fartman', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
      
      this.startButton = this.createButton(400, 250, 'Start Game', () => {
          if (!this.howToPlayActive) {
              this.scene.start('GameScene');
          }
      });

      this.howToPlayButton = this.createButton(400, 320, 'How to Play', () => {
          if (!this.howToPlayActive) {
              this.showHowToPlay();
          }
      });

      this.howToPlayGroup = this.add.group();
      this.howToPlayActive = false;
  }

  createButton(x, y, text, callback) {
      const button = this.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', callback)
          .on('pointerover', () => {
              if (!this.howToPlayActive) {
                  button.setStyle({ fill: '#ff0' });
                  this.tweens.add({
                      targets: button,
                      scale: 1.1,
                      duration: 100
                  });
              }
          })
          .on('pointerout', () => {
              if (!this.howToPlayActive) {
                  button.setStyle({ fill: '#fff' });
                  this.tweens.add({
                      targets: button,
                      scale: 1,
                      duration: 100
                  });
              }
          });
      return button;
  }

  showHowToPlay() {
      this.howToPlayActive = true;

      // Clear any existing how-to-play elements
      this.howToPlayGroup.clear(true, true);

      // Create a semi-transparent background that covers the entire screen
      const fullScreenBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
      fullScreenBg.setDepth(9);

      // Create a smaller, opaque background for the content
      const contentBg = this.add.rectangle(400, 300, 600, 400, 0x333333);
      contentBg.setDepth(10);

      const howToPlayContent = [
          "~ How to Play ~",
          "",
          "Move: Arrow Keys",
          "Jump: Space",
          "Spit: A",
          "Fart: S",
          "",
          "Defeat enemies and survive!"
      ].join('\n');

      const howToPlayText = this.add.text(400, 300, howToPlayContent, {
          fontSize: '24px',
          fill: '#fff',
          align: 'center',
          wordWrap: { width: 500 }
      }).setOrigin(0.5);
      howToPlayText.setDepth(11);

      const closeButton = this.add.text(650, 150, 'X', { fontSize: '32px', fill: '#fff' })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.closeHowToPlay())
          .on('pointerover', () => closeButton.setStyle({ fill: '#ff0' }))
          .on('pointerout', () => closeButton.setStyle({ fill: '#fff' }));
      closeButton.setDepth(11);

      this.howToPlayGroup.addMultiple([fullScreenBg, contentBg, howToPlayText, closeButton]);
  }

  closeHowToPlay() {
      this.howToPlayGroup.clear(true, true);
      this.howToPlayActive = false;
  }
}
