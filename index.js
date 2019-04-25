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
  '00000100GGGG00100000',
  '01111110000001111110',
  '010001111P1111100010',
  '01011100000000111010',
  '02110111111111101120',
  '00000000000000000000',
]

let cWidth = 640;
let cHeight = 384;

class Canvas extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
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
          case 'P':
          let img = new Image();
           ctx.drawImage(img,x,y);
          }
        }
        //ctx.strokeText(Maze[i].charAt(j), x+16, y+16);
    }
    let g = new Game();
    g.preLoad1();
  }
  render() {
    return(
      <div>
        <canvas ref="canvas" width={cWidth} height={cHeight} />
      </div>
    )
  }
}

class Game{
  constructor(){
     let state = {
      lives : 3,
      pac : Pacman(),
      ghost : Ghost(),
      map : Maze,
      pacTiles : [
        <img src={"/img/pac_man_0.png"} />,
      ],
    };
  }
  preLoad1(){
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

