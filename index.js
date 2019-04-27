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
let cWidth = 640;
let cHeight = 384;
let tile = 32;
let gameData = {
  ctx: null,
  gameStarted: false,
  gamePaused: false,
  pacman: null,
  ghost: null,
};


class Canvas extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('canvas')
    gameData.ctx = canvas.getContext("2d")
    initGame();
    canvas.onclick = function () { pauseGame(); };
    canvas.addEventListener('keydown', this.handleKey, false);
  }
  
  handleKey(e){
    switch (e.keyCode) {
        case 37: alert("Left"); break; //Left key
        case 38: alert("Up"); break; //Up key
        case 39: alert("Right"); break; //Right key
        case 40: alert("Down"); break; //Down key
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



function initGame() {
  initVariables();
  initCanvas();
}

function initVariables() {
  gameData.pacman = new Figure();
  gameData.ghost = new Figure();

}

function initCanvas() {
  gameData.ctx.fillStyle = 'black'//"#FF0000";
  gameData.ctx.fillRect(0, 0, 640, 448);
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
          break;
        case '2':
          drawImage(x + 8, y + 8, 'spr_power_pill_0.png');
          break;
        case 'P':
          drawImage(x, y, 'pac_man_0.png');
          gameData.pacman.col = j;
          gameData.pacman.row = i;
          break;
        case 'G':
          drawImage(x, y, 'spr_ghost_orange_0.png');
          gameData.pacman.col = j;
          gameData.pacman.row = i;
          break;
      }
    }
  }
}

function pauseGame() {
  if (gameData.gameStarted) {
    pause();
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

function pause() {

}
function startGame() {

}


// object constructor
function Figure() {
  let row = 0;   // row
  let col = 0;   // col
  let phase = 0;   // animation phase
  //this.pn= 0;  // next delta for p (+1 or -1)
  let dir = 0; // the directions we could go
  let nextDir = 0;  // the current moving direction
  let dx = 0;  // delta value for x-movement
  let dy = 0;  // delta value for y-movement
  let osx = 0;  // x-offset for smooth animation
  let osy = 0;  // y-offset for smooth animation
  let speed = 0;
}


//export default Canvas
render(<Canvas />, document.getElementById('root'));

