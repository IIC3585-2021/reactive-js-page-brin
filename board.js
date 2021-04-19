/* Cada "punto" del juego será de 5x5 pixeles (el borde es de 5 pixeles). El tablero tiene 800x800 pixeles, por lo tanto tiene 160 posiciones posibles vertical y horizontalmente. */

import { boardSize, playerStart1, playerStart2, ballStart, player_length, player_height, block_length, block_height } from './constants.js'


export default class Board {
  static size = boardSize;
  static playerStart1 = [...playerStart1];
  static playerStart2 = [...playerStart2];
  static ballStart = ballStart;
  #boardArray;
  #container;
  #playerPos;
  #ballPos;

  constructor() {
    this.#boardArray = Array(Board.size).fill(Array(Board.size).fill(undefined));
    this.#container = document.getElementById('board-container');
    this.#playerPos = [Board.playerStart1, Board.playerStart2]
    this.#ballPos = Board.ballStart;
  }

  getElement(x, y) {
    return this.#boardArray[y][x];
  }

  paintDot(x, y, color) {
    const element = this.getElement(x, y);
    element.className = color ? `dot ${color}` : 'dot';
  }

  initBoard() {
    /* if there is a board already, delete it */
    while (this.#container.hasChildNodes()) {
      this.#container.removeChild(this.#container.firstChild);
    }

    /* Create the new div for the board */
    const board = document.createElement('div');
    this.#container.appendChild(board);
    board.id = 'board';
    board.style.display = 'grid';
    board.style.gridTemplateRows = `repeat(${Board.size}, auto)`;
    board.style.gridTemplateColumns = `repeat(${Board.size}, auto)`;

    /* Populate the board with divs, and map them into boardArray */
    this.#boardArray = this.#boardArray.map(row => {
      return row.map(col => {
        const newElem = document.createElement('div');
        newElem.className = 'dot';
        board.appendChild(newElem)
        return newElem;
      })
    })

    /* Init players and ball */
    this.updateBall(...Board.ballStart)

    this.#playerPos = [[...Board.playerStart1], [...Board.playerStart2]] 

    for (let i = 0; i < player_length; i++) {
      for (let j = 0; j < player_height; j++) {
        this.paintDot(this.#playerPos[0][0] + i, this.#playerPos[0][1] + j, 'cadet');
        this.paintDot(this.#playerPos[1][0] + i, this.#playerPos[1][1] + j, 'cadet');
      }
    }
  }

  /* player {int}: the number of the player, 1 or 2
     direction {str}: 'r' or 'l', indicating right or left in which the player should move. */
  updatePlayer (player, direction) {
    // these could be used directly, but it makes the code easier to read
    const x = this.#playerPos[player - 1][0];
    const y = this.#playerPos[player - 1][1];

    /* Delete previous player */
    for (let i = 0; i < player_height; i++) {
      if (direction === 'r') {
        this.paintDot(x, y + i, false);
      } else if (direction === 'l') {
        this.paintDot(x + player_length - 1, y + i, false);
      } else {
        throw "Direction not recognized, try again with 'r' or 'l'.";
      }
    }

    /* Draw new player */
    for (let i = 0; i < player_height; i++) {
      if (direction === 'r') {
        this.paintDot(x + player_length, y + i, 'cadet');
      } else if (direction === 'l') {
        this.paintDot(x - 1, y + i, 'cadet')
      } else {
        throw "Direction not recognized, try again with 'r' or 'l'.";
      }
    }

    /* Update player pos */
    this.#playerPos[player - 1][0] = direction === 'r' ? this.#playerPos[player - 1][0] + 1 : this.#playerPos[player - 1][0] - 1;
  }

  updateBall (x, y) {
    /* Delete previous ball */
    this.paintDot(this.#ballPos[0], this.#ballPos[1], false)

    /* Draw new ball */
    this.paintDot(x, y, 'maroon');

    /* Update ball pos */
    this.#ballPos = [x, y];
  }

  drawBlock (x, y) {
    for (let i = 0; i < block_length; i++) {
      for (let j = 0; j < block_height; j++) {
        this.paintDot(x + i, y + j, 'teal');
      }
    }
  }

  deleteBlock (x, y) {
    for (let i = 0; i < block_length; i++) {
      for (let j = 0; j < block_height; j++) {
        this.paintDot(x + i, y + j, false);
      }
    }
  }
}
