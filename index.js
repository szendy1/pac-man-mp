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
  changeDir(gameData.pacman);
  changeDir(gameData.ghost);


}

function changeDir(fig) {
  if (figureInMiddle(fig) && fig.dir != fig.nextDir) {
    if (!canMove(fig)) {
      fig.dir = fig.nextDir;
    }
    else {
      switch (fig.nextDir) {
        case 0:
          if (Maze[fig.row][fig.col + 1] != 0) {
            fig.dir = fig.nextDir;
          }
          break;
        case 1:
          if (Maze[fig.col + 1][fig.row] != 0) {
            fig.dir = fig.nextDir;
          }
          break;
        case 2:
          if (Maze[fig.col][fig.row - 1] != 0) {
            fig.dir = fig.nextDir;
          }
          break;
        case 3:
          if (Maze[fig.col - 1][fig.row] != 0) {
            fig.dir = fig.nextDir;
          }
          break;
      }
    }
  }
}

function canMove(fig){
  

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
          break;
        case '1':
          drawImage(x + 12, y + 12, 'spr_pill_0.png');
          gameData.pillMaze[i][j] = 1;
          break;
        case '2':
          drawImage(x + 8, y + 8, 'spr_power_pill_0.png');
          gameData.pillMaze[i][j] = 2;
          break;
        case 'P':
          drawImage(x, y, 'pac_man_0.png');
          gameData.pacman.dCol = j;
          gameData.pacman.dRow = i;
          break;
        case 'G':
          drawImage(x, y, 'spr_ghost_orange_0.png');
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

