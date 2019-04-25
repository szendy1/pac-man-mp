import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

let Maze = [
  '00000000000000000000',
  '01111111111111111110',
  '01010111111111110101',
  '00000001111100000000',
  '01111111111111111110',
  '01010111111111101010',
  '00000001111000000000',
  '01111111111111111111',
  '01010111111111101010',
  '00000000111100000000',
  '01111111111111111110',
  '00000000000000000000',
]

class Canvas extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    console.log(Maze);
    console.log(Maze.length);
    console.log(Maze[0].length);
    ctx.fillStyle = "blue";
    ctx.fillRect(0,0,640,448);
    ctx.fillStyle = "#FF0000";
    for (let i = 0; i< Maze.length;i++){
      for (let j = 0; j<Maze[i].length;j++){
          let x = 32*j;
          let y = 32*i;
        if (Maze[i].charAt(j) =="1"){
          ctx.fillRect(x,y,31,31);
        }
        ctx.strokeText(Maze[i].charAt(j), x+16, y+16);
      }
    }
  }
  render() {
    return(
      <div>
        <canvas ref="canvas" width={640} height={384} />
      </div>
    )
  }
}
//export default Canvas
render(<Canvas />, document.getElementById('root'));
