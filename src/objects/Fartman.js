import { gameConfig } from '../config/gameConfig.js';
import { Spit } from './Spit.js';
import { Fart } from './Fart.js';

export class Fartman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'fartman');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.spits = scene.physics.add.group({ classType: Spit });
        this.farts = scene.physics.add.group({ classType: Fart });

        this.spitSound = scene.sound.add('spit');
        this.fartSound = scene.sound.add('fart');
        this.dataManagement = scene.scene.get('DataManagementScene');

        this.facing = 'right';
        this.createAnimations();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('fartman', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'run_right',
            frames: this.scene.anims.generateFrameNumbers('fartman', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'run_left',
            frames: this.scene.anims.generateFrameNumbers('fartman', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(cursors, jumpKey, spitKey, fartKey) {
        const speed = 160;
        const jumpStrength = 330;

        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.facing = 'left';
            this.anims.play('run_left', true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.facing = 'right';
            this.anims.play('run_right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('idle', true);
        }

        if (Phaser.Input.Keyboard.JustDown(jumpKey) && this.body.touching.down) {
            this.setVelocityY(-jumpStrength);
        }

        if (Phaser.Input.Keyboard.JustDown(spitKey)) {
            this.spit();
        }

        if (Phaser.Input.Keyboard.JustDown(fartKey)) {
            this.fart();
        }

        // Ensure Fartman stays within world bounds
        this.x = Phaser.Math.Clamp(this.x, 0, gameConfig.worldWidth);
    }

    spit() {
        if (this.spits.countActive(true) < 3) {
            if (this.dataManagement.getSoundEffectsState()) {
              this.spitSound.play();
            }
            const spit = new Spit(this.scene, this.x, this.y);
            this.spits.add(spit);
            spit.fire(this.facing);
        }
    }

    fart() {
        if (this.farts.countActive(true) < 1) {
            if (this.dataManagement.getSoundEffectsState()) {
              this.fartSound.play();
            }
            const fart = new Fart(this.scene, this.x, this.y + 20);
            this.farts.add(fart);
            fart.fire(this.facing);
        }
    }
}
