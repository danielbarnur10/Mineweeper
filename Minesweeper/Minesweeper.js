let board = [];
let boardSize = 10;
let totalMines = 10;
let minesLeft = totalMines;
let revealedCells = 0;
let gameStarted = false;
let gameOver = false;
let timerInterval;
let startTime;
document.querySelector(".time").textContent = "⏱️"
document.querySelector(".mines").textContent = "🚩"
const StartTimer = () => {
    startTime = Date.now();
    const timer = document.querySelector(".time");
    timerInterval = setInterval(() => {
        const elaps = Math.floor((Date.now() - startTime) / 1000);
        const display = Math.min(elaps, 999).toString().padStart(3, '0');
        if (timer) timer.textContent = `⏱️: ${display}`;
    }, 1000);
}
const createCell = (amount) => {
    const gridElem = document.querySelector(".grid");
    gridElem.style.setProperty('--grid-size', boardSize);
    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {

            const element = document.createElement("button");
            element.classList.add("cell");
            // Set data-row and data-col attributes
            element.dataset.row = i;
            element.dataset.col = j;
            element.textContent = '';
            // On click
            element.addEventListener('click', function () {
                if (!gameStarted) {
                    gameStarted = true;
                    BoardInit();
                    StartTimer();
                    MinesLeft();
                }
                if (this.classList.contains('flag')) return; // Don't reveal if flagged
                if (board[i][j].neighborMines === 0) {
                    openContinuesly(i,j);
                }
                this.classList.add('revealed');
                if (this.classList.contains('mine')) {
                    //show the mines and stop the count the 
                    ShowMines();
                    gameOver = true;
                    StopTheGame();
                }
                else {
                    if (board[i][j].neighborMines > 0) {
                        this.textContent = board[i][j].neighborMines;
                    }else{
                        
                    }

                }
                // Call a function to determine the mine or number.
            });
            // On context menu
            element.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if (this.classList.contains('flag')) {
                    this.classList.remove('flag');
                    minesLeft++;
                } else {
                    this.classList.add('flag');
                    minesLeft--;

                }
                MinesLeft();
            });

            gridElem.appendChild(element);
        }
    }
}

const resetBtn = document.querySelector(".resetBtn");
resetBtn.addEventListener('click', () => {
    location.reload();
})
const InsertObject = () => {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                flagged: false,
                neighborMines: 0,
            };
        }
    }
}
const insertMines = () => {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (totalMines > 0) {
                board[i][j].isMine = true;
                totalMines--;
            } else return;
        }
    }
}

function fisherYatesShuffle2D(matrix) {
    const flat = matrix.flat();
    for (let i = flat.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    // Rebuild the 2D matrix from the shuffled flat array
    let idx = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (flat[idx].isMine) {
                const cell = document.querySelector
                    (`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.add("mine");
            }
            matrix[i][j] = flat[idx++];
        }
    }
    return matrix;
}
const FillNumbers = () => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                // Top
                if (i > 0) board[i - 1][j].neighborMines++;
                // Top-left
                if (i > 0 && j > 0) board[i - 1][j - 1].neighborMines++;
                // Top-right
                if (i > 0 && j < boardSize - 1) board[i - 1][j + 1].neighborMines++;
                // Left
                if (j > 0) board[i][j - 1].neighborMines++;
                // Right
                if (j < boardSize - 1) board[i][j + 1].neighborMines++;
                // Bottom
                if (i < boardSize - 1) board[i + 1][j].neighborMines++;
                // Bottom-left
                if (i < boardSize - 1 && j > 0) board[i + 1][j - 1].neighborMines++;
                // Bottom-right
                if (i < boardSize - 1 && j < boardSize - 1) board[i + 1][j + 1].neighborMines++;
            }
        }
    }
}
const openContinuesly = (i, j) => {
    // Base case: out of bounds or already revealed
    if (i < 0 || i >= boardSize || j < 0 || j >= boardSize) return;
    const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
    if (!cell || cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    if (board[i][j].neighborMines > 0) {
        cell.textContent = board[i][j].neighborMines;
        return;
    }
    // Recursively open all 8 neighbors
    openContinuesly(i - 1, j);     // Top
    openContinuesly(i + 1, j);     // Bottom
    openContinuesly(i, j - 1);     // Left
    openContinuesly(i, j + 1);     // Right
    openContinuesly(i - 1, j - 1); // Top-left
    openContinuesly(i - 1, j + 1); // Top-right
    openContinuesly(i + 1, j - 1); // Bottom-left
    openContinuesly(i + 1, j + 1); // Bottom-right
}
const MinesLeft = () => {
    document.querySelector(".mines").textContent = `🚩${minesLeft}`;

}
const ShowMines = () => {
    const mines = document.querySelectorAll(".mine");
    mines.forEach(x => x.classList.add("revealed"));
}
const StopTheGame = () => {
    clearInterval(timerInterval);
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.setAttribute("disabled", true);
    })
}
const BoardInit = () => {

    InsertObject();
    insertMines();
    board = fisherYatesShuffle2D(board);
    FillNumbers();

}

createCell(boardSize);
