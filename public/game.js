const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const boardSize = 8;
let board = [];
let selectedCell = null;
let score = 0;

// Initialize the game board
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    board = [];

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const color = getRandomColor();
            row.push(color);
            const cell = document.createElement('div');
            cell.classList.add('cell', color);
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
        board.push(row);
    }

    // Check for matches after creating the board
    while (checkForMatches()) {
        // Keep checking for matches until there are none
        dropCandies(); // Drop candies after removing matches
    }
}

// Get a random color
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Handle cell click
function handleCellClick(event) {
    const row = event.target.getAttribute('data-row');
    const col = event.target.getAttribute('data-col');

    if (selectedCell) {
        swapCells(selectedCell, { row, col });
        selectedCell = null;
    } else {
        selectedCell = { row, col };
    }
}

// Swap two cells and check for matches
function swapCells(selectedCell, targetCell) {
    const tempColor = board[selectedCell.row][selectedCell.col];
    board[selectedCell.row][selectedCell.col] = board[targetCell.row][targetCell.col];
    board[targetCell.row][targetCell.col] = tempColor;

    updateBoard();
    if (!checkForMatches()) {
        // Swap back if no match
        board[targetCell.row][targetCell.col] = board[selectedCell.row][selectedCell.col];
        board[selectedCell.row][selectedCell.col] = tempColor;
        updateBoard();
    }
}

// Check for matches in the board
function checkForMatches() {
    let hasMatch = false;

    // Check for horizontal matches
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize - 2; j++) {
            if (board[i][j] && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
                hasMatch = true;
                removeMatchedCandies(i, j, 'horizontal');
            }
        }
    }

    // Check vertical matches
    for (let j = 0; j < boardSize; j++) {
        for (let i = 0; i < boardSize - 2; i++) {
            if (board[i][j] && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
                hasMatch = true;
                removeMatchedCandies(i, j, 'vertical');
            }
        }
    }

    return hasMatch;
}

// Remove matched candies and update the board
function removeMatchedCandies(row, col, direction) {
    if (direction === 'horizontal') {
        for (let j = 0; j < 3; j++) {
            board[row][col + j] = null; // Remove candy
        }
        score += 10; // Increment score
    } else {
        for (let i = 0; i < 3; i++) {
            board[row + i][col] = null; // Remove candy
        }
        score += 10; // Increment score
    }
}

// Drop candies to fill empty spaces
function dropCandies() {
    for (let j = 0; j < boardSize; j++) {
        for (let i = boardSize - 1; i >= 0; i--) {
            if (board[i][j] === null) {
                for (let k = i - 1; k >= 0; k--) {
                    if (board[k][j] !== null) {
                        board[i][j] = board[k][j];
                        board[k][j] = null;
                        break;
                    }
                }
            }
        }
    }
    fillEmptyCells(); // Fill empty cells with new candies
}

// Fill empty cells with new candies
function fillEmptyCells() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === null) {
                board[i][j] = getRandomColor(); // Generate new candy
            }
        }
    }
    updateBoard(); // Update the UI after filling
}

// Update the UI to reflect the current board state
function updateBoard() {
    const gameBoard = document.getElementById('game-board');
    const cells = gameBoard.getElementsByClassName('cell');

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const index = i * boardSize + j;
            cells[index].className = 'cell ' + (board[i][j] || 'empty');
        }
    }

    document.getElementById('score').innerText = 'Score: ' + score; // Update score display
}

// Initialize the game
createBoard();