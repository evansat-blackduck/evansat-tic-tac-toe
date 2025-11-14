// main.js
let gameState = {
  board: [],
  currentPlayer: 'X',
  gridSize: 3,
  gameOver: false,
  playerSymbol: 'X',
  computerSymbol: 'O'
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('root');
  if (app) {
    app.innerHTML = `
      <h1>Tic-Tac-Toe</h1>
      <div id="game-controls">
        <label for="grid-size">Grid Size:</label>
        <select id="grid-size">
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
        <label for="player-symbol">Play as:</label>
        <select id="player-symbol">
          <option value="X">X</option>
          <option value="O">O</option>
        </select>
        <button id="start-game">Start Game</button>
        <button id="reset-game">Reset Game</button>
        <button id="save-game">Save Game</button>
        <button id="load-game">Load Game</button>
      </div>
      <div id="game-board"></div>
      <div id="game-status"></div>
    `;
    initGame();
  }
});

function initGame() {
  const startButton = document.getElementById('start-game');
  const resetButton = document.getElementById('reset-game');
  const saveButton = document.getElementById('save-game');
  const loadButton = document.getElementById('load-game');
  const gridSizeSelect = document.getElementById('grid-size');
  const playerSymbolSelect = document.getElementById('player-symbol');

  startButton.addEventListener('click', startNewGame);
  resetButton.addEventListener('click', resetGame);
  saveButton.addEventListener('click', saveGame);
  loadButton.addEventListener('click', loadGame);
}

function startNewGame() {
  const gridSizeSelect = document.getElementById('grid-size');
  const playerSymbolSelect = document.getElementById('player-symbol');

  gameState.gridSize = parseInt(gridSizeSelect.value);
  gameState.board = Array(gameState.gridSize * gameState.gridSize).fill(null);
  gameState.playerSymbol = playerSymbolSelect.value;
  gameState.computerSymbol = gameState.playerSymbol === 'X' ? 'O' : 'X';
  gameState.currentPlayer = 'X';
  gameState.gameOver = false;

  createGameBoard();
  updateGameStatus(`Player ${gameState.currentPlayer}'s turn`);

  if (gameState.currentPlayer === gameState.computerSymbol) {
    setTimeout(computerMove, 500);
  }
}

function resetGame() {
  startNewGame();
}

function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  gameBoard.style.display = 'grid';
  gameBoard.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
  gameBoard.style.gap = '5px';

  for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.border = '1px solid black';
    cell.style.height = '50px';
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.fontSize = '24px';
    cell.style.cursor = 'pointer';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

function handleCellClick(event) {
  if (gameState.gameOver || gameState.currentPlayer !== gameState.playerSymbol) return;

  const cell = event.target;
  const index = parseInt(cell.dataset.index);

  if (gameState.board[index] === null) {
    makeMove(index);

    if (!gameState.gameOver) {
      setTimeout(computerMove, 500);
    }
  }
}

function makeMove(index) {
  gameState.board[index] = gameState.currentPlayer;
  document.querySelector(`.cell[data-index="${index}"]`).textContent = gameState.currentPlayer;
  
  if (checkWinCondition(index)) {
    gameState.gameOver = true;
    updateGameStatus(`Player ${gameState.currentPlayer} wins!`);
  } else if (gameState.board.every(cell => cell !== null)) {
    gameState.gameOver = true;
    updateGameStatus("It's a draw!");
  } else {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus(`Player ${gameState.currentPlayer}'s turn`);
  }
}

function computerMove() {
  if (gameState.gameOver) return;

  const availableMoves = gameState.board.reduce((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  const computerMoveIndex = availableMoves[randomIndex];

  makeMove(computerMoveIndex);
}

function checkWinCondition(lastMove) {
  const row = Math.floor(lastMove / gameState.gridSize);
  const col = lastMove % gameState.gridSize;
  const player = gameState.currentPlayer;

  // Check row
  if (gameState.board.slice(row * gameState.gridSize, (row + 1) * gameState.gridSize).every(cell => cell === player)) return true;

  // Check column
  if (Array.from({length: gameState.gridSize}, (_, i) => gameState.board[i * gameState.gridSize + col]).every(cell => cell === player)) return true;

  // Check diagonals
  if (row === col && Array.from({length: gameState.gridSize}, (_, i) => gameState.board[i * gameState.gridSize + i]).every(cell => cell === player)) return true;
  if (row + col === gameState.gridSize - 1 && Array.from({length: gameState.gridSize}, (_, i) => gameState.board[i * gameState.gridSize + (gameState.gridSize - 1 - i)]).every(cell => cell === player)) return true;

  return false;
}

function updateGameStatus(message) {
  const gameStatus = document.getElementById('game-status');
  gameStatus.textContent = message;
}

function saveGame() {
  localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
  updateGameStatus('Game saved successfully!');
}

function loadGame() {
  const savedGame = localStorage.getItem('ticTacToeGame');
  if (savedGame) {
    gameState = JSON.parse(savedGame);
    createGameBoard();
    updateGameBoard();
    updateGameStatus(`Game loaded. Player ${gameState.currentPlayer}'s turn`);
  } else {
    updateGameStatus('No saved game found.');
  }
}

function updateGameBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.textContent = gameState.board[index] || '';
  });
}