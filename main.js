// main.js - 2048 Game Logic
// Core game mechanics, movement, scoring, and input handling

const Game = {
  // Game state
  grid: [],
  score: 0,
  bestScore: 0,
  gridSize: 4,
  gameOver: false,
  won: false,
  
  // Touch handling
  touchStartX: 0,
  touchStartY: 0,
  
  // Flag to track if event listeners have been set up
  listenersInitialized: false,
  
  /**
   * Initialize the game
   */
  init() {
    // Clear any visible overlays from previous game
    document.getElementById('game-over-overlay').classList.remove('show');
    document.getElementById('win-overlay').classList.remove('show');
    
    // Load best score from localStorage
    this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    
    // Initialize grid
    this.grid = this.createEmptyGrid();
    
    // Add initial tiles
    this.addRandomTile();
    this.addRandomTile();
    
    // Reset game state
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    
    // Setup event listeners (only once)
    if (!this.listenersInitialized) {
      this.setupEventListeners();
      this.listenersInitialized = true;
    }
    
    // Render the game
    this.updateUI();
  },
  
  /**
   * Create an empty 4x4 grid
   */
  createEmptyGrid() {
    const grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        grid[i][j] = 0;
      }
    }
    return grid;
  },
  
  /**
   * Setup keyboard and touch event listeners
   */
  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      let moved = false;
      switch(e.key) {
        case 'ArrowUp':
          moved = this.moveUp();
          e.preventDefault();
          break;
        case 'ArrowDown':
          moved = this.moveDown();
          e.preventDefault();
          break;
        case 'ArrowLeft':
          moved = this.moveLeft();
          e.preventDefault();
          break;
        case 'ArrowRight':
          moved = this.moveRight();
          e.preventDefault();
          break;
      }
      
      if (moved) {
        this.afterMove();
      }
    });
    
    // Touch controls
    const gameBoard = document.getElementById('game-board');
    const gameContainer = document.getElementById('game-container');
    
    // Prevent scrolling on game area
    gameContainer.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    gameBoard.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      e.preventDefault();
    }, { passive: false });
    
    gameBoard.addEventListener('touchend', (e) => {
      if (this.gameOver) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      
      const minSwipeDistance = 30;
      
      let moved = false;
      
      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            moved = this.moveRight();
          } else {
            moved = this.moveLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            moved = this.moveDown();
          } else {
            moved = this.moveUp();
          }
        }
      }
      
      if (moved) {
        this.afterMove();
      }
      
      e.preventDefault();
    }, { passive: false });
    
    // New game button
    document.getElementById('new-game-btn').addEventListener('click', () => {
      this.init();
    });
    
    // Try again button (game over overlay)
    document.getElementById('try-again-btn').addEventListener('click', () => {
      document.getElementById('game-over-overlay').classList.remove('show');
      this.init();
    });
    
    // Continue button (win overlay)
    document.getElementById('continue-btn').addEventListener('click', () => {
      document.getElementById('win-overlay').classList.remove('show');
    });
    
    // Language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        i18n.switchLanguage(lang);
      });
    });
  },
  
  /**
   * Actions to perform after a successful move
   */
  afterMove() {
    this.addRandomTile();
    this.updateUI();
    
    // Check for win condition (2048 tile)
    if (!this.won && this.has2048()) {
      this.won = true;
      setTimeout(() => {
        // Re-check win state in case game was restarted during delay
        if (this.won) {
          document.getElementById('win-overlay').classList.add('show');
        }
      }, 300);
    }
    
    // Check for game over
    if (this.isGameOver()) {
      this.gameOver = true;
      setTimeout(() => {
        // Re-check game over state in case game was restarted during delay
        if (this.gameOver) {
          document.getElementById('game-over-overlay').classList.add('show');
        }
      }, 300);
    }
  },
  
  /**
   * Add a random tile (2 or 4) to an empty cell
   */
  addRandomTile() {
    const emptyCells = [];
    
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // 90% chance of 2, 10% chance of 4
      this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  },
  
  /**
   * Move tiles left
   */
  moveLeft() {
    let moved = false;
    
    for (let i = 0; i < this.gridSize; i++) {
      const row = this.grid[i];
      const newRow = this.slideAndMerge(row);
      
      if (JSON.stringify(row) !== JSON.stringify(newRow)) {
        moved = true;
      }
      
      this.grid[i] = newRow;
    }
    
    return moved;
  },
  
  /**
   * Move tiles right
   */
  moveRight() {
    let moved = false;
    
    for (let i = 0; i < this.gridSize; i++) {
      const row = this.grid[i];
      const reversedRow = row.slice().reverse();
      const newRow = this.slideAndMerge(reversedRow).reverse();
      
      if (JSON.stringify(row) !== JSON.stringify(newRow)) {
        moved = true;
      }
      
      this.grid[i] = newRow;
    }
    
    return moved;
  },
  
  /**
   * Move tiles up
   */
  moveUp() {
    let moved = false;
    
    for (let j = 0; j < this.gridSize; j++) {
      const column = [];
      for (let i = 0; i < this.gridSize; i++) {
        column.push(this.grid[i][j]);
      }
      
      const newColumn = this.slideAndMerge(column);
      
      if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
        moved = true;
      }
      
      for (let i = 0; i < this.gridSize; i++) {
        this.grid[i][j] = newColumn[i];
      }
    }
    
    return moved;
  },
  
  /**
   * Move tiles down
   */
  moveDown() {
    let moved = false;
    
    for (let j = 0; j < this.gridSize; j++) {
      const column = [];
      for (let i = 0; i < this.gridSize; i++) {
        column.push(this.grid[i][j]);
      }
      
      const reversedColumn = column.slice().reverse();
      const newColumn = this.slideAndMerge(reversedColumn).reverse();
      
      if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
        moved = true;
      }
      
      for (let i = 0; i < this.gridSize; i++) {
        this.grid[i][j] = newColumn[i];
      }
    }
    
    return moved;
  },
  
  /**
   * Slide and merge tiles in a line (core merging logic)
   * @param {Array} line - Array of tile values
   * @returns {Array} New line after sliding and merging
   */
  slideAndMerge(line) {
    // Remove zeros
    let newLine = line.filter(val => val !== 0);
    
    // Merge adjacent equal tiles
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine[i + 1] = 0;
      }
    }
    
    // Remove zeros again after merging
    newLine = newLine.filter(val => val !== 0);
    
    // Pad with zeros to maintain grid size
    while (newLine.length < this.gridSize) {
      newLine.push(0);
    }
    
    return newLine;
  },
  
  /**
   * Check if the grid has a 2048 tile
   */
  has2048() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  },
  
  /**
   * Check if game is over (no valid moves left)
   */
  isGameOver() {
    // Check for empty cells
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] === 0) {
          return false;
        }
      }
    }
    
    // Check for possible merges horizontally
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize - 1; j++) {
        if (this.grid[i][j] === this.grid[i][j + 1]) {
          return false;
        }
      }
    }
    
    // Check for possible merges vertically
    for (let i = 0; i < this.gridSize - 1; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] === this.grid[i + 1][j]) {
          return false;
        }
      }
    }
    
    return true;
  },
  
  /**
   * Update the UI (render grid and scores)
   */
  updateUI() {
    // Update best score
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('bestScore', this.bestScore);
    }
    
    // Update score displays
    document.getElementById('current-score').textContent = this.score;
    document.getElementById('best-score').textContent = this.bestScore;
    
    // Render grid
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const tileValue = this.grid[i][j];
        const tile = document.createElement('div');
        tile.className = 'tile';
        
        if (tileValue > 0) {
          tile.classList.add('tile-' + tileValue);
          tile.textContent = tileValue;
        }
        
        gameBoard.appendChild(tile);
      }
    }
  }
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
  Game.init();
});
