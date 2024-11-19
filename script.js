// Initial render
DisplayController.render();

// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const updateBoard = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateBoard, resetBoard };
})();

// Player Factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        console.log("Starting game with players:", player1Name, player2Name);
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.render();
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playRound = (index) => {
        if (gameOver) return;

        if (Gameboard.updateBoard(index, players[currentPlayerIndex].mark)) {
            DisplayController.render();
            if (checkWinner()) {
                DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
                gameOver = true;
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                DisplayController.setMessage("It's a tie!");
                gameOver = true;
            } else {
                currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
                DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
            }
        }
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    return { startGame, playRound };
})();

// Display Controller Module
const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const messageDiv = document.getElementById("message");

    const render = () => {
        gameboardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.textContent = mark || '';
            cell.classList.add("cell");
            cell.addEventListener("click", () => {
                GameController.playRound(index);
            });
            gameboardDiv.appendChild(cell);
        });
    };

    const setMessage = (message) => {
        messageDiv.textContent = message;
    };

    document.getElementById("startGame").addEventListener("click", () => {
        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;
        if (player1Name && player2Name) {
            GameController.startGame(player1Name, player2Name);
        } else {
            setMessage("Please enter names for both players.");
        }
    });

    document.getElementById("restartGame").addEventListener("click", () => {
        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;
        if (player1Name && player2Name) {
            GameController.startGame(player1Name, player2Name);
        } else {
            setMessage("Please enter names for both players.");
        }
    });

    return { render, setMessage };
})();

