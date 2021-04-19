/* File which containt all of our constants in a single place. */

// Might be better to export a single object with all the constants inside, avoids havig to import 10 different constants in all files, instead only 1 object
export const boardSize = 100;
export const dotSize = 5;
export const player_length = 8;
export const player_height = 2;
export const block_length = 4;
export const block_height = 2;
export const ballStart = [Math.floor(boardSize / 2), Math.floor(boardSize / 3) * 2]
export const playerStart1 = [Math.floor(boardSize / 4) - Math.floor(player_length / 2), boardSize - (player_height + 1)]
export const playerStart2 = [Math.floor(Math.floor(boardSize / 4) * 3) + 1 - Math.floor(player_length / 2), boardSize - (player_height + 1)]
