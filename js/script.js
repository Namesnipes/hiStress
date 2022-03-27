var PROGRESS_BAR_HEIGHT = 600
var PROGRESS_BAR_WIDTH = 30
var PLAY_BAR_HEIGHT = 600
var PLAY_BAR_WIDTH = 70

var BAR_HEIGHT = 170
var ITEM_HEIGHT = 30

var PLAY_BAR_IMG = new Image()
PLAY_BAR_IMG.src = "assets/playBar.png"

var RANDOM_SEED = Math.random() * 1000 // very cryptographically secure

var schoolbar = document.getElementById("schoolbar");
var schoolbarCanvas = schoolbar.getContext("2d");

var school = document.getElementById("school");
var schoolCanvas = school.getContext("2d");

var workbar = document.getElementById("workbar");
var workbarCanvas = workbar.getContext("2d");

var work = document.getElementById("work");
var workCanvas = work.getContext("2d");


var mentalbar = document.getElementById("mentalbar");
var mentalbarCanvas = mentalbar.getContext("2d");

var mental = document.getElementById("mental");
var mentalCanvas = mental.getContext("2d");



var progressBars = [
                    {"canvas": schoolbarCanvas, "percent": 0, "won": false},
                    {"canvas": workbarCanvas, "percent": 0, "won": false},
                    {"canvas": mentalbarCanvas, "percent": 0, "won": false}
                  ]

var schoolImage = new Image()
schoolImage.src = "assets/schoolIcon.png"

var workImage = new Image()
workImage.src = "assets/workIcon.png"

var mhImage = new Image()
mhImage.src = "assets/mentalIcon.png"

var playBars = [
                {"canvas": schoolCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "seed": Math.random() * 100000, "itemIcon": schoolImage},
                {"canvas": workCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "seed": Math.random() * 100000, "itemIcon": workImage},
                {"canvas": mentalCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "seed": Math.random() * 100000, "itemIcon": mhImage}
              ]

//fills up a progress bar to corresponding percentage
function setProgressBar(canvasId,percent){ // canvas id, percent out of 100%
  //if(progressBars[canvasId].won) percent = 100
  if(percent >= 100) {
    percent = 100
    progressBars[canvasId].won = true
  }
  if(percent < 0) percent = 0
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
  if(playBars[canvasId].itemIcon){
    canvas.drawImage(playBars[canvasId].itemIcon, 20,yCoord, PLAY_BAR_WIDTH-40, itemHeight); //x, y, width, height
  } else {
      canvas.rect(40,yCoord, PLAY_BAR_WIDTH-80, itemHeight); //x, y, width, height
  }
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

function changeProgress(canvasId,amount){
  var currentProgress = progressBars[canvasId].percent
  setProgressBar(canvasId, currentProgress + amount)
}



//main game loop, ran every 1/60 of a second
var t = new Perlin()
var runs = 0
function tick(){
  runs++
  for(var i = 0; i < playBars.length; i++){
      var currentBar = playBars[i]
      var currentProgress = progressBars[i]
      currentBar.canvas.clearRect(0, 0, PLAY_BAR_WIDTH, PLAY_BAR_HEIGHT);
      currentProgress.canvas.clearRect(0, 0, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT);

      //move play bar
      moveBar(i)

      //move item
      //speed 0-5 for school/work, mental health bar at bottom = 5 speed, mental health bar at top = 0 speed
      //0 - school, 1 - work, 2 - mental
      var stressorSpeed;
      if(i != 2){
        stressorSpeed = 1 - (progressBars[2].percent / 100)
      }
      var RANDOM_SEED = playBars[i].seed
      var randomYValue = t.getValue(runs/(500) + RANDOM_SEED) //returns a value 1 to -1 exclusive //Math.sin(2 * (RANDOM_SEED + runs/180)) + Math.sin(Math.PI * (RANDOM_SEED + runs/180))
      if(i == 0)console.log(randomYValue)
      setItem(i,300 + randomYValue*320)

      //move progress bar
      var barTop = currentBar.ypos
      var barBottom = currentBar.ypos + BAR_HEIGHT

      var itemTop = currentBar.itemYPos
      var itemBottom = currentBar.itemYPos + ITEM_HEIGHT

      if(itemTop > barTop && itemBottom < barBottom){
        changeProgress(i,0.2)
      } else {
        changeProgress(i,-0.05)
      }
  }
}

function setup(){
  for(var i = 0; i < progressBars.length; i++){
    changeProgress(i,50)
  }
  setInterval(tick,1000/60)
}

function keyPress(canvasId,isUp) {
  playBar = playBars[canvasId].canvas
  playBars[canvasId].movement = Math.abs(playBars[canvasId].movement) * (isUp && 1 || -1)
}


//start the game after user clicks play
var help = document.getElementById("helpbox");

function popUpClicked(){
  help.style.display = "none";
  setup()
}
document.getElementById("okbutton").addEventListener("click",popUpClicked)
