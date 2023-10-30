class TicTacToe {

    constructor() {
      this.ROWS = 3;
      this.COLS = 3;
      this.currentPlayer = 'X';
      this.board = this.createBoard();
      this.setupEventListeners();
    }

    createBoard() {
      const board = new Array(this.ROWS);
      for (let i = 0; i < this.ROWS; i++) {
          board[i] = new Array(this.COLS).fill('');
      }
      return board;
    }

    updatePlayerTurn() {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      $("#playerX, #playerO").toggleClass("activate");
    }

    hasTie(board) {
      for (let i = 0; i < this.ROWS; i++) {
        if (board[i].includes('')) {
          return false;
        }
      }
      return true;
    }

    checkWinner(player, board) {
      for (let i = 0; i <   this.ROWS; i++) {
          if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
              return true;
          }
      }
  
      for (let j = 0; j < this.COLS; j++) {
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

  minimax(board, depth, isMaximizing) {

    let bestScore = isMaximizing == true ? -Infinity: Infinity;

    if (this.hasTie(board) || depth == 0) {
        return 0;
    } 
    else if (this.checkWinner('X', board)) {
        return 1;
    } 
    else if (this.checkWinner('O', board)) {
        return -1;
    }
  
    if (isMaximizing) {
        for (let i = 0; i < this.ROWS; i++) {
          for (let j = 0; j < this.COLS; j++) {
            if (board[i][j] === '') {
              let deepBoard = JSON.parse(JSON.stringify(board)); 
              deepBoard[i][j] = 'X';
              let score = this.minimax(deepBoard, depth-1, false);
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      }
      else {
        for (let i = 0; i < this.ROWS; i++) {
          for (let j = 0; j < this.COLS; j++) {
            if (board[i][j] === '') {
              let deepBoard = JSON.parse(JSON.stringify(board)); 
              deepBoard[i][j] = 'O';
              let score = this.minimax(deepBoard, depth-1, true);
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
  }
    
  getMove(board, depth, isMaximizing) {
    let bestScore = isMaximizing == true ? -Infinity: Infinity;
    let bestMove = null;
    console.log(bestScore);
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        if (board[i][j] === '') {
          let deepBoard = JSON.parse(JSON.stringify(board)); 
          deepBoard[i][j] = this.currentPlayer;

          let score = this.minimax(deepBoard, depth, !isMaximizing);
          
          if (isMaximizing && score > bestScore || !isMaximizing && score < bestScore) {
            console.log('sco', score); 
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
    return bestMove;
  }
  
  endGame() {
    if (this.checkWinner(this.currentPlayer, this.board)) {
      $("#tictac_board td").off("click");
      alert(`Jogador ${this.currentPlayer} venceu!!!!`);
      return true;
    } 
    else if (this.hasTie(this.board)) {
      $("#tictac_board td").off("click");
      alert(`Empate`);
      return true;
    }
    return false;
  }

  makeMove(tdCell, posY, posX) {
    this.board[posY][posX] = this.currentPlayer;
    tdCell.text(this.currentPlayer);
  }

  playAgainstFriend(tdCell, trPosY, tdPosX) {
    this.makeMove(tdCell, trPosY, tdPosX);

    if (!this.endGame()) {
      this.updatePlayerTurn();
    }
  }

  playerVsAI(tdCell, trPosY, tdPosX, game_level) {
    this.makeMove(tdCell, trPosY, tdPosX);

    if (!this.endGame()) {
        this.updatePlayerTurn();

        let move = this.getMove(this.board, Number(game_level), false);
        const cellIA = $("#tictac_board tr").eq(move[0]).find("td").eq(move[1]);

        this.makeMove(cellIA, move[0], move[1]);

        if (!this.endGame()) {
            this.updatePlayerTurn();
        }
    }
}

  AIVsPlayer(tdCell, trPosY, tdPosX, game_level) {
    let move = this.getMove(this.board, Number(game_level), true);
    const cellIA = $("#tictac_board tr").eq(move[0]).find("td").eq(move[1]);

    this.makeMove(cellIA, move[0], move[1]);

    if (!this.endGame()) {
      this.updatePlayerTurn();
      this.makeMove(tdCell, trPosY, tdPosX);

      if (!this.endGame()) {
        this.updatePlayerTurn();
      }
    }
  }

  startGame(event) {
    const game_level = $("#game_level").val();
    const tdCell = $(event.target);
    const tdPosX = tdCell.index();
    const trPosY = tdCell.parent().index();

    if (this.board[trPosY][tdPosX] === '') {
      if (game_level === "vsFriend") {
        this.playAgainstFriend(tdCell, trPosY, tdPosX);
      } 
      else if ($("#playerX").hasClass("activate")) {
        this.playerVsAI(tdCell, trPosY, tdPosX, game_level);
      } 
      else {
        this.AIVsPlayer(tdCell, trPosY, tdPosX, game_level);
      }
    }
  }

  setupEventListeners() {
    $(document).ready(() => {
      
      $("#playerX").on("click", () => {
        if ($("#playerO").hasClass("activate")) {
          $("#playerX, #playerO").toggleClass("activate");
        }
      });

      $("#playerO").on("click", () => {
        if ($("#playerX").hasClass("activate")) {
          $("#playerX, #playerO").toggleClass("activate");
        }
      });

      $("#tictac_board td").on("click", (event) => {
        $("#playerX, #playerO").off("click");
        $("#game_level").prop("disabled", true);
        
        this.startGame(event)
      }); 
    });
  }
}

const game = new TicTacToe(3, 3);

