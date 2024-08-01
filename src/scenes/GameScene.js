import { Fartman } from '../objects/Fartman.js';
import { Enemy } from '../objects/Enemy.js';
import { gameConfig } from '../config/gameConfig.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isMenuOpen = false;
    }

    init() {
        this.score = 0;
        this.gameActive = true;
        this.isMenuOpen = false;

        this.dataManagement = this.scene.get('DataManagementScene');
        this.backgroundMusicOn = this.dataManagement.getBackgroundMusicState();
        this.soundEffectsOn = this.dataManagement.getSoundEffectsState();
    }

    create() {
      // Set world bounds
      this.physics.world.setBounds(0, 0, gameConfig.worldWidth, gameConfig.worldHeight);

      // Create a tiled background
      this.createTiledBackground();

      this.createPlatforms();
      this.createUI();

      // Handle background music
      this.handleBackgroundMusic();

      // Add sound effects
      this.fartSound = this.sound.add('fart');
      this.spitSound = this.sound.add('spit');

      this.fartman = new Fartman(this, 100, 450);
      this.physics.add.collider(this.fartman, this.platforms);

      // Set up camera to follow Fartman
      this.cameras.main.setBounds(0, 0, gameConfig.worldWidth, gameConfig.worldHeight);
      this.cameras.main.startFollow(this.fartman, true, 0.5, 0.5);

      this.enemies = this.physics.add.group({
          classType: Enemy,
          runChildUpdate: true
      });
      this.physics.add.collider(this.enemies, this.platforms);

      this.physics.add.overlap(this.fartman, this.enemies, this.checkCollision, null, this);

      this.time.addEvent({
          delay: 2000,
          callback: this.spawnEnemy,
          callbackScope: this,
          loop: true
      });

      this.cursors = this.input.keyboard.createCursorKeys();
      this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.spitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.fartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

      this.physics.add.collider(this.fartman.spits, this.enemies, this.hitEnemyWithProjectile, null, this);
      this.physics.add.collider(this.fartman.farts, this.enemies, this.hitEnemyWithProjectile, null, this);
    }

    handleBackgroundMusic() {
      // Check if background music already exists in the sound manager
      const existingMusic = this.sound.get('soundtrack');
      
      if (existingMusic) {
          this.backgroundMusic = existingMusic;
      } else {
          this.backgroundMusic = this.sound.add('soundtrack', { loop: true, volume: 0.5 });
      }

      // Play or pause based on current state
      if (this.backgroundMusicOn) {
          if (!this.backgroundMusic.isPlaying) {
              this.backgroundMusic.play();
          }
      } else {
          this.backgroundMusic.pause();
      }
    }

    createTiledBackground() {
      const skyImage = this.textures.get('sky').getSourceImage();
      const skyWidth = skyImage.width;
      const skyHeight = skyImage.height;
      
      const tilesX = Math.ceil(gameConfig.worldWidth / skyWidth) + 1;
      const tilesY = Math.ceil(gameConfig.worldHeight / skyHeight);
  
      for (let x = 0; x < tilesX; x++) {
          for (let y = 0; y < tilesY; y++) {
              this.add.image(x * skyWidth, y * skyHeight, 'sky').setOrigin(0, 0);
          }
      }
    }

    createUI() {
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' })
          .setScrollFactor(0);
      
      this.menuButton = this.add.text(this.cameras.main.width - 80, 20, 'Menu', { fontSize: '24px', fill: '#fff' })
          .setScrollFactor(0)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              if (!this.isMenuOpen) {
                  this.showMenu();
              }
          })
          .on('pointerover', () => {
              if (!this.isMenuOpen) {
                  this.menuButton.setStyle({ fill: '#ff0' });
              }
          })
          .on('pointerout', () => {
              if (!this.isMenuOpen) {
                  this.menuButton.setStyle({ fill: '#fff' });
              }
          });
    }

    showMenu() {
      if (this.isMenuOpen) return;

      this.isMenuOpen = true;
      this.gameActive = false;
      this.physics.pause();

      const { width, height } = this.cameras.main;

      const menuBg = this.add.rectangle(width / 2, height / 2, 300, 250, 0x000000, 0.8)
          .setScrollFactor(0);

      const resumeButton = this.createMenuButton(width / 2, height / 2 - 60, 'Resume', () => this.resumeGame());
      const restartButton = this.createMenuButton(width / 2, height / 2 - 20, 'Restart', () => {
          this.cleanGameOver();
          this.scene.restart();
      });
      
      const musicToggle = this.createToggleButton(
          width / 2, 
          height / 2 + 20, 
          'Music: ON', 
          'Music: OFF', 
          this.backgroundMusicOn, 
          (isOn) => this.toggleBackgroundMusic(isOn)
      );

      const soundToggle = this.createToggleButton(
          width / 2, 
          height / 2 + 60, 
          'Sound FX: ON', 
          'Sound FX: OFF', 
          this.soundEffectsOn, 
          (isOn) => this.toggleSoundEffects(isOn)
      );

      const quitButton = this.createMenuButton(width / 2, height / 2 + 100, 'Quit', () => this.scene.start('MainMenuScene'));

      this.menuItems = [menuBg, resumeButton, restartButton, musicToggle, soundToggle, quitButton];
    }

    createToggleButton(x, y, textOn, textOff, initialState, callback) {
        const button = this.add.text(x, y, initialState ? textOn : textOff, { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                const newState = !button.getData('toggled');
                button.setData('toggled', newState);
                button.setText(newState ? textOn : textOff);
                callback(newState);
            })
            .on('pointerover', () => button.setStyle({ fill: '#ff0' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));

        button.setData('toggled', initialState);
        return button;
    }

    toggleBackgroundMusic(isOn) {
        this.backgroundMusicOn = isOn;
        this.dataManagement.toggleBackgroundMusic(isOn);
        
        if (isOn) {
            if (!this.backgroundMusic.isPlaying) {
                this.backgroundMusic.play();
            }
        } else {
            this.backgroundMusic.pause();
        }
    }

    toggleSoundEffects(isOn) {
        this.soundEffectsOn = isOn;
        this.dataManagement.toggleSoundEffects(isOn);
    }

    createMenuButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback)
            .on('pointerover', () => button.setStyle({ fill: '#ff0' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));

        return button;
    }

    resumeGame() {
        this.gameActive = true;
        this.physics.resume();
        this.menuItems.forEach(item => item.destroy());
        this.isMenuOpen = false;
    }

    createPlatforms() {
      this.platforms = this.physics.add.staticGroup();
  
      // Create main ground
      for (let x = 0; x < gameConfig.worldWidth; x += 400) {
          this.platforms.create(x, 568, 'ground').setScale(2).refreshBody();
      }
      
      // Create random platforms
      const platformCount = 15;
      const minDistance = 100;
  
      for (let i = 0; i < platformCount; i++) {
          let x, y, width;
          let overlap;
  
          do {
              x = Phaser.Math.Between(50, gameConfig.worldWidth - 50);
              y = Phaser.Math.Between(150, 450);
              width = Phaser.Math.Between(100, 200);
  
              overlap = false;
              this.platforms.children.entries.forEach(platform => {
                  if (
                      Math.abs(platform.x - x) < (platform.width + width) / 2 + minDistance &&
                      Math.abs(platform.y - y) < (platform.height + 20) / 2 + minDistance
                  ) {
                      overlap = true;
                  }
              });
          } while (overlap);
  
          const platform = this.platforms.create(x, y, 'platform');
          platform.setOrigin(0.5, 0.5);
          platform.displayWidth = width;
          platform.displayHeight = 20; // Keep the height constant
          platform.refreshBody();

          platform.body.setSize(width, 20);
          platform.body.setOffset(0, 0);
          platform.body.updateFromGameObject();
      }
    }

    update() {
        if (this.gameActive) {
            this.fartman.update(this.cursors, this.jumpKey, this.spitKey, this.fartKey);
            this.enemies.children.entries.forEach(enemy => {
                enemy.update();
            });
        }
    }

    spawnEnemy() {
        if (this.gameActive) {
            const x = Phaser.Math.Between(0, gameConfig.worldWidth);
            const y = 0;
            const enemy = new Enemy(this, x, y);
            this.enemies.add(enemy);
        }
    }

    checkCollision(fartman, enemy) {
        const fartmanBounds = fartman.getBounds();
        const enemyBounds = enemy.getBounds();
        const collisionThreshold = 10;

        if (Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(
                fartmanBounds.x + collisionThreshold,
                fartmanBounds.y + collisionThreshold,
                fartmanBounds.width - 2 * collisionThreshold,
                fartmanBounds.height - 2 * collisionThreshold
            ),
            new Phaser.Geom.Rectangle(
                enemyBounds.x + collisionThreshold,
                enemyBounds.y + collisionThreshold,
                enemyBounds.width - 2 * collisionThreshold,
                enemyBounds.height - 2 * collisionThreshold
            )
        )) {
            this.hitEnemy(fartman, enemy);
        }
    }

    hitEnemy(fartman, enemy) {
        this.showGameOver();
    }

    hitEnemyWithProjectile(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }

    showGameOver() {
      this.gameActive = false;
      this.isMenuOpen = true; // Prevent menu opening during game over
      this.physics.pause();
      this.fartman.setTint(0xff0000);

      const { width, height } = this.cameras.main;

      const background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
          .setScrollFactor(0);

      const gameOverText = this.add.text(width / 2, height / 2 - 70, 'Game Over', { fontSize: '64px', fill: '#fff' })
          .setOrigin(0.5)
          .setScrollFactor(0);

      const finalScoreText = this.add.text(width / 2, height / 2, 'Final Score: ' + this.score, { fontSize: '32px', fill: '#fff' })
          .setOrigin(0.5)
          .setScrollFactor(0);

      const restartButton = this.add.text(width / 2, height / 2 + 70, 'Restart', { fontSize: '32px', fill: '#fff' })
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.cleanGameOver();
              this.scene.restart();
          })
          .on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }))
          .on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));

      this.gameOverElements = [background, gameOverText, finalScoreText, restartButton];
    }

    cleanGameOver() {
        if (this.gameOverElements) {
            this.gameOverElements.forEach(element => element.destroy());
            this.gameOverElements = null;
            this.isMenuOpen = false;  // Allow menu to be opened again after restarting
        }
    }
}
