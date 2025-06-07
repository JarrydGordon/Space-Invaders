// Ensure game.js is loaded before main.js in index.html
// e.g., <script src="game.js"></script>
//       <script src="main.js"></script>

// All game logic, variables, and rendering are now encapsulated in the Game class (from game.js).

// Get the canvas element (though Game class also does this, it's good practice if needed elsewhere)
const canvas = document.getElementById('gameCanvas');

// It's important that the canvas has a defined width and height in the HTML or CSS,
// or set here before the Game instance is created if the Game class relies on it immediately.
// For this project, the Game class constructor handles getting the canvas and its context.
// canvas.width = 800; // These might be already set in HTML or by Game class
// canvas.height = 600;


// Instantiate the Game class
// The Game constructor will find the canvas by ID, set up the context,
// initialize the player, and set up input handlers.
const game = new Game('gameCanvas');

// Start the game
// This will create invaders and start the game loop.
game.start();

// Event listeners for keyboard input are now set up within the Game class constructor.
// No need for global event listeners here anymore.

// The main game loop (requestAnimationFrame) is also managed within the Game class.

// All functions like drawPlayer, updateInvaders, checkCollisions, drawStats, etc.,
// are now methods of the Game, Player, Bullet, or Invader classes.
// Global helper functions related to game logic have been integrated into these classes.

console.log("Space Invaders game initialized using OOP structure.");
