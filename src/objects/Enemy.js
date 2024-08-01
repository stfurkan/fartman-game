import { gameConfig } from '../config/gameConfig.js';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.moveSpeed = 50;
        this.direction = Phaser.Math.Between(0, 1) ? 1 : -1;
        this.setVelocityX(this.moveSpeed * this.direction);
    }

    update() {
        // Check if the enemy is at the world bounds
        if (this.x <= 0) {
            this.x = 1; // Ensure it's just inside the left boundary
            this.direction = 1;
        } else if (this.x >= gameConfig.worldWidth) {
            this.x = gameConfig.worldWidth - 1; // Ensure it's just inside the right boundary
            this.direction = -1;
        }

        // Check if the enemy is on a platform edge
        if (!this.body.touching.down && this.body.velocity.y === 0) {
            this.direction *= -1;
        }

        // Set velocity based on direction
        this.setVelocityX(this.moveSpeed * this.direction);

        // Flip the enemy sprite based on direction
        this.flipX = this.direction < 0;
    }
}
