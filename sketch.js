const canvasX = 400;
const canvasY = 600;
const colours = ['deeppink', 'darkorange', 'gold' , 'lime', 'cyan', 'royalblue'];
const gameOver = 5;

let seconds, grids;
let timestamp, waiting, result, game, start, score, incorrect, chosen, optSize;
let restarted = 0;

function initialize() {
  timestamp = 0;
  waiting = false;
  result = null;
  game = [];
  start = false;
  score = 0;
  incorrect = 0;
  chosen = [];
  optSize = canvasX / (colours.length + 2);
}

function drawGrid(x, y, colour, strokeColour) {
  if (!strokeColour) strokeColour = 'black';
  stroke(strokeColour);
  fill(colour);
  square(x * (canvasX / grids), y * (canvasX / grids), canvasX / grids);
}

function drawInitial() {
    background('lightgrey');
    noStroke();
    fill('#fbfbfb');
    rect(0, canvasX, canvasX, canvasY - canvasX);
}

function setup() {
  initialize();
  createCanvas(canvasX, canvasY);
}

function draw() {
  if (start === false) {
    drawInitial();
    
    fill('black');
    textAlign(CENTER, CENTER);
    noStroke();
    
    textSize(28);
    text('Remember the colours!', canvasX / 2, canvasX * 0.3);
    
    textSize(20);
    text('Choose a difficulty level.', canvasX / 2, canvasX * 0.4);
    
    fill('lightgrey');
    stroke('black');
    
    rect(canvasX * 0.25, canvasX * 0.51, canvasX * 0.5, canvasX * 0.08);
    rect(canvasX * 0.25, canvasX * 0.61, canvasX * 0.5, canvasX * 0.08);
    rect(canvasX * 0.25, canvasX * 0.71, canvasX * 0.5, canvasX * 0.08);
    
    fill('black');
    noStroke();
    
    text('Easy', canvasX / 2, canvasX * 0.55);
    text('Medium', canvasX / 2, canvasX * 0.65);
    text('Difficult', canvasX / 2, canvasX * 0.75);
    
    if (Date.now() - restarted < 500) return;
    
    // Easter egg, y'know
    if (mouseIsPressed && mouseX > 338 && mouseX < 346 && mouseY > 126 && mouseY < 134) {
      seconds = 3;
      grids = 100;
      start = true;
      timestamp = Date.now();
      return;
    }
    
    if (mouseIsPressed && mouseX > canvasX * 0.25 && mouseX < canvasX * 0.75) {
      if (mouseY > canvasX * 0.51 && mouseY < canvasX * 0.59) {
        seconds = 5;
        grids = 3;
      }
      else if (mouseY > canvasX * 0.61 && mouseY < canvasX * 0.69) {
        seconds = 5;
        grids = 4;
      }   
      else if (mouseY > canvasX * 0.71 && mouseY < canvasX * 0.79) {
        seconds = 5;
        grids = 5;
      } else {
        return;
      }
      
      start = true;
      timestamp = Date.now();
    }
    
    return;
  }
  
  if (result === null && incorrect >= gameOver) {
    drawInitial();
    
    fill('black');
    textAlign();
    noStroke();
    
    textSize(28);
    text('Game over!', canvasX / 2, canvasX * 0.4);
    text(`Final score: ${score}`, canvasX / 2, canvasX * 0.5);
    
    textSize(18);
    text('Click anywhere to restart.', canvasX / 2, canvasX * 0.6);
    
    if (mouseIsPressed) {
      restarted = Date.now();
      initialize();
    }
    
    return;
  }
  
  if (waiting === true) {
    if (result !== null) {
      return;
    }
    
    background('lightgrey');
    
    if (chosen.length === 0) {
      chosen.push(Math.floor(Math.random() * grids));
      chosen.push(Math.floor(Math.random() * grids));
    }
    
    strokeWeight(2);
    drawGrid(chosen[0], chosen[1], 'lightgrey', 'red');
    strokeWeight(1);
    
    fill('#fbfbfb');
    noStroke();
    rect(0, canvasX, canvasX, canvasY - canvasX);
    
    fill('black');
    textSize(16);
    textAlign(CENTER, CENTER);
    text('What was the colour of the highlighted grid?', canvasX / 2, canvasX * 1.15);
    
    textAlign(RIGHT, CENTER);
    text(`Score: ${score}`, canvasX - 10, canvasX + 15);
    
    let i = 1;
    for (let colour of colours) {
      stroke('black');
      fill(colour);
      square(i * optSize, canvasX * 1.2, optSize);
      i++;
    }
    
    if (mouseIsPressed && mouseY > canvasX * 1.2 && mouseY < canvasX * 1.2 + optSize && mouseX > optSize && mouseX < 7 * optSize) {
      let mouse = mouseX - optSize;
      let answer = colours[Math.floor(mouse / optSize)];
      
      fill('red');
      textSize(28);
      textAlign(CENTER, CENTER);
      noStroke();
      
      if (game[chosen[0]][chosen[1]] === answer) {
        text('Correct! :)', canvasX / 2, canvasX * 1.4);
        score += 1;
        result = true;
      } else {
        text('Wrong! :(', canvasX / 2, canvasX * 1.4);
        incorrect += 1;
        result = false;
      }
      
      setTimeout(() => {
        result = null;
        waiting = false;
        game = [];
        chosen = [];
        timestamp = Date.now();
      }, 1000);
    }
    
    return;
  }
  
  if (game.length === 0) {
    for (let i = 0; i < grids; i++) {
      game.push([]);
      for (let j = 0; j < grids; j++) {
        let colour = colours[Math.floor(Math.random() * colours.length)];
        game[i].push(colour);
      }
    }
  }

  if (Date.now() - timestamp > seconds * 1000) {
    waiting = true;
    return;
  }
  
  drawInitial();
  
  game.forEach((i, x) => {
    i.forEach((j, y) => {
      drawGrid(x, y, j);
    });
  });

  fill('black');
  textSize(16);
  noStroke();
  
  textAlign(LEFT, CENTER);
  text(`Time remaining: ${seconds - Math.floor((Date.now() - timestamp) / 1000)} seconds`, 10, canvasX + 15);

  textAlign(RIGHT, CENTER);
  text(`Score: ${score}`, canvasX - 10, canvasX + 15);
}
