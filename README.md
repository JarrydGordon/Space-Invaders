# Space Invaders Game

    A modern implementation of the classic Space Invaders game with enhanced features, built using HTML5 Canvas and JavaScript.

    ## Features

    - 🚀 Classic Space Invaders gameplay
    - 🎯 Dynamic death probability calculation
    - 🔢 Limited bullets (3x number of invaders)
    - ⚡ Fast-paced invader movement, with some randomized individual variations for a more dynamic swarm.
    - 📊 Real-time statistics display
    - 🚨 Bullet depletion warning system
    - 🏆 Win/Lose conditions with messages
    - 🎮 Keyboard controls for movement and shooting
    - 🧱 **Object-Oriented Design:** Core game logic has been refactored into JavaScript classes (`Game`, `Player`, `Invader`, `Bullet`) for improved structure, maintainability, and scalability.
    - 🔊 **Sound System Framework:** Integrated with the Web Audio API, preparing the game for sound effects and music (actual audio assets and full playback are implemented via simulation, ready for real assets).

    ## How to Play

    1. **Movement**:
       - Use ← (Left Arrow) or 'A' key to move left
       - Use → (Right Arrow) or 'D' key to move right

    2. **Shooting**:
       - Press Spacebar to shoot bullets
       - You have limited bullets (currently 250, can be adjusted)

    3. **Gameplay**:
       - Destroy all invaders to win
       - Prevent invaders from reaching the bottom of the screen
       - Avoid collision with invaders
       - Watch the death probability increase as invaders get closer
       - Manage your bullets carefully

    4. **Game End**:
       - Win: Destroy all invaders
       - Lose: Invaders reach the bottom, player collides with an invader, or you run out of bullets with invaders remaining.

    ## Installation

    ### Prerequisites
    - Node.js (v14 or higher)
    - npm (v6 or higher)

    ### Setup
    1. Clone the repository:
       ```bash
       git clone https://github.com/JarrydGordon/Space-Invaders.git
       cd space-invaders
       ```
       (Note: The actual repo URL might differ for this exercise)

    2. Install dependencies (if any, for this project, it's vanilla JS but Vite was mentioned previously):
       ```bash
       npm install
       ```
       (If not using Vite or similar, this step might not be needed for vanilla JS)

    3. Start the development server (if using Vite):
       ```bash
       npm run dev
       ```
       If not using a dev server, simply open `index.html` in your browser.

    4. Open your browser and navigate to the provided URL (e.g., `http://localhost:5173` for Vite) or the `index.html` file.

    ## Game Mechanics

    ### Death Probability Calculation
    The game calculates death probability based on:
    - Number of remaining invaders
    - Remaining bullets
    (The original README mentioned proximity, which is not explicitly in the current simplified `calculateDeathProbability` function in `game.js`.)

    ### Bullet System
    - Total bullets are initialized (e.g., 250).
    - When bullets run out, a warning appears and a sound is triggered.

    ### Invader Movement
    - Horizontal speed increases as invaders are destroyed.
    - Some invaders have slight variations in their horizontal and vertical movement speeds.
    - Movement pattern: Side-to-side with downward steps when an edge is hit.

    ## Project Structure

    The project primarily consists of:
    ```
    space-invaders/
    ├── index.html            # Main HTML file, sets up the canvas and loads scripts
    ├── game.js               # Core game logic, including all class definitions (Game, Player, Invader, Bullet)
    ├── main.js               # Initializes and starts the Game object from game.js
    └── README.md             # This file
    ```
    (Assuming no `public/` or `src/` subdirectories for this vanilla JS version unless Vite is actively used).

    ## Contributing

    Contributions are welcome! Please follow these steps:

    1. Fork the repository
    2. Create a new branch (`git checkout -b feature/YourFeature`)
    3. Commit your changes (`git commit -m 'Add some feature'`)
    4. Push to the branch (`git push origin feature/YourFeature`)
    5. Open a Pull Request

    ## License

    MIT License

    Copyright (c) 2025 [Jarryd Gordon]
    (Year and name might need updating if this is a template)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    ## Acknowledgments

    - Inspired by the classic Space Invaders game
    - Built using HTML5 Canvas and JavaScript with modern OOP practices
    - Sound system framework uses the Web Audio API

    ## Support

    If you find this project useful, please consider:
    - ⭐ Starring the repository
    - 🐛 Reporting issues
    - 💡 Suggesting new features
    - 🛠️ Contributing code improvements

    Enjoy the game! 🎮
