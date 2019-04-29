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
    canvas.addEventListener('keydown', this.handleKey, false);
  }

  handleKey(e) {
    if (gameData.gameStarted && !gameData.gamePaused) {
      switch (e.keyCode) {
        case 37: console.log("Left"); break; //Left key
        case 38: console.log("Up"); break; //Up key
        case 39: console.log("Right"); break; //Right key
        case 40: console.log("Down"); break; //Down key
        case 65: console.log("A"); break; //A key
        case 87: console.log("W"); break;
        case 68: break; //D key
        case 83: break; //S key
        default: console.log(e.keyCode);
        /*
              case 37: gameData.pacman.nextDir = 2; break; //Left key
              case 38: gameData.pacman.nextDir = 3; break; //Up key
              case 39: gameData.pacman.nextDir = 0; break; //Right key
              case 40: gameData.pacman.nextDir = 1; break; //Down key
              case 65: gameData.ghost.nextDir = 2; break; //A key
              case 87: gameData.ghost.nextDir = 3; break; //W key
              case 68: gameData.ghost.nextDir = 0; break; //D key
              case 83: gameData.ghost.nextDir = 1; break; //S key
              */
      }
    }
  }

  render() {
    return (
      <div>
        <canvas id="canvas" onKeyDown={this.handleKey} width={cWidth} height={cHeight} />
      </div>
    )
  }
}

function move() {
  checkCollisions();
  let p = gameData.pacman;
  let g = gameData.ghost
  changeDir(p);
  changeDir(g);
  if (canMove(p)) {
    p.row += dirs[p.dir][0];
    p.col += dirs[p.dir][1];
  }
  repaintCanvas();

}

function repaintCanvas() {
  
}

function changeDir(fig) {
  if (figureInMiddle(fig) && fig.dir != fig.nextDir) {
    if (!canMove(fig) ||
      Maze[fig.row + dirs[fig.nextDir][0]][fig.col + dirs[fig.nextDir][1]] != 0) {
      fig.dir = fig.nextDir;
    }
  }
}

function canMove(fig) {
  if (Maze[fig.row + dirs[fig.dir][0]][fig.col + dirs[fig.dir][1]] != 0) {
    return true;
  }
  return false;
}

function checkCollisions() {
  if (gameData.pacman.row == gameData.ghost.row && gameData.pillMaze.col == gameData.ghost.col) {//simple check
    if (gameReversed) {
      gameData.score += 100;
      resetPositions(false, true);
    }
    else {
      pacmanDying();
      resetPositions(true, true);
    }
    gamePaused = true;
  }
  if (figureInMiddle(gameData.pacman)) {
    let i = gameData.pacman.row;
    let j = gameData.pacman.col;
    switch (gameData.pillMaze[i][j]) {
      case 1:
        gameData.pillMaze[i][j] = null;
        gameData.score += 10;
        break;
      case 2:
        gameData.pillMaze[i][j] = null;
        gameData.gameReversed = true;
        gameData.timer = new Date();
        break;
    }

  }

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
  
  initTiles();
}

function initTiles(){
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
          //drawImage(x + 12, y + 12, 'spr_pill_0.png');
          gameData.ctx.drawImage(tiles.pillTile, x + 12, y + 12);
          gameData.pillMaze[i][j] = 1;
          break;
        case '2':
          //drawImage(x + 8, y + 8, 'spr_power_pill_0.png');
          gameData.ctx.drawImage(tiles.powerPillTile, x+8, y+8);
          gameData.pillMaze[i][j] = 2;
          break;
        case 'P':
          //drawImage(x, y, 'pac_man_0.png');
          gameData.ctx.drawImage(tiles.pTiles[0], x, y);
          gameData.pacman.dCol = j;
          gameData.pacman.dRow = i;
          break;
        case 'G':
          //drawImage(x, y, 'spr_ghost_orange_0.png');
          gameData.ctx.drawImage(tiles.gTiles[0], x, y);
          gameData.pacman.dCol = j;
          gameData.pacman.dRow = i;
          break;
      }
    }
  }

}

function pauseGame() {
  if (gameData.gameStarted) {
    gameData.gamePaused = !gameData.gamePaused;
  }
  else {
    startGame();
  }
}

static function drawImage(x, y, src) {
  let img = new Image();
  img.src = imageAdress + src;
  gameData.ctx.drawImage(img, x, y);
}

function startGame() {
  gameData.gameStarted = true;
  console.log("Game started");
}

// object constructor
function Figure() {
  let row = 0;   // row
  let col = 0;   // col
  let dRow = 0;
  let dCol = 0;
  let phase = 0;   // animation phase
  let dir = 0; // the directions we could go
  let nextDir = -1;  // the current moving direction
  let dx = 0;  // delta value for x-movement
  let dy = 0;  // delta value for y-movement
  let osx = 0;  // x-offset for smooth animation
  let osy = 0;  // y-offset for smooth animation
  let speed = 0;
}


//export default Canvas
render(<Canvas />, document.getElementById('root'));

