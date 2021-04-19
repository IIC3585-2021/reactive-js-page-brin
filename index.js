import { state, resetState } from './objects.js';
import Board from './board.js';
import { boardSize } from './constants.js'
import { playerInBoard, makePoints, moveBall } from './logic.js';

const ourBoard = new Board();
ourBoard.initBoard();

state.board = ourBoard;

document.getElementById('score').innerHTML = state.score
makePoints(Math.floor(boardSize / 3), 10, boardSize - 10, 10, Math.floor(boardSize / 2));
state.blocks.forEach(item => {
  state.board.drawBlock(item.x, item.y);
})

// Get key input - a and d / Left and Right
var keyDowns = Rx.Observable.fromEvent(document, 'keydown');
keyDowns.subscribe(function (e) {
  if (e.key === 'a' && playerInBoard(1, 'l')) {
    state.board.updatePlayer(1, 'l');
    state.player1.x -= 1;
  }
  else if (e.key === 'd' && playerInBoard(1, 'r')) {
    state.board.updatePlayer(1, 'r');
    state.player1.x += 1;
  }

  if (e.key === 'ArrowLeft' && playerInBoard(2, 'l')) {
    state.board.updatePlayer(2, 'l');
    state.player2.x -= 1
  } else if (e.key === 'ArrowRight' && playerInBoard(2, 'r')) {
    state.board.updatePlayer(2, 'r');
    state.player2.x += 1;
  }
});



/* Making something with the buttons */
document.getElementById("start-button").onclick = function () {
  // sleep 1 seg
  const loop = Rx.Observable.interval(50);
  loop.subscribe(() => {
    if (state.blocks.length === 0 || state.ball.y + 1 === boardSize - 1) {
      document.getElementById('end').innerHTML = state.blocks.length === 0 ? 'YOU WIN!' : 'GAME OVER';
      loop.unsubscribe();
    } else {
      moveBall();
      state.board.updateBall(state.ball.x, state.ball.y);
    }
  });
};

document.getElementById("reset-button").onclick = function () {
  document.getElementById('end').innerHTML = '';
  resetState(state)
  const board = new Board()
  board.initBoard();
  state.board = board;
  document.getElementById('score').innerHTML = state.score;
  makePoints(Math.floor(boardSize / 3), 10, boardSize - 10, 10, Math.floor(boardSize / 2));
  state.blocks.forEach(item => {
    state.board.drawBlock(item.x, item.y);
  })
};
