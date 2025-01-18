// Canvas setup and game constants
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Game configuration
    const invaderRows = 3;          // Number of invader rows
    const invaderCols = 8;          // Number of invader columns
    const totalInvaders = invaderRows * invaderCols;

    // Game state variables
    let gameActive = true;          // Is the game currently running?
    let winMessage = false;         // Should we show win message?
    let loseMessage = false;        // Should we show lose message?
    let bulletsRemaining = totalInvaders * 3;  // Total bullets available
    let destroyedInvaders = 0;      // Number of destroyed invaders
    let showBulletWarning = false;  // Should we show bullet warning?
    let bulletWarningTimeout = null;// Timer for bullet warning

    // Player object configuration
    const player = {
      x: canvas.width / 2 - 25,     // Starting X position
      y: canvas.height - 80,        // Starting Y position
      width: 60,                    // Player width
      height: 40,                   // Player height
      color: '#0f0',                // Player color
      speed: 5,                     // Movement speed
      dx: 0                         // Current movement direction
    };

    // Bullet configuration
    const bullets = [];             // Array to store active bullets
    const bulletSpeed = 5;          // Speed of bullets
    const bulletWidth = 3;          // Bullet width
    const bulletHeight = 10;        // Bullet height

    // Invader configuration
    const invaders = [];            // Array to store invaders
    const invaderSpeed = 3;         // Horizontal movement speed
    const invaderStep = 10;         // Vertical movement increment
    let invaderDirection = 1;       // Current movement direction (1 = right, -1 = left)

    /**
     * Calculates the current death probability based on:
     * - Number of remaining invaders
     * - Proximity of invaders to the player
     * - Remaining bullets
     * - Immediate impact condition
     * @returns {number} Death probability percentage (0-100)
     */
    function calculateDeathProbability() {
      // Immediate 100% if invaders reach the ship
      if (checkImpactCondition()) {
        return 100;
      }

      // Calculate base risk from number of remaining invaders
      const remainingInvaders = invaders.filter(inv => inv.alive).length;
      const baseRisk = remainingInvaders / totalInvaders;
      
      // Calculate proximity risk based on invader positions
      let proximityRisk = 0;
      invaders.forEach(invader => {
        if (invader.alive) {
          // Normalized distance (0 = at ship, 1 = at top)
          const distance = 1 - ((canvas.height - invader.y) / canvas.height);
          proximityRisk += distance;
        }
      });
      
      // Average proximity risk across remaining invaders
      if (remainingInvaders > 0) {
        proximityRisk /= remainingInvaders;
      }
      
      // Calculate bullet risk based on remaining bullets
      const bulletRisk = 1 - (bulletsRemaining / (totalInvaders * 3));
      
      // Combine risks with weighted factors
      const combinedRisk = (0.4 * baseRisk) + 
                         (0.4 * proximityRisk) + 
                         (0.2 * bulletRisk);
      
      // Convert to percentage and cap at 100%
      return Math.min(combinedRisk * 100, 100).toFixed(1);
    }

    /**
     * Checks if any invader has reached the player's position
     * @returns {boolean} True if impact condition is met
     */
    function checkImpactCondition() {
      return invaders.some(invader => 
        invader.alive && 
        invader.y + invader.height >= player.y &&
        invader.x + invader.width >= player.x &&
        invader.x <= player.x + player.width
      );
    }

    /**
     * Checks if the player has lost the game
     */
    function checkLoseCondition() {
      if (checkImpactCondition()) {
        gameActive = false;
        loseMessage = true;
      }
    }

    /**
     * Draws the "YOU LOSE!" message on the canvas
     */
    function drawLoseMessage() {
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YOU LOSE!', canvas.width/2, canvas.height/2);
    }

    /**
     * Draws the bullet warning message if active
     */
    function drawBulletWarning() {
      if (showBulletWarning) {
        ctx.fillStyle = '#ff0';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OhNOO! Chance of Death 100%', canvas.width/2, canvas.height/2 + 100);
      }
    }

    /**
     * Shows the bullet warning message for 3 seconds
     */
    function showBulletWarningMessage() {
      showBulletWarning = true;
      if (bulletWarningTimeout) {
        clearTimeout(bulletWarningTimeout);
      }
      bulletWarningTimeout = setTimeout(() => {
        showBulletWarning = false;
      }, 3000);
    }

    /**
     * Creates the initial invader grid
     */
    function createInvaders() {
      invaders.length = 0;
      for (let row = 0; row < invaderRows; row++) {
        for (let col = 0; col < invaderCols; col++) {
          invaders.push({
            x: 100 + col * 70,
            y: 50 + row * 50,
            width: 40,
            height: 30,
            color: '#f00',
            alive: true
          });
        }
      }
      bulletsRemaining = totalInvaders * 3;
      destroyedInvaders = 0;
    }

    /**
     * Draws the game statistics (bullets remaining and death probability)
     */
    function drawStats() {
      ctx.fillStyle = '#fff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Bullets: ${bulletsRemaining}`, 20, 30);

      const probability = calculateDeathProbability();
      ctx.textAlign = 'right';
      ctx.fillText(`Death Probability: ${probability}%`, canvas.width - 20, 30);
    }

    // ... [Rest of the code with similar detailed comments] ...
