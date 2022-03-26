var PROGRESS_BAR_HEIGHT = 600
var PROGRESS_BAR_WIDTH = 30
var PLAY_BAR_HEIGHT = 600
var PLAY_BAR_WIDTH = 70

var workbar = document.getElementById("workbar");
var workbarCanvas = workbar.getContext("2d");

var work = document.getElementById("work");
var workCanvas = work.getContext("2d");


var mentalbar = document.getElementById("mentalbar");
var mentalbarCanvas = mentalbar.getContext("2d");

var mental = document.getElementById("mental");
var mentalCanvas = mental.getContext("2d");

var progressBars = [
                    {"canvas": workbarCanvas},
                    {"canvas": mentalbarCanvas}
                  ]


var playBars = [
                {"canvas": workCanvas, "ypos":0, "movement":1},
                {"canvas": mentalCanvas, "ypos":0, "movement":1}
              ]

//fills up a progress bar to corresponding percentage
function setProgressBar(canvasId,percent){ // canvas id, percent out of 100%
  var canvas = progressBars[canvasId].canvas
  var percentDecimal = percent/100
  var yCoord = 600 - (600 * percentDecimal)
  var height = 600 - yCoord

  canvas.beginPath();
  canvas.rect(0,yCoord, PROGRESS_BAR_WIDTH, height); //x, y, width, height
  canvas.fillStyle = "green";
  canvas.fill();
}

//moves the bar in a play bar to corresponding y coordinate
function setPlayBar(canvasId,yCoord){// canvas id, y coordinate of bar (0 is the top, 600 is bottom)
  var canvas = playBars[canvasId].canvas
  var barHeight = 170

  if((PLAY_BAR_HEIGHT - yCoord) < barHeight || yCoord < 0) {return} //stop the bar from going through the bottom of the canvas

  canvas.clearRect(0, 0, PLAY_BAR_WIDTH, PLAY_BAR_HEIGHT);
  canvas.beginPath();
  canvas.rect(0,yCoord, PLAY_BAR_WIDTH, 170); //x, y, width, height
  canvas.fillStyle = "green";
  canvas.fill();
  playBars[canvasId].ypos = yCoord
}


function barGravity(canvasId){
  var canvas = playBars[canvasId].canvas
  var currentYPos = playBars[canvasId].ypos
  var relativeMovement = playBars[canvasId].movement
  setPlayBar(canvasId,currentYPos+relativeMovement)
}

function setbarGravity(sign){

}

function setup(){
  setInterval(barGravity,1000/60,0)
  setInterval(barGravity,1000/60,1)
}

function keyPress(canvasId,isUp) {
  playBar = playBars[canvasId].canvas
  playBars[canvasId].movement = 1 * (isUp && 1 || -1)
}

setup()

setPlayBar(0,0)
setProgressBar(0,5)

setPlayBar(0,0)
setProgressBar(1,5)
