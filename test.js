function createBoard() {
    const board = new Array(3);
    for (let i = 0; i < 3; i++) {
        board[i] = new Array(3).fill('');
    }
    return board;
}

function has_tie(board) {

    for (let i = 0; i < 3; i++) {
      if (board[i].includes('')) {
        return false;
      }
    }
    return true;
  }

function checkWinner(player, board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
    }

    for (let j = 0; j < 3; j++) {
        if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
            return true;
        }
    }

    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }

    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }
    return false;
}


function minimax(board, isMaximizing) {
   
    if (has_tie(board)) {
        return 0;
    } else if (checkWinner('X', board)) {
        return 1;
    } else if (checkWinner('O', board)) {
        return -1;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
    
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
              let tab = JSON.parse(JSON.stringify(board)); 
              tab[i][j] = 'X';
              let score = minimax(tab, false);
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      }
      else {
        let bestScore = Infinity;
    
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
              let tab = JSON.parse(JSON.stringify(board)); 
              tab[i][j] = 'O';
              let score = minimax(tab, true);
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
}

function get_move(board) {
    let bestScore = -Infinity;
    let bestMove = null;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          let tab = JSON.parse(JSON.stringify(board)); 
          tab[i][j] = 'X';
          let score = minimax(tab, false);

          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
  
    return bestMove;
  }

const board = createBoard()

console.log(get_move(board));