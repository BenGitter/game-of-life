import { Component, OnInit } from '@angular/core';

function requestFrame(func, self){
  
  window.requestAnimationFrame(function(){
    if(!self.isRunning){
      return false;
    }

    self.generationNum++;

    func(self);
    setTimeout(function(){
      requestFrame(func, self);
    }, 100);
    
  });
}


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isRunning:boolean = true;
  generationNum = 0;

  numRows:number = 25;
  numCols:number = 50;

  numRowsArr:number[] = new Array(this.numRows);
  numColsArr:number[] = new Array(this.numCols);

  // arr:any[] = new Array(this.numRows);
  livingArr:any[] = new Array(this.numRows);
  deadArr:any[] = new Array(this.numRows);
  newArr:any[] = new Array(this.numRows);
  neighboursArr:any[] = new Array(this.numRows);

  constructor() { }

  ngOnInit() {
    this.populateGame();
    this.startGame();

    requestFrame(this.gameLogic, this);
  }

  switchState(){
    this.isRunning = !this.isRunning;

    if(this.isRunning){
      requestFrame(this.gameLogic, this);
    }
  }

  clearBoard(){
    for(let i = 0; i < this.numRows; i++){
      this.livingArr[i] = new Array(this.numRows);
      this.deadArr[i] = new Array(this.numRows);
      this.newArr[i] = new Array(this.numRows);
      this.neighboursArr[i] = new Array(this.numRows);

      for(let j = 0; j < this.numCols; j++){
        this.livingArr[i][j] = false;

        this.newArr[i][j] = false;
        this.deadArr[i][j] = false;
      }
    }  

    this.generationNum = 0;
    this.isRunning = false;
  }

  makeAlive(i,j){
    this.livingArr[i][j] = !this.livingArr[i][j];

  }


  // Game logic functions:
  populateGame(){
    for(let i = 0; i < this.numRows; i++){
      this.livingArr[i] = new Array(this.numRows);
      this.deadArr[i] = new Array(this.numRows);
      this.newArr[i] = new Array(this.numRows);
      this.neighboursArr[i] = new Array(this.numRows);

      for(let j = 0; j < this.numCols; j++){
        this.livingArr[i][j] = (Math.random() > .6) ? false : true;

        this.newArr[i][j] = false;
        this.deadArr[i][j] = false;
      }
    }

    // Test sequence
        // this.livingArr[2][3] = true;
        // this.livingArr[2][4] = true;
        // this.livingArr[2][5] = true;
        // this.livingArr[2][6] = true;
        // this.livingArr[3][2] = true;
        // this.livingArr[3][6] = true;
        // this.livingArr[4][6] = true;
        // this.livingArr[5][5] = true;
        // this.livingArr[5][2] = true;
  }

  startGame(){

  }

  gameLogic(self){
    // Update new-alive-dead
    for(let i = 0; i < self.numRows; i++){
      for(let j = 0; j < self.numCols; j++){

        if(self.newArr[i][j]){
          self.livingArr[i][j] = true;
          self.newArr[i][j] = false;
        }

        if(self.deadArr[i][j]){
          self.deadArr[i][j] = false;
          self.livingArr[i][j] = false;
        }
      }
    }

    // Get numNeighbours
    for(let i = 0; i < self.numRows; i++){
      for(let j = 0; j < self.numCols; j++){
        self.neighboursArr[i][j] = self.getNumberOfNeighbours(i,j,self);
      }
    }

    for(let i = 0; i < self.numRows; i++){
      for(let j = 0; j < self.numCols; j++){
        // Check if cell dies
        if((self.neighboursArr[i][j] < 2 || self.neighboursArr[i][j] > 3) && self.livingArr[i][j]){
          self.deadArr[i][j] = true;
        }

        // Check if cell comes alive
        if(self.neighboursArr[i][j] === 3 && !self.livingArr[i][j]){
          self.newArr[i][j] = true;
        }
      }
    }
  }

  getNumberOfNeighbours(i,j,self){
    let count = 0;

    for(let x = -1; x <= 1; x++){
      for(let y = -1; y <= 1; y++){
        if((x+i)>=0 && (x+i)<self.numRows && (y+j)>=0 && (y+j)<self.numCols){
          if(self.livingArr[x+i][y+j] && !(x == 0 && y == 0)){
            count++;
          }
        }
      }
    }

    return count;
  }

}
