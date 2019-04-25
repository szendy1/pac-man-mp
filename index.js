import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

var Maze = [
  ['000000000000000000000'],
  ['011111111111111111110'],
  ['010101111111111101010'],
  ['000000000000000000000'],
  ['011111111111111111110'],
  ['010101111111111101010'],
  ['000000000000000000000'],
  ['011111111111111111110'],
  ['010101111111111101010'],
  ['000000000000000000000'],
  ['011111111111111111110'],
  ['010101111111111101010'],
]

class Canvas extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    for (let i = 0; i< Maze.length;i++){
      for (let j = 0; j<Maze[i].length;j++){
        if (Maze[i][j]=='0'){
          let x = 32*i;
          let y = 32*j;
          ctx.fillRect(x,y,x+32,y);
        }
      }
    }
  }
  render() {
    return(
      <div>
        <canvas ref="canvas" width={640} height={448} />
      </div>
    )
  }
}
//export default Canvas
render(<Canvas />, document.getElementById('root'));
