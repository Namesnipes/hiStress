var PROGRESS_BAR_HEIGHT = 600
var PROGRESS_BAR_WIDTH = 30
var PLAY_BAR_HEIGHT = 600
var PLAY_BAR_WIDTH = 70

var BAR_HEIGHT = 170
var ITEM_HEIGHT = 30

var PLAY_BAR_IMG = new Image()
PLAY_BAR_IMG.src = "assets/playBar.png"

var RANDOM_SEED = Math.random() * 1000 // very cryptographically secure

var workbar = document.getElementById("workbar");
var workbarCanvas = workbar.getContext("2d");

var work = document.getElementById("work");
var workCanvas = work.getContext("2d");


var mentalbar = document.getElementById("mentalbar");
var mentalbarCanvas = mentalbar.getContext("2d");

var mental = document.getElementById("mental");
var mentalCanvas = mental.getContext("2d");

var progressBars = [
                    {"canvas": workbarCanvas, "percent": 0},
                    {"canvas": mentalbarCanvas, "percent": 0}
                  ]


var playBars = [
                {"canvas": workCanvas, "ypos":0, "movement":3, "itemYPos":300, "seed": Math.random() * 100000},
                {"canvas": mentalCanvas, "ypos":0, "movement":3, "itemYPos":300, "seed": Math.random() * 100000}
              ]

//fills up a progress bar to corresponding percentage
function setProgressBar(canvasId,percent){ // canvas id, percent out of 100%
  if(percent > 100) percent = 100
  var canvas = progressBars[canvasId].canvas
  var percentDecimal = percent/100
  var yCoord = 600 - (600 * percentDecimal)
  var height = 600 - yCoord

  canvas.beginPath();
  canvas.rect(0,yCoord, PROGRESS_BAR_WIDTH, height); //x, y, width, height
  canvas.fillStyle = "#88e3a2";
  canvas.fill();
  progressBars[canvasId].percent = percent
}

//moves the bar in a play bar to corresponding y coordinate
function setPlayBar(canvasId,yCoord){// canvas id, y coordinate of bar (0 is the top, 600 is bottom)
  var canvas = playBars[canvasId].canvas
  var barHeight = BAR_HEIGHT

  if((PLAY_BAR_HEIGHT - yCoord) < barHeight) { //stop the bar from going through the bottom of the canvas
    setPlayBar(canvasId, PLAY_BAR_HEIGHT - barHeight)
    return
  } else if(yCoord < 0){
    setPlayBar(canvasId, 0)
    return
  }

  canvas.beginPath();
  canvas.drawImage(PLAY_BAR_IMG, 0,yCoord, PLAY_BAR_WIDTH, barHeight); //x, y, width, height
  canvas.fillStyle = "#88e3a2";
  canvas.fill();
  playBars[canvasId].ypos = yCoord
}

//moves the item corresponding to the canvasId to the y coordinate
function setItem(canvasId, yCoord){
  var canvas = playBars[canvasId].canvas
  var itemHeight = ITEM_HEIGHT

  if((PLAY_BAR_HEIGHT - yCoord) < itemHeight) { //stop the bar from going through the bottom of the canvas
    setItem(canvasId, PLAY_BAR_HEIGHT - itemHeight)
    return
  } else if(yCoord < 0){
    setItem(canvasId, 0)
    return
  }

  canvas.beginPath();
  canvas.rect(20,yCoord, PLAY_BAR_WIDTH-40, itemHeight); //x, y, width, height
  canvas.fillStyle = "black";
  canvas.fill();

  playBars[canvasId].itemYPos = yCoord
}

//moves bar up or down depending on whether user is holding down the key
function moveBar(canvasId){
  var canvas = playBars[canvasId].canvas
  var currentYPos = playBars[canvasId].ypos
  var relativeMovement = playBars[canvasId].movement
  setPlayBar(canvasId,currentYPos+relativeMovement)
}

function increaseProgress(canvasId){
  var currentProgress = progressBars[canvasId].percent
  setProgressBar(canvasId, currentProgress + 0.1)
}



//main game loop, ran every 1/60 of a second
var t = new Perlin()
var runs = 0
function tick(){
  runs++
  for(var i = 0; i < playBars.length; i++){
      var currentBar = playBars[i]
      currentBar.canvas.clearRect(0, 0, PLAY_BAR_WIDTH, PLAY_BAR_HEIGHT);
      moveBar(i)

      var RANDOM_SEED = playBars[i].seed
      var randomYValue = t.getValue(runs/180 + RANDOM_SEED) //Math.sin(2 * (RANDOM_SEED + runs/180)) + Math.sin(Math.PI * (RANDOM_SEED + runs/180))
      setItem(i,300 + randomYValue*320)

      var barTop = currentBar.ypos
      var barBottom = currentBar.ypos + BAR_HEIGHT

      var itemTop = currentBar.itemYPos
      var itemBottom = currentBar.itemYPos + ITEM_HEIGHT

      if(itemTop > barTop && itemBottom < barBottom){
        increaseProgress(i)
      }
  }
}

function setup(){
  setPlayBar(0,0)
  setProgressBar(0,5)

  setPlayBar(0,0)
  setProgressBar(1,5)

  setInterval(tick,1000/60)
}

function keyPress(canvasId,isUp) {
  playBar = playBars[canvasId].canvas
  playBars[canvasId].movement = Math.abs(playBars[canvasId].movement) * (isUp && 1 || -1)
}
var help = document.getElementById("helpbox");
function popUp(){
  help.style.display = "none";
}
document.getElementById("okbutton").addEventListener("click",popUp)

setup()
