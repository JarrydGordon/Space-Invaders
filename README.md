# Space Invaders Game

    A modern implementation of the classic Space Invaders game with enhanced features, built using HTML5 Canvas and JavaScript.

    ## Features

    - 🚀 Classic Space Invaders gameplay
    - 🎯 Dynamic death probability calculation
    - 🔢 Limited bullets (3x number of invaders)
    - ⚡ Fast-paced invader movement
    - 📊 Real-time statistics display
    - 🚨 Bullet depletion warning system
    - 🏆 Win/Lose conditions with messages
    - 🎮 Keyboard controls for movement and shooting

    ## How to Play

    1. **Movement**:
       - Use ← (Left Arrow) to move left
       - Use → (Right Arrow) to move right

    2. **Shooting**:
       - Press Spacebar to shoot bullets
       - You have limited bullets (3x number of invaders)

    3. **Gameplay**:
       - Destroy all invaders to win
       - Avoid letting invaders reach your ship
       - Watch the death probability increase as invaders get closer
       - Manage your bullets carefully

    4. **Game End**:
       - Win: Destroy all invaders
       - Lose: Invaders reach your ship or run out of bullets

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

    2. Install dependencies:
       ```bash
       npm install
       ```

    3. Start the development server:
       ```bash
       npm run dev
       ```

    4. Open your browser and navigate to:
       ```
       http://localhost:5173
       ```

    ## Game Mechanics

    ### Death Probability Calculation
    The game calculates death probability based on:
    - Number of remaining invaders (40%)
    - Proximity of invaders to the ship (40%)
    - Remaining bullets (20%)
    - Immediate 100% if invaders reach the ship

    ### Bullet System
    - Total bullets = 3 × number of invaders
    - When bullets run out, a warning appears
    - Warning message: "OhNOO! Chance of Death 100%"

    ### Invader Movement
    - Horizontal speed: 3x faster than classic
    - Vertical movement: Smaller increments (10px)
    - Movement pattern: Side-to-side with downward steps

    ## Project Structure

    ```
    space-invaders/
    ├── public/               # Static assets
    ├── src/
    │   ├── main.js           # Main game logic
    │   └── index.html        # Game HTML structure
    ├── package.json          # Project dependencies
    ├── README.md             # This file
    └── vite.config.js        # Vite configuration
    ```

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
    - Built using HTML5 Canvas and JavaScript
    - Developed with Vite for fast development
    - Special thanks to the open source community

    ## Support

    If you find this project useful, please consider:
    - ⭐ Starring the repository
    - 🐛 Reporting issues
    - 💡 Suggesting new features
    - 🛠️ Contributing code improvements

    Enjoy the game! 🎮
