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

    shoot(bullets) {
        const bulletX = this.x + this.width / 2 - 2.5;
        const bulletY = this.y;
        bullets.push(new Bullet(bulletX, bulletY, 5, 10, 'yellow', 7));
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
        this.winMessageText = "Congratulations! You've saved the world!";
        this.loseMessageText = "Game Over. The invaders have won.";
        this.destroyedInvaders = 0;

        this.showBulletWarning = false;
        this.bulletWarningTimeout = null;

        this.audioCtx = null;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API is not supported in this browser. Sound effects will be logged or have basic beeps.");
        }

        this.soundsToLoad = {
            shoot: 'assets/sounds/shoot.wav',
            explosion: 'assets/sounds/explosion.wav',
            gameLose: 'assets/sounds/player_lose.wav',
            gameWin: 'assets/sounds/game_win.wav',
            bulletWarning: 'assets/sounds/bullet_warning.wav'
        };
        this.audioBuffers = {};

        this._setupInputHandlers();
    }

    async loadSounds() {
        console.log("Attempting to load sounds (simulated)...");
        if (!this.audioCtx) {
            console.warn("AudioContext not available. Skipping actual sound loading process.");
            for (const [soundName, filePath] of Object.entries(this.soundsToLoad)) {
                 this.audioBuffers[soundName] = {
                    name: soundName,
                    path: filePath,
                    loaded: false,
                    toString: function() { return `SimulatedAudioBuffer(${this.name}, NotLoaded)`; }
                };
            }
            return;
        }

        for (const [soundName, filePath] of Object.entries(this.soundsToLoad)) {
            console.log(`Simulating loading of: ${filePath} for sound event '${soundName}'`);
            try {
                await new Promise(resolve => setTimeout(resolve, 50));
                // In a real scenario, the object stored here would be an actual AudioBuffer
                this.audioBuffers[soundName] = {
                    name: soundName,
                    path: filePath,
                    loaded: true,
                    // Add dummy properties that an AudioBuffer might have, for simulation robustness
                    duration: Math.random() * 2 + 0.5, // Simulated duration
                    sampleRate: this.audioCtx.sampleRate, // Use actual sampleRate
                    numberOfChannels: Math.random() > 0.5 ? 1 : 2, // Simulated channels
                    toString: function() { return `SimulatedAudioBuffer(Name: ${this.name}, Path: ${this.path}, Loaded: ${this.loaded})`; }
                };
                console.log(`Successfully simulated loading of ${filePath} as '${soundName}'`);

            } catch (error) {
                console.error(`Error simulating loading sound ${soundName} from ${filePath}:`, error);
                this.audioBuffers[soundName] = { name: soundName, path: filePath, loaded: false, error: error, toString: function() { return `SimulatedAudioBuffer(${this.name}, ErrorLoading)`; } };
            }
        }
        console.log("All sounds (simulated) loading process complete.");
    }

    playSound(soundName) {
        if (!this.audioCtx) {
            // This case is logged during constructor and loadSounds, so just return.
            return;
        }

        const bufferInfo = this.audioBuffers[soundName];
        const soundPath = this.soundsToLoad[soundName] || "N/A (sound not in soundsToLoad)";

        if (bufferInfo && bufferInfo.loaded) {
            try {
                const source = this.audioCtx.createBufferSource();

                // Crucial part: source.buffer expects a real AudioBuffer.
                // In our simulation, bufferInfo is our placeholder object.
                // This assignment will likely not make actual sound in a browser
                // but it allows us to test the Web Audio API call sequence.
                // A browser might log a warning or error here in the console
                // if it strictly type-checks source.buffer.
                source.buffer = bufferInfo;

                console.log(`Attempting to play sound '${soundName}' (${bufferInfo.path}) using AudioBufferSourceNode. Buffer details: ${bufferInfo.toString()}`);

                source.connect(this.audioCtx.destination);
                source.start(0); // Start playback now
                // console.log(`Sound '${soundName}' started via AudioBufferSourceNode.`);

            } catch (error) {
                console.error(`Error playing sound '${soundName}' with AudioBufferSourceNode:`, error);
                console.error(`Buffer used:`, bufferInfo);
                // This might catch errors if source.buffer is not a valid type
                // or if other Web Audio API constraints are violated.
            }
        } else {
            if (!bufferInfo) {
                console.warn(`Sound '${soundName}' (${soundPath}) was not found in audioBuffers. Check soundsToLoad definition and loadSounds method.`);
            } else if (!bufferInfo.loaded) {
                console.warn(`Sound '${soundName}' (${soundPath}) is in audioBuffers but not marked as loaded. Possible loading error or AudioContext issue.`);
            }
        }
    }

    _setupInputHandlers() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (!this.gameActive && e.key !== 'F5' && e.key !== 'f5') return;
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
                this.showBulletWarningMessage();
            }
        }
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
            this.player.dx = 0;
        }
    }

    createInvaders() {
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

        this.updateInvaders();
        if (!this.gameActive) return;

        this.checkCollisions();
        if (!this.gameActive) return;

        this.checkWinLossConditions();
    }

    updateInvaders() {
        let moveDown = false;

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
                if (invader.y + invader.height >= this.canvas.height) {
                    if (this.gameActive) {
                        this.playSound('gameLose');
                    }
                    this.gameActive = false;
                    return;
                }
            }
        }
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.invaders.length - 1; j >= 0; j--) {
                if (this.invaders[j].alive && this.bullets[i]) {
                    const bullet = this.bullets[i];
                    const invader = this.invaders[j];
                    if (
                        bullet.x < invader.x + invader.width &&
                        bullet.x + bullet.width > invader.x &&
                        bullet.y < invader.y + invader.height &&
                        bullet.y + bullet.height > invader.y
                    ) {
                        invader.alive = false;
                        this.bullets.splice(i, 1);
                        this.destroyedInvaders++;
                        this.invaderSpeed += 0.05;
                        this.playSound('explosion');
                        break;
                    }
                }
            }
        }

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
                    }
                    this.gameActive = false;
                    return;
                }
            }
        }
    }

    checkWinLossConditions() {
        if (!this.gameActive) return;

        if (this.destroyedInvaders === this.totalInvaders) {
            if (this.gameActive) {
                 this.playSound('gameWin');
            }
            this.gameActive = false;
        } else if (this.bulletsRemaining <= 0 && this.destroyedInvaders < this.totalInvaders && this.bullets.length === 0) {
            let bulletsActiveOnScreen = false;
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
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Bullets: ${this.bulletsRemaining}`, 10, 20);
        this.ctx.fillText(`Invaders Killed: ${this.destroyedInvaders}/${this.totalInvaders}`, this.canvas.width - 200, 20);
        const probability = this.calculateDeathProbability();
        this.ctx.fillText(`Death Probability: ${probability.toFixed(2)}%`, this.canvas.width / 2 - 70, 20);
    }

    calculateDeathProbability() {
        const remainingInvaders = this.totalInvaders - this.destroyedInvaders;
        if (remainingInvaders === 0) return 0;
        const probability = (remainingInvaders / this.totalInvaders) * (1 - (this.bulletsRemaining / 250)) * 100;
        return Math.min(Math.max(probability, 0), 100);
    }

    drawWinMessage() {
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
        this.playSound('bulletWarning');
        if (this.bulletWarningTimeout) clearTimeout(this.bulletWarningTimeout);
        this.bulletWarningTimeout = setTimeout(() => {
            this.showBulletWarning = false;
        }, 2000);
    }

    drawBulletWarning() {
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
            this.draw();
        }
    }

    async start() {
        await this.loadSounds();

        this.createInvaders();
        this.gameActive = true;
        this.bulletsRemaining = 250;
        this.destroyedInvaders = 0;
        this.invaderSpeed = 1;
        this.player.x = this.canvas.width / 2 - 25;
        this.player.y = this.canvas.height - 30;
        this.player.dx = 0;
        this.bullets = [];
        this.invaderDirection = 1;
        this.showBulletWarning = false;
        if (this.bulletWarningTimeout) clearTimeout(this.bulletWarningTimeout);

        this.gameLoop();
    }
}
