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


class Canvas extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,640,448);
    ctx.fillStyle = "blue";
    for (let i = 0; i< Maze.length;i++){
      for (let j = 0; j<Maze[i].length;j++){
          let x = 32*j;
          let y = 32*i;
        switch (Maze[i].charAt(j)){
          case '0':
            ctx.fillRect(x,y,31,31);
            break;
          case 'P':
            drawImage(ctx,x,y,'pac_man_0.png');
            /*let img = new Image();
            img.src = imageAdress+'pac_man_0.png';
            img.onload = function(){
            ctx.drawImage(img,x,y);
            }*/
            break;
          case 'G':
            drawImage(ctx,x,y,'spr_ghost_orange_0.png');
            /*let img1 = new Image();
            img1.src = imageAdress+'spr_ghost_orange_0.png';
            img1.onload = function(){
            ctx.drawImage(img1,x,y);
            }*/
            break;
          }
        }
        //ctx.strokeText(Maze[i].charAt(j), x+16, y+16);
    }
    let g = new Game();
    g.preLoad();
  }
  render() {
    return(
      <div>
        <canvas id="canvas" width={cWidth} height={cHeight} />
      </div>
    )
  }
}

static function drawImage(ctx,x,y,src){
  let img = new Image();
  img.src = imageAdress+src;
  ctx.drawImage(img,x,y);
}

class Game{
  constructor(){
     let state = {
      lives : 3,
      pac : Pacman(),
      ghost : Ghost(),
      map : Maze,
      pacTiles : [
        
      ],
    };
  }
  preLoad(){
    let cas = document.getElementById('canvas')
    console.log(cas)
      let ctx = cas.getContext('2d');
      ctx.fillStyle = "white";
    //ctx.fillText(100,100,"sdawdawdawdawdawdawdawdawdadawda");
   // ctx.stroke()
  }
}


// object constructors
function Pacman() {
    let row= 0;   // row
    let col= 0;   // col
    let phase= 0;   // animation phase
    //this.pn= 0;  // next delta for p (+1 or -1)
    let dir= 0; // the directions we could go
    let nextDir= 0;  // the current moving direction
    let dx= 0;  // delta value for x-movement
    let dy= 0;  // delta value for y-movement
    let osx=0;  // x-offset for smooth animation
    let osy=0;  // y-offset for smooth animation
}

function Ghost() {
    let row= 0;   // row
    let col= 0;   // col
    let phase= 0;   // animation phase
    //this.pn= 0;  // next delta for p (+1 or -1)
    let dir= 0; // the directions we could go
    let nextDir= 0;  // the current moving direction
    let dx= 0;  // delta value for x-movement
    let dy= 0;  // delta value for y-movement
    let osx=0;  // x-offset for smooth animation
    let osy=0;  // y-offset for smooth animation
}


//export default Canvas
render(<Canvas />, document.getElementById('root'));

