import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import { database } from "./config";

let Maze;/*= [
  '00000000000000000000',
  '02111111111111111120',
  '01000101000010100010',
  '01011111111111111010',
  '011101010E0010101110',
  '010001010EG010100010',
  '01111101000010111110',
  '01000101111110100010',
  '01111111000011111110',
  '01010001110111000010',
  '021111110P1101111120',
  '00000000000000000000',
]*/
let p1Name = "Pac-Man";
let p2Name = "Ghost";
let imageAdress = 'https://raw.githubusercontent.com/szendy1/pac-man-mp/master/img/';
let pacTimer;
let aSpeed = 400;
let aStep = 4;
let tile = 32;
let cWidth = tile * 20;
let cHeight = tile * 12;
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
  mazeId: 2,
  canvas: null,
  ctx: null,
  gameStarted: false,
  gamePaused: false,
  pacman: null,
  ghost: null,
  score1: 0,
  score2: 0,
  timer: null,
  pillMaze: null,
  gameReversed: false,
  lives: 0,
  Maze: [],
};
let canvasButtons = {
  newGameX: cWidth / 2 - 90,
  newGameY: cHeight / 2 - 25,
  btnNewWidth: 154,
  btnNewHeight: 28,
  highScoreX: cWidth / 2 - 105,
  highScoreY: cHeight / 2 + 25,
  btnScoreWidth: 182,
  btnScoreHeight: 36,
  menuX: 50,
  menuY: 20,
  menuWidth: 60,
  menuHeight: 21,
  map1X: 0,
  map1Y: 0,
  map2X: 0,
  map2Y: 0,
  map3X: 0,
  map3Y: 0,
  map4X: 0,
  map4Y: 0,
  mapLen: 0,
  mapWidth: 0,
}
let backPossible = false;




class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Maze: []
    };
  }

  componentDidMount() {
    gameData.canvas = document.getElementById('canvas')
    gameData.ctx = canvas.getContext("2d")
    this.unsubscribe = database
      .collection("Maze")
      .doc('Duy9LsnGMcJFd1q0g64C').onSnapshot((snap) => {
        gameData.Maze.push(snap.data().description);
        gameData.Maze.push(snap.data().description1);
        gameData.Maze.push(snap.data().description2);
        //gameData.Maze = snap.data().description
      }
      );
    /*this.setState({
      Maze: snap.data().description
    }));*/
    // , this.initGame()));

    showMenuScreen();
    canvas.onclick = function () { clickEvent(event); };
    //initGame();
  }

  render() {
    return (
      <div>
        <canvas id="canvas" width={cWidth} height={cHeight} />
      </div>
    )
  }
  initGame() {
    Maze = this.state.Maze;
    console.log(this.state.Maze)
    initVariables();
    initCanvas();
    resetFigure(gameData.pacman);
    resetFigure(gameData.ghost);
    console.log("Game Initialized");
  }
}

function clickEvent(e) {
  if (gameData.gameStarted) {
    pauseGame();
  }
  else {
    let x = e.x - 8;
    let y = e.y - 8;
    if (x >= canvasButtons.newGameX && x <= canvasButtons.newGameX + canvasButtons.btnNewWidth &&
      y >= canvasButtons.newGameY && y <= canvasButtons.newGameY + canvasButtons.btnNewHeight) {
      showChooseMapScreen();
      backPossible = true;
    }
    else if (x >= canvasButtons.highScoreX && x <= canvasButtons.highScoreY + canvasButtons.btnScoreWidth &&
      y >= canvasButtons.highScoreY && y <= canvasButtons.highScoreY + canvasButtons.btnScoreHeight) {
      showHighScoresScreen();
      backPossible = true;
    }
    else if (backPossible && x >= canvasButtons.menuX && x <= canvasButtons.menuX + canvasButtons.menuWidth &&
      y >= canvasButtons.menuY && y <= canvasButtons.menuY + canvasButtons.menuHeight) {
      showMenuScreen();
      backPossible = false;
    }
  }
}

function showChooseMapScreen() {
  /*initGame();
  startGame();*/
  
  gameData.ctx.fillStyle = 'black';
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.font = "20px Comic Sans MS";
  gameData.ctx.fillStyle = 'white';
  gameData.ctx.fillText("Choose Map", cWidth/2-50, 20);

  paintMiniMap(50,50,gameData.Maze[0]);

  paintMiniMap(cWidth/2+50,50,gameData.Maze[1]);

  paintMiniMap(50,cHeight/2+20,gameData.Maze[2]);
  //console.log("NewMap")
}

function showHighScoresScreen() {

  gameData.ctx.fillStyle = 'black';
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.font = "20px Comic Sans MS";
  gameData.ctx.fillStyle = "white";

  gameData.ctx.fillText("< Back", canvasButtons.menuX, canvasButtons.menuY + 20);
  let y = 80;
  gameData.ctx.fillText("#", 20, y);
  gameData.ctx.fillText("Pac-man", 50, y);
  gameData.ctx.fillText("Score", 150, y);
  gameData.ctx.fillText("Ghost", 260, y);
  gameData.ctx.fillText("Score", 350, y);
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

function showMenuScreen() {
  gameData.ctx.fillStyle = 'black';
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  //gameData.ctx.fillRect(canvasButtons.newGameX, canvasButtons.newGameY, 154, 28);
  gameData.ctx.fillText("New Game", canvasButtons.newGameX, canvasButtons.newGameY + 26);
  //gameData.ctx.fillRect(canvasButtons.highScoreX, canvasButtons.highScoreY, 182, 36);
  gameData.ctx.fillText("High Scores", canvasButtons.highScoreX, canvasButtons.highScoreY + 26);
}

function move() {
  if (pacTimer) clearTimeout(pacTimer);
  let dateA = new Date();
  let p = gameData.pacman;
  let g = gameData.ghost
  changeDir(p);
  changeDir(g);
  if (!figureInMiddle(p) || canMove(p)) {
    p.row += dirs[p.dir][0] / aStep;
    p.col += dirs[p.dir][1] / aStep;
    p.phase += p.pn;
    if (p.phase == 3) p.pn = -1;
    if (p.phase == 0) p.pn = 1;
  }
  if (!figureInMiddle(g) || canMove(g)) {
    g.row += dirs[g.dir][0] / aStep;
    g.col += dirs[g.dir][1] / aStep;
    g.phase += 1;
  }
  if (gameData.gameReversed && new Date() - gameData.timer > 20000) {
    gameData.gameReversed = !gameData.gameReversed;
  }
  if (!checkCollisions()) {
    repaintCanvas();
  }
  if (gameData.gameStarted && !gameData.gamePaused) {
    var dateB = new Date();
    var mTO = dateA.getTime() - dateB.getTime();
    mTO += Math.round(aSpeed / aStep);
    if (mTO < 5) mTO = 5; // minimum delay 5 msecs
    // set up the timout and store a reference in pacTimer
    pacTimer = setTimeout(move, mTO);
  }
}

function paintPauseScreen() {
  gameData.ctx.fillStyle = 'black';
  gameData.ctx.fillRect(0, 0, cWidth, cHeight);
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("Game Paused", cWidth / 2 - 100, cHeight / 2 - 25);
  gameData.ctx.fillText("Click to play !", cWidth / 2 - 105, cHeight / 2 + 25);
}

function repaintCanvas() {
  gameData.ctx.fillStyle = 'black';
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

  drawRotatedImage(tiles.pTiles[gameData.pacman.phase], gameData.pacman.col * tile, gameData.pacman.row * tile, gameData.pacman.angle);
  let t;
  if (gameData.gameReversed) {
    t = tiles.gReversedTiles;
  }
  else {
    t = tiles.gTiles;
  }
  /* if (gameData.ghost.angle == 180)
     drawRotatedImage(t[gameData.ghost.phase% 2],gameData.ghost.col * tile, gameData.ghost.row * tile, gameData.ghost.angle);
   else */
  gameData.ctx.drawImage(t[gameData.ghost.phase % 2], gameData.ghost.col * tile, gameData.ghost.row * tile);
  paintPlayerNames();
  paintScore();
  paintLives();
}

function drawRotatedImage(image, x, y, angle) {
  let context = gameData.ctx;
  context.save();
  context.translate(x + tile / 2, y + tile / 2);
  context.rotate(angle * (Math.PI / 180));
  context.drawImage(image, -(image.width / 2), -(image.height / 2));
  context.restore();
}

function paintPlayerNames() {
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("" + p1Name + " :", 32, 28);

  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("" + p2Name + " :", cWidth/2+100, 28);
}

function paintScore() {
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText(gameData.score1, 200, 28);

  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText(gameData.score2, cWidth-100, 28);
}

function paintLives() {
  gameData.ctx.font = tile + "px Comic Sans MS";
  gameData.ctx.fillStyle = "white";
  gameData.ctx.fillText("Lives: ", 48, cHeight - 4);

  for (let i = 0; i < gameData.lives; i++) {
    gameData.ctx.drawImage(tiles.lifeTile, 150 + i * 20, cHeight - 24);
  }
}

function paintMiniMap(x,y,mapArray){
  let miniTile = Math.round(tile / 3);
  gameData.ctx.fillStyle = "blue";
  for (let i = 0; i < mapArray.length; i++){
    for (let j = 0; j<mapArray[i].length;j++){
       if (mapArray[i][j] == 0){
          gameData.ctx.fillRect(x+miniTile*j, y+miniTile*i, miniTile, miniTile);
          console.log(x+miniTile*i);
          console.log( y+miniTile*j);
      }
    }
  }
  
}

function changeDir(fig) {
  if (figureInMiddle(fig) && fig.dir != fig.nextDir) {
    if (fig.nextDir != -1 && !canMove(fig) || fig.nextDir != -1 &&
      Maze[fig.row + dirs[fig.nextDir][0]][fig.col + dirs[fig.nextDir][1]] != 0) {
      fig.dir = fig.nextDir;
      switch (fig.dir) {
        case 0: fig.angle = 0; break;
        case 1: fig.angle = 90; break;
        case 2: fig.angle = 180; break;
        case 3: fig.angle = 270; break;
      }
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
  if (isCollision(gameData.pacman.row * tile, gameData.pacman.col * tile, gameData.ghost.row * tile, gameData.ghost.col * tile, 30)) {
    if (gameData.gameReversed) {
      gameData.score1 += 100;
      gameData.gameReversed = false;
      resetFigure(gameData.ghost);

    }
    else {
      gameData.score2 += Math.round(gameData.score1/2);
      gameData.score1 = Math.round(gameData.score1/2);
      pacmanDying();
      resetFigure(gameData.pacman);
      resetFigure(gameData.ghost);
      gameData.lives -= 1;
    }
    pauseGame();
    if (pacTimer) clearTimeout(pacTimer);
    return true;
  }
  if (figureInMiddle(gameData.pacman)) {
    let i = gameData.pacman.row;
    let j = gameData.pacman.col;
    switch (gameData.pillMaze[i][j]) {
      case 1:
        gameData.pillMaze[i][j] = null;
        gameData.score1 += 10;
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
  return false;
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

function resetFigure(fig) {
  fig.row = fig.dRow;
  fig.col = fig.dCol;
  fig.dir = 0;
  fig.nextDir = -1;
  fig.phase = 2;
  fig.angle = 0;
}

function initGame() {
  Maze = gameData.Maze[gameData.mazeId];
  initVariables();
  initCanvas();
  resetFigure(gameData.pacman);
  resetFigure(gameData.ghost);
  console.log("Game Initialized");
}

function initVariables() {
  gameData.pacman = new Figure();
  gameData.ghost = new Figure();
  gameData.pillMaze = new Array(Maze.length);
  for (let i = 0; i < Maze.length; i++) {
    gameData.pillMaze[i] = new Array(Maze[i].length);
  }
  gameData.score1 = 0;
  gameData.score2 = 0;
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
  for (let i = 0; i < 2; i++) {//ghostAfraidTiles
    tiles.gReversedTiles.push(new Image());
    tiles.gReversedTiles[i].src = imageAdress + 'spr_afraid_' + i + '.png';
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
  if (gameData.gameStarted) {

    if (pacTimer) clearTimeout(pacTimer);
    gameData.gamePaused = !gameData.gamePaused;
    if (gameData.gamePaused) {
      paintPauseScreen();
    }
    else {
      repaintCanvas();
      move();
    }
  }
  else {
    console.log(gameData.Maze)
    startGame();
  }
}

function startGame() {

  initGame();
  gameData.gameStarted = true;
  move();
  console.log("Game started");
}

// object constructor
function Figure() {
  this.row = 0;   // row
  this.col = 0;   // col
  this.dRow = 0;
  this.dCol = 0;
  this.phase = 2;   // animation phase
  this.pn = 1;
  this.dir = 0; // the directions we could go
  this.nextDir = -1;  // the current moving direction
  this.speed = 0;
  this.angle = 0;
}

//export default Canvas
render(<Canvas />, document.getElementById('root'));

