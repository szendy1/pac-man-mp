import * as React from 'react';

class Game{
  constructor(){
    this.state = {
      lives = 3,
      pac = Pacman(),
      ghost = Ghost(),
      map = null
    };
  }
  preLoad(){

  }
}

// object constructors
function Pacman() {
    this.row= 0;   // row
    this.col= 0;   // col
    this.phase= 0;   // animation phase
    //this.pn= 0;  // next delta for p (+1 or -1)
    this.dir= 0; // the directions we could go
    //this.md= 0;  // the current moving direction
    this.dx= 0;  // delta value for x-movement
    this.dy= 0;  // delta value for y-movement
    this.osx=0;  // x-offset for smooth animation
    this.osy=0;  // y-offset for smooth animation
}

function Ghost() {
    this.row= 0;   // row
    this.col= 0;   // col
    this.phase= 0;   // animation phase
    //this.pn= 0;  // next delta for p (+1 or -1)
    this.dir= 0; // the directions we could go
    //this.md= 0;  // the current moving direction
    this.dx= 0;  // delta value for x-movement
    this.dy= 0;  // delta value for y-movement
    this.osx=0;  // x-offset for smooth animation
    this.osy=0;  // y-offset for smooth animation
}
