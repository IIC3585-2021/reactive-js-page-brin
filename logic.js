import { block_length, block_height, player_length, boardSize } from './constants.js';
import { state } from './objects.js';


export const player_collision = (ball, player) => {
  const row = player.y;
  if (ball.y == row - 1 && ball.velY == 1) {
    if (player.x <= ball.x && ball.x <= player.x + player_length) return true;
  }
  return false;
}

export const player_corner_collision = (ball, player) => {
  const row = player.y;
  if (ball.y == row - 1 && ball.velY == 1) {
    if ((player.x - 1 == ball.x && ball.velX == 1) || (player.x + player_length == ball.x && ball.velX == -1)) return true;
  }
  return false;
}

export const vertical_collision = (ball) => {
  if (ball.y == 0 && ball.velY == -1) {
    return true;
  }
  return false;
}

export const horizontal_collision = (ball) => {
  if ((ball.x == boardSize - 1 && ball.velX == 1) || (ball.x == 0 && ball.velX == -1)) {
    return true;
  }
  return false;
}

export const upper_block_collision = (ball, block) => {
  const upper_row = block.y;
  if (ball.y == upper_row - 1 && ball.velY == 1) {
    if (block.x <= ball.x && ball.x <= block.x + block_length - 1) return true;
  }
  return false;
}

export const lower_block_collision = (ball, block) => {
  const lower_row = block.y + block_height - 1;
  if (ball.y == lower_row + 1 && ball.velY == -1) {
    if (block.x <= ball.x && ball.x <= block.x + block_length - 1) return true;
  }
  return false;
}

export const right_block_collision = (ball, block) => {
  const right_column = block.x + block_length - 1;
  if (ball.x == right_column + 1 && ball.velX == -1) {
    if (block.y <= ball.y && ball.y <= block.y + block_height - 1) return true;
  }
  return false;
}

export const left_block_collision = (ball, block) => {
  const left_column = block.x;
  if (ball.x == left_column - 1 && ball.velX == 1) {
    if (block.y <= ball.y && ball.y <= block.y + block_height - 1) return true;
  }
  return false;
}

export const corner_block_collision = (ball, block) => {
  if (ball.x == block.x - 1 && ball.y == block.y - 1 && ball.velX == 1 && ball.velY == 1) {
    return true;
  } else if (ball.x == block.x - 1 && ball.y == block.y + block_height && ball.velX == 1 && ball.velY == -1) {
    return true;
  } else if (ball.x == block.x + block_length && ball.y == block.y - 1 && ball.velX == -1 && ball.velY == 1) {
    return true;
  } else if (ball.x == block.x + block_length && ball.y == block.y + block_height && ball.velX == -1 && ball.velY == -1){
    return true;
  } else {
    return false;
  }
}

export const collision_block = (ball, block) => {
  // eje x
  var type = undefined;
  if (upper_block_collision(ball, block) || lower_block_collision(ball, block)) {
    type = 'h';
  }
  else if (right_block_collision(ball, block) || left_block_collision(ball, block)) {
    type = 'v';
  }
  else if (corner_block_collision(ball, block)) {
    type = 'hv';
  }
  return type;
}

export const check_block_collisions = (board, ball, blocks) => {
  for(var i = 0; i < blocks.length; i++) {
    var collision = collision_block(ball, blocks[i]);
    if (collision) {
      board.deleteBlock(blocks[i].x, blocks[i].y);
      blocks.splice(i, 1);
      return collision;
    }
  };
}

export const check_players_collisions = (ball, player1, player2) => {
  if (player_collision(ball, player1) || player_collision(ball, player2)) {
    return 'h';
  }
  else if (player_corner_collision(ball, player1) || player_corner_collision(ball, player2)) {
    return 'hv';
  }
  return null;
}

export const check_border_collisions = (ball) => {
  if (vertical_collision(ball)) {
    if (horizontal_collision(ball)) {
      return 'hv';
    }
    return 'h';
  } else if (horizontal_collision(ball)) {
    return 'v';
  }
  return null;
}

export const check_collisions = (state) => {
  var type = check_block_collisions(state.board, state.ball, state.blocks);
  if (type) {
    state.score += 1;
    document.getElementById('score').innerHTML = state.score;
    return type;
  } else {
    type = check_players_collisions(state.ball, state.player1, state.player2);
    if (type) {
      return type;
    } else {
      type = check_border_collisions(state.ball);
      if (type) {
        return type;
      } else {
        return null;
      }
    }
  }
}

export const playerInBoard = ( player, side ) => {
  if (player === 1) {
    if (side === 'l') {
      return !(state.player1.x - 1 < 0)
    }
    return !(state.player1.x+1 > boardSize || state.player1.x + player_length + 1 > state.player2.x)
  }
  else if (player === 2) {
    if (side === 'l') {
      return !(state.player2.x-1 < 0 || state.player2.x-1 < state.player1.x + player_length)
    }
    return !(state.player2.x + 1 + player_length > boardSize)
  }
}

export const random = (first, last, step) => {
  var r = Math.floor(Math.random()*(last - first)/step);
  return r * step + first;
}

export const inList = ( p ) => {
  for ( var i = 0; i < state.blocks.length; i++ ) {
       if ( state.blocks[i].x == p.x && state.blocks[i].y == p.y ) return true;
  }
  return false;
}

// Blocks are not one point, they have block_length and block_height
export const makePoints = ( n, minX, maxX, minY, maxY ) => {
  while ( state.blocks.length < n ) {
    var p = {
      x: random(minX, maxX, block_length + 3), 
      y: random(minY, maxY, block_length + 3)
    };
    if (!inList(p)) state.blocks.push(p);
  }
}


// Bounce when ball hits the block
export const bounce = ( type ) => {
  // if hit is horizontal: roof (x=0), players, block top/botom
  if (type === 'h') state.ball.velY *= -1;
  // if hit is vertical: walls (y=0,y=boardSize), block sides
  else if (type === 'v') state.ball.velX *= -1;
  // if hit in corner (x=0 y=0, x=0 y=boardSize)
  else if (type === 'hv') {
    state.ball.velX *= -1;
    state.ball.velY *= -1;
  }
}

// Move the ball
export const moveBall = () => {
  var hit = check_collisions(state);
  bounce(hit);
  state.ball.x += state.ball.velX;
  state.ball.y += state.ball.velY;
  // repaint
}
