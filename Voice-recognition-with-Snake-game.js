
let snake_long = 10;
let direction = 'right';

const xStart = 0; //starting x coordinate for snake
const yStart = 250; //starting y coordinate for snake
const diff = 10;

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;
let scoreElem;

// Initialize a sound classifier
let classifier;
// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.8};
// Two variable to hold the label and confidence of the result
let label;
let confidence;


function setup() {
  // Classify the sound from microphone in real time
  classifier = ml5.soundClassifier('https://teachablemachine.withgoogle.com/models/U2eARrDV/' + 'model.json', options);
  
  classifier.classify(gotResults);
  
  scoreElem = createDiv('Score = 0');
  scoreElem.position(30, 12);
  scoreElem.id = 'score';
  scoreElem.style('color', 'brown');
  
  createCanvas(800, 500);
  frameRate(5);
  stroke(0, 75, 145);
  strokeWeight(11);
  updateFruitCoordinates();
  
  for (let i = 0; i < snake_long; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  }
  // Create 'label' and 'confidence' div to hold results
  // document.getElementById("pp").innerHTML = "<br>"
  label = createDiv(`<br> Try to say the following commands to your microphone: ('up', 'down', 'left', 'right' 'stop') to control the snake. <br> 
  Have fun &#128513&#128077`);
  
}

function draw() {
  background(225);
  for (let i = 0; i < snake_long; i++) {
    ellipse(xCor[i], yCor[i], 4);
  }
  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();
}



function updateSnakeCoordinates() {
  for (let i = 0; i < snake_long - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
    
    if (direction == "stop"){
      break;
    }
  }
  switch (direction) {
    case 'right':
      xCor[snake_long - 1] = xCor[snake_long - 2] + diff;
      yCor[snake_long - 1] = yCor[snake_long - 1];
      break;
    case 'up':
      xCor[snake_long - 1] = xCor[snake_long - 1];
      yCor[snake_long - 1] = yCor[snake_long - 2] - diff;
      break;
    case 'left':
      xCor[snake_long - 1] = xCor[snake_long - 2] - diff;
      yCor[snake_long - 1] = yCor[snake_long - 1];
      break;
    case 'down':
      xCor[snake_long - 1] = xCor[snake_long - 1];
      yCor[snake_long - 1] = yCor[snake_long - 2] + diff;
      break;
      
  }
}

function checkGameStatus() {
  if (
    xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1] < 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0
  ) {
    noLoop();
    const scoreVal = parseInt(scoreElem.html().substring(8));
    if (scoreVal == 0){
      scoreElem.html('Game ended! Your score was: ' + scoreVal + "&nbsp;&nbsp;&#128169");
    }else{

      scoreElem.html('Game ended! Your score was: ' + scoreVal + "&nbsp;&nbsp;&#128079&#128526");
    }
  }
}

function checkForFruit() {
  
  fill(179, 0, 164);
  //noStroke();
  ellipse(xFruit,yFruit,4);

  //point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    const prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score = ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    snake_long++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {

  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
  
}


var results_show;
// A function to run when we get any errors and the results
function gotResults(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
    
        if (results[0].label == 'right' && direction != 'left') {
          direction = 'right';
        }
        
        if (results[0].label == 'left' && direction != 'right') {
          direction = 'left';
        }
        
        if (results[0].label == 'down' && direction != 'up') {
          direction = 'down';
        }
        
        if (results[0].label == 'up' && direction != 'down') {
          direction = 'up';
        }

        if (results[0].label == 'stop' && direction != 'stop') {
          direction = 'stop';
        }

}


