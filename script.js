let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let vsComputer = true;

function startGame(mode) {
  vsComputer = mode === 'computer';
  document.getElementById("mode-selection").style.display = "none";
  document.getElementById("game-board").style.display = "grid";
  document.getElementById("reset-button").style.display = "block";
  resetGame();
}

function handleClick(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].innerText = currentPlayer;
    checkWin();

    if (!gameOver) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (vsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
      }
    }
  }
}

function computerMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = 'O';
  document.getElementsByClassName('cell')[move].innerText = 'O';
  checkWin();
  currentPlayer = 'X';
}

function minimax(newBoard, depth, isMaximizing) {
  const scores = {
    'X': -10,
    'O': 10,
    'tie': 0
  };

  let result = getWinner(newBoard);
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function getWinner(b) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let combo of winCombos) {
    let [a, b1, c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }

  if (!b.includes("")) return 'tie';
  return null;
}

function checkWin() {
  let winner = getWinner(board);
  if (winner) {
    gameOver = true;
    setTimeout(() => {
      alert(winner === 'tie' ? "It's a draw!" : `${winner} wins!`);
    }, 300);
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  currentPlayer = "X";

  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
  }

  if (vsComputer && currentPlayer === "O") {
    computerMove();
  }
}
