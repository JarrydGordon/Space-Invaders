class Player {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dx = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(canvasWidth) {
        this.x += this.dx;

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
    }

    shoot(bullets) { // `bullets` is the game's bullets array
        const bulletX = this.x + this.width / 2 - 2.5;
        const bulletY = this.y;
        bullets.push(new Bullet(bulletX, bulletY, 5, 10, 'yellow', 7));
        // Sound will be played by Game class
    }
}

class Bullet {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

class Invader {
    constructor(x, y, width, height, color, speed = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alive = true;
        this.speed = speed;
        this.speedMultiplier = 1;
        this.verticalSpeedOffset = 0;
    }

    draw(ctx) {
        if (this.alive) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        // Placeholder
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.player = new Player(this.canvas.width / 2 - 25, this.canvas.height - 30, 50, 20, 'white', 7);

        this.bullets = [];
        this.bulletsRemaining = 250;

        this.invaders = [];
        this.invaderRows = 5;
        this.invaderCols = 10;
        this.totalInvaders = this.invaderRows * this.invaderCols;
        this.invaderSpeed = 1;
        this.invaderDirection = 1;
        this.invaderMoveDownStep = 30;

        this.gameActive = true;
        this.winMessageText = "Congratulations! You've saved the world!"; // Renamed for clarity
        this.loseMessageText = "Game Over. The invaders have won."; // Renamed for clarity
        this.destroyedInvaders = 0;

        this.showBulletWarning = false;
        this.bulletWarningTimeout = null;

        // Sound Management
        this.sounds = {
            shoot: 'shoot.wav', // Placeholder actual file names
            explosion: 'explosion.wav',
            gameWin: 'win.wav',
            gameLose: 'lose.wav',
            bulletWarning: 'warning.wav'
        };
        // Basic Web Audio API setup (optional, for actual sound beyond console.log)
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API is not supported in this browser. Sound effects will be logged only.");
            this.audioCtx = null;
        }

        this._setupInputHandlers();
    }

    playSound(soundName) {
        if (!this.sounds[soundName]) {
            console.warn(`Sound ${soundName} not defined.`);
            return;
        }
        console.log(`Playing sound: ${this.sounds[soundName]} (Placeholder: ${soundName})`);

        // Optional: Basic beep if AudioContext is available
        if (this.audioCtx) {
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime); // Volume

            if (soundName === 'shoot') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime); // A4
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 0.1);
                oscillator.start(this.audioCtx.currentTime);
                oscillator.stop(this.audioCtx.currentTime + 0.1);
            } else if (soundName === 'explosion') {
                oscillator.type = 'noise';
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 0.3);
                oscillator.start(this.audioCtx.currentTime);
                oscillator.stop(this.audioCtx.currentTime + 0.3);
            } else if (soundName === 'gameLose') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(150, this.audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 1.0);
                oscillator.start(this.audioCtx.currentTime);
                oscillator.stop(this.audioCtx.currentTime + 1.0);
            } else if (soundName === 'gameWin') {
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(660, this.audioCtx.currentTime); // E5
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 0.8);
                oscillator.start(this.audioCtx.currentTime);
                oscillator.stop(this.audioCtx.currentTime + 0.8);
            }
            // Add more basic sounds as needed
        }
    }

    _setupInputHandlers() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (!this.gameActive && e.key !== 'F5') return; // Allow F5 for restart
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            this.player.dx = -this.player.speed;
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            this.player.dx = this.player.speed;
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            if (this.gameActive && this.bulletsRemaining > 0) {
                this.player.shoot(this.bullets);
                this.bulletsRemaining--;
                this.playSound('shoot');
            } else if (this.gameActive && this.bulletsRemaining <= 0) {
                this.showBulletWarningMessage(); // This method now also plays a sound
            }
        }
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
            this.player.dx = 0;
        }
    }

    createInvaders() {
        // ... (rest of the method is unchanged)
        this.invaders = [];
        this.destroyedInvaders = 0;
        const invaderWidth = 40;
        const invaderHeight = 20;
        const padding = 10;
        const offsetX = (this.canvas.width - (this.invaderCols * (invaderWidth + padding))) / 2;
        const offsetY = 50;

        for (let r = 0; r < this.invaderRows; r++) {
            for (let c = 0; c < this.invaderCols; c++) {
                const x = offsetX + c * (invaderWidth + padding);
                const y = offsetY + r * (invaderHeight + padding);
                this.invaders.push(new Invader(x, y, invaderWidth, invaderHeight, 'green'));
            }
        }
        this.totalInvaders = this.invaders.length;

        const numSpecialInvaders = Math.floor(this.totalInvaders * 0.1);
        for (let i = 0; i < numSpecialInvaders; i++) {
            const randomIndex = Math.floor(Math.random() * this.invaders.length);
            if (this.invaders[randomIndex]) {
                this.invaders[randomIndex].speedMultiplier = 1.2 + Math.random() * 0.3;
                this.invaders[randomIndex].verticalSpeedOffset = (Math.random() - 0.5) * 10;
            }
        }
    }

    update() {
        if (!this.gameActive) return;
        this.player.move(this.canvas.width);

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }

        this.updateInvaders(); // This can change gameActive state
        if (!this.gameActive) return; // If updateInvaders caused a loss, stop further updates this frame

        this.checkCollisions(); // This can change gameActive state
        if (!this.gameActive) return; // If checkCollisions caused a loss, stop further updates

        this.checkWinLossConditions(); // Final check
    }

    updateInvaders() {
        let moveDown = false;
        let gameLostThisUpdate = false; // Flag to check if game is lost in this specific update cycle

        for (const invader of this.invaders) {
            if (invader.alive) {
                if ((invader.x + invader.width >= this.canvas.width && this.invaderDirection === 1) ||
                    (invader.x <= 0 && this.invaderDirection === -1)) {
                    this.invaderDirection *= -1;
                    moveDown = true;
                    break;
                }
            }
        }

        for (const invader of this.invaders) {
            if (invader.alive) {
                invader.x += this.invaderDirection * this.invaderSpeed * invader.speedMultiplier;
                if (moveDown) {
                    invader.y += this.invaderMoveDownStep + invader.verticalSpeedOffset;
                }
                // Check if invader reached bottom AFTER moving
                if (invader.y + invader.height >= this.canvas.height) {
                    if (this.gameActive) { // Check if game is currently active before declaring loss
                        this.playSound('gameLose');
                        gameLostThisUpdate = true;
                    }
                    this.gameActive = false;
                }
            }
        }
        if (gameLostThisUpdate) return; // Stop further processing if game lost
    }

    checkCollisions() {
        let gameLostThisCollision = false;
        // Bullet-Invader collision
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.invaders.length - 1; j >= 0; j--) {
                if (this.invaders[j].alive && this.bullets[i]) { // ensure bullet exists
                    const bullet = this.bullets[i];
                    const invader = this.invaders[j];
                    if (
                        bullet.x < invader.x + invader.width &&
                        bullet.x + bullet.width > invader.x &&
                        bullet.y < invader.y + invader.height &&
                        bullet.y + bullet.height > invader.y
                    ) {
                        invader.alive = false;
                        this.bullets.splice(i, 1); // Remove bullet
                        this.destroyedInvaders++;
                        this.invaderSpeed += 0.05;
                        this.playSound('explosion');
                        break;
                    }
                }
            }
        }

        // Invader-Player collision
        for (const invader of this.invaders) {
            if (invader.alive) {
                if (
                    this.player.x < invader.x + invader.width &&
                    this.player.x + this.player.width > invader.x &&
                    this.player.y < invader.y + invader.height &&
                    this.player.y + this.player.height > invader.y
                ) {
                    if (this.gameActive) {
                        this.playSound('gameLose');
                        gameLostThisCollision = true;
                    }
                    this.gameActive = false;
                    if (gameLostThisCollision) return; // Stop if game lost during collision check
                }
            }
        }
    }

    checkWinLossConditions() {
        if (!this.gameActive) return; // If game already inactive, conditions met

        if (this.destroyedInvaders === this.totalInvaders) {
            if (this.gameActive) {
                 this.playSound('gameWin');
            }
            this.gameActive = false;
        } else if (this.bulletsRemaining <= 0 && this.destroyedInvaders < this.totalInvaders && this.bullets.length === 0) {
            let bulletsActiveOnScreen = false; // Check if any bullets are still visibly moving
            for(const bullet of this.bullets) {
                if(bullet.y > 0 && bullet.y < this.canvas.height) {
                    bulletsActiveOnScreen = true;
                    break;
                }
            }
            if (!bulletsActiveOnScreen) {
                if (this.gameActive) {
                    this.playSound('gameLose');
                }
                this.gameActive = false;
            }
        }
        // Note: Invader reaching bottom or hitting player already sets gameActive = false and plays sound in their respective methods.
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        for (const invader of this.invaders) {
            invader.draw(this.ctx);
        }
        this.drawStats();

        if (!this.gameActive) {
            if (this.destroyedInvaders === this.totalInvaders) {
                this.drawWinMessage();
            } else {
                this.drawLoseMessage();
            }
        }
        if (this.showBulletWarning) {
            this.drawBulletWarning();
        }
    }

    drawStats() {
        // ... (unchanged)
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Bullets: ${this.bulletsRemaining}`, 10, 20);
        this.ctx.fillText(`Invaders Killed: ${this.destroyedInvaders}/${this.totalInvaders}`, this.canvas.width - 200, 20);
        const probability = this.calculateDeathProbability();
        this.ctx.fillText(`Death Probability: ${probability.toFixed(2)}%`, this.canvas.width / 2 - 70, 20);
    }

    calculateDeathProbability() {
        // ... (unchanged)
        const remainingInvaders = this.totalInvaders - this.destroyedInvaders;
        if (remainingInvaders === 0) return 0;
        const probability = (remainingInvaders / this.totalInvaders) * (1 - (this.bulletsRemaining / 250)) * 100;
        return Math.min(Math.max(probability, 0), 100);
    }

    drawWinMessage() {
        // ... (using this.winMessageText)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'green';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.winMessageText, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText("Press F5 to play again", this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    drawLoseMessage() {
        // ... (using this.loseMessageText)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.loseMessageText, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText("Press F5 to try again", this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    showBulletWarningMessage() {
        this.showBulletWarning = true;
        this.playSound('bulletWarning'); // Play sound for bullet warning
        if (this.bulletWarningTimeout) clearTimeout(this.bulletWarningTimeout);
        this.bulletWarningTimeout = setTimeout(() => {
            this.showBulletWarning = false;
        }, 2000);
    }

    drawBulletWarning() {
        // ... (unchanged)
        this.ctx.fillStyle = 'orange';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Out of bullets!", this.canvas.width / 2, this.canvas.height / 2 - 60);
    }

    gameLoop() {
        this.update();
        this.draw();
        if (this.gameActive) {
            requestAnimationFrame(() => this.gameLoop());
        } else {
            // Ensure final state (win/loss message) is drawn
            this.draw();
        }
    }

    start() {
        this.createInvaders();
        this.gameActive = true;
        this.bulletsRemaining = 250;
        this.destroyedInvaders = 0;
        this.invaderSpeed = 1;
        this.player.x = this.canvas.width / 2 - 25;
        this.player.y = this.canvas.height - 30;
        this.player.dx = 0; // Reset player movement
        this.bullets = [];
        this.invaderDirection = 1;
        // Clear any previous warnings or messages
        this.showBulletWarning = false;
        if (this.bulletWarningTimeout) clearTimeout(this.bulletWarningTimeout);

        this.gameLoop();
    }
}
