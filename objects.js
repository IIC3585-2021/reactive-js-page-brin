import { playerStart1, playerStart2, ballStart } from './constants.js';

// State of the game
export const state = {
  player1: {x:playerStart1[0] , y:playerStart1[1]},
  player2: {x:playerStart2[0] , y:playerStart2[1]},
  ball: {x:ballStart[0] , y:ballStart[1], velX:1, velY:1},
  score: 0,
  isGameOver: false,
  blocks: [],
}

export const resetState = (state) => {
  state.player1 = {x:playerStart1[0] , y:playerStart1[1]}
  state.player2 = {x:playerStart2[0] , y:playerStart2[1]}
  state.ball = {x:ballStart[0] , y:ballStart[1], velX:1, velY:1}
  state.score = 0
  state.isGameOver = false,
  state.blocks = []
}