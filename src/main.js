import { gameConfig } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { DataManagementScene } from './scenes/DataManagementScene.js';

gameConfig.scene = [
  BootScene,
  PreloadScene,
  MainMenuScene,
  GameScene,
  DataManagementScene,
];

const game = new Phaser.Game(gameConfig);

// Fullscreen functionality
const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (game.canvas.requestFullscreen) {
            game.canvas.requestFullscreen();
        } else if (game.canvas.mozRequestFullScreen) { // Firefox
            game.canvas.mozRequestFullScreen();
        } else if (game.canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
            game.canvas.webkitRequestFullscreen();
        } else if (game.canvas.msRequestFullscreen) { // IE/Edge
            game.canvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('msfullscreenchange', updateFullscreenButton);

function updateFullscreenButton() {
    if (document.fullscreenElement) {
        fullscreenButton.textContent = 'Exit Fullscreen';
    } else {
        fullscreenButton.textContent = 'Fullscreen';
    }
}
