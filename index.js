import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

let Maze = [
  '00000000000000000000',
  '02111111000011111120',
  '01010101111110101010',
  '01110100000000101110',
  '01000111111111100010',
  '011111100EE001111110',
  '00000100EEGE00100000',
  '01111110000001111110',
  '010001111P1111100010',
  '01011100000000111010',
  '02110111111111101120',
  '00000000000000000000',
]
let imageAdress = 'https://raw.githubusercontent.com/szendy1/pac-man-mp/master/img/';

let tile = 32;
let cWidth = tile * Maze[0].length;
let cHeight = tile * Maze.length;
let dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
let tiles = {
  pTiles: [],
  gTiles: [],
  gReversedTiles: [],
  pDeathTiles: [],
  lifeTile: null,
  pillTile: null,
  powerPillTile: null,
}
let gameData = {
  canvas: null,
  ctx: null,
  gameStarted: false,
  gamePaused: false,
  pacman: null,
  ghost: null,
  score: 0,
  timer: null,
  pillMaze: null,
  gameReversed: false,
  lives: 0,

};


class Canvas extends React.Component {
  componentDidMount() {
    gameData.canvas = document.getElementById('canvas')
    gameData.ctx = canvas.getContext("2d")
    initGame();
    canvas.onclick = function () { pauseGame(); };
  }

  render() {
    return (
      <div>
        <canvas id="canvas" width={cWidth} height={cHeight} />
      </div>
    )
  }
}

document.addEventListener('keydown', function (event) {
  if (gameData.gameStarted && !gameData.gamePaused) {
    switch (event.which) {
      case 37: gameData.pacman.nextDir = 2; break; //Left key
      case 38: gameData.pacman.nextDir = 3; break; //Up key
      case 39: gameData.pacman.nextDir = 0; break; //Right key
      case 40: gameData.pacman.nextDir = 1; break; //Down key
      case 65: gameData.ghost.nextDir = 2; break; //A key
      case 87: gameData.ghost.nextDir = 3; break; //W key
      case 68: gameData.ghost.nextDir = 0; break; //D key
      case 83: gameData.ghost.nextDir = 1; break; //S key
    }
  }
});

function move() {
  let p = gameData.pacman;
  let g = gameData.ghost
  changeDir(p);
  changeDir(g);
  if (canMove(p)) {
    p.row += dirs[p.dir][0];
    p.col += dirs[p.dir][1];
  }
  if (canMove(g)) {
    g.row += dirs[g.dir][0];
    g.col += dirs[g.dir][1];
  }
  if (gameData.gameReversed && new Date() - gameData.timer > 20000) {
    gameData.gameReversed = !gameData.gameReversed;
  }
  checkCollisions();
  repaintCanvas();

}

function repaintCanvas() {
  gameData.ctx.fillStyle = 'black'//"#FF0000";
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.fillStyle = "blue";
  for (let i = 0; i < gameData.pillMaze.length; i++) {
    for (let j = 0; j < gameData.pillMaze[i].length; j++) {
      let x = tile * j;
      let y = tile * i;
      switch (gameData.pillMaze[i][j]) {
        case 0:
          gameData.ctx.fillRect(x, y, tile, tile);
          break;
        case 1:
          gameData.ctx.drawImage(tiles.pillTile, x + 12, y + 12);
          break;
        case 2:
          gameData.ctx.drawImage(tiles.powerPillTile, x + 8, y + 8);
          break;
      }
    }
  }
  gameData.ctx.drawImage(tiles.pTiles[0], gameData.pacman.col * tile, gameData.pacman.row * tile);

  gameData.ctx.drawImage(tiles.gTiles[0], gameData.ghost.col * tile, gameData.ghost.row * tile);

  paintScore();
  paintLives();
}

function paintScore() {
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("Score: " + gameData.score, 48, 28);
}

function paintLives() {
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("Lives: ", 48, cHeight - 4);

  for (let i = 0; i < gameData.lives; i++) {
    gameData.ctx.drawImage(tiles.lifeTile, 150 + i * 20, cHeight - 24);
  }
}

function changeDir(fig) {
  if (figureInMiddle(fig) && fig.dir != fig.nextDir) {
    if (fig.nextDir != -1 && !canMove(fig) || fig.nextDir != -1 &&
      Maze[fig.row + dirs[fig.nextDir][0]][fig.col + dirs[fig.nextDir][1]] != 0) {
      fig.dir = fig.nextDir;
    }
  }
}

function canMove(fig) {
  console.log(fig);
  if (Maze[fig.row + dirs[fig.dir][0]][fig.col + dirs[fig.dir][1]] != 0) {
    return true;
  }
  return false;
}

function checkCollisions() {
  if (isCollision(gameData.pacman.row * tile, gameData.pacman.col * tile, gameData.ghost.row * tile, gameData.ghost.col * tile, 30)) {
    if (gameData.gameReversed) {
      gameData.score += 100;
      resetPositions(false, true);
    }
    else {
      pacmanDying();
      resetPositions(true, true);
    }
    gameData.gamePaused = true;
  }
  if (figureInMiddle(gameData.pacman)) {
    let i = gameData.pacman.row;
    let j = gameData.pacman.col;
    switch (gameData.pillMaze[i][j]) {
      case 1:
        gameData.pillMaze[i][j] = null;
        gameData.score += 10;
        if (allPillsEaten()) {
          pauseGame();
        }
        break;
      case 2:
        gameData.pillMaze[i][j] = null;
        gameData.gameReversed = true;
        gameData.timer = new Date();
        break;
    }
  }
}

function allPillsEaten() {
  for (let i = 0; i < gameData.pillMaze.length; i++) {
    for (let j = 0; j < gameData.pillMaze[i].length; j++) {
      if (gameData.pillMaze[i][j] == 1) {
        return false;
      }
    }
  }
  return true;
}

function isCollision(x1, y1, x2, y2, radius) {
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2) < radius);
}

function figureInMiddle(fig) {
  if (fig.row % 1 == 0 && fig.col % 1 == 0)
    return true;
}

function pacmanDying() {
  //do animation
}

function resetPositions(p, g) {//pacman, ghost
  if (p) {
    gameData.pacman.row = gameData.pacman.dRow;
    gameData.pacman.col = gameData.pacman.dCol;
  }
  if (g) {
    gameData.ghost.row = gameData.ghost.dRow;
    gameData.ghost.col = gameData.ghost.dCol;
  }
}

function initGame() {
  initVariables();
  initCanvas();
  resetPositions(true, true);
  console.log("Game Initialized");
}

function initVariables() {
  gameData.pacman = new Figure();
  gameData.ghost = new Figure();
  gameData.pillMaze = new Array(Maze.length);
  for (let i = 0; i < Maze.length; i++) {
    gameData.pillMaze[i] = new Array(Maze[i].length);
  }
  gameData.score = 0;
  gameData.gamePaused = false;
  gameData.gameStarted = false;
  gameData.lives = 3;
  initTiles();
}

function initTiles() {
  for (let i = 0; i < 4; i++) {//pacmanTiles
    tiles.pTiles.push(new Image());
    tiles.pTiles[i].src = imageAdress + 'pac_man_' + i + '.png';
  }
  for (let i = 0; i < 2; i++) {//ghostTiles
    tiles.gTiles.push(new Image());
    tiles.gTiles[i].src = imageAdress + 'spr_ghost_orange_' + i + '.png';
  }
  for (let i = 0; i < 3; i++) {//pacmanDeathTiles
    tiles.pDeathTiles.push(new Image());
    tiles.pDeathTiles[i].src = imageAdress + 'spr_pacdeath_' + i + '.png';
  }
  tiles.lifeTile = new Image();
  tiles.lifeTile.src = imageAdress + 'spr_lifecounter_0.png';

  tiles.pillTile = new Image();
  tiles.pillTile.src = imageAdress + 'spr_pill_0.png';

  tiles.powerPillTile = new Image();
  tiles.powerPillTile.src = imageAdress + 'spr_power_pill_0.png';

}

function initCanvas() {
  gameData.ctx.fillStyle = 'black'//"#FF0000";
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.fillStyle = "blue";
  for (let i = 0; i < Maze.length; i++) {
    for (let j = 0; j < Maze[i].length; j++) {
      let x = tile * j;
      let y = tile * i;
      switch (Maze[i].charAt(j)) {
        case '0':
          gameData.ctx.fillRect(x, y, tile, tile);
          gameData.pillMaze[i][j] = 0;
          break;
        case '1':
          gameData.ctx.drawImage(tiles.pillTile, x + 12, y + 12);
          gameData.pillMaze[i][j] = 1;
          break;
        case '2':
          gameData.ctx.drawImage(tiles.powerPillTile, x + 8, y + 8);
          gameData.pillMaze[i][j] = 2;
          break;
        case 'P':
          gameData.ctx.drawImage(tiles.pTiles[0], x, y);
          gameData.pacman.dCol = j;
          gameData.pacman.dRow = i;
          break;
        case 'G':
          gameData.ctx.drawImage(tiles.gTiles[0], x, y);
          gameData.ghost.dCol = j;
          gameData.ghost.dRow = i;
          break;
      }
    }
  }
  paintScore();
  paintLives();
}

function pauseGame() {
  move()
  if (gameData.gameStarted) {
    gameData.gamePaused = !gameData.gamePaused;
  }
  else {
    startGame();
  }
}

function startGame() {
  gameData.gameStarted = true;
  console.log("Game started");
}

// object constructor
function Figure() {
  this.row = 0;   // row
  this.col = 0;   // col
  this.dRow = 0;
  this.dCol = 0;
  this.phase = 0;   // animation phase
  this.dir = 0; // the directions we could go
  this.nextDir = -1;  // the current moving direction
  this.dx = 0;  // delta value for x-movement
  this.dy = 0;  // delta value for y-movement
  this.osx = 0;  // x-offset for smooth animation
  this.osy = 0;  // y-offset for smooth animation
  this.speed = 0;
}


//export default Canvas
render(<Canvas />, document.getElementById('root'));

