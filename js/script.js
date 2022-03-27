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
                    {"canvas": schoolbarCanvas, "percent": 0, "won": false, "decreaseSpeed": 0.05, "losing": false},
                    {"canvas": workbarCanvas, "percent": 0, "won": false, "decreaseSpeed": 0.05, "losing": false},
                    {"canvas": mentalbarCanvas, "percent": 0, "won": false, "decreaseSpeed": 0.05, "losing": false}
                  ]

var schoolImage = new Image(33,33)
schoolImage.src = "assets/schoolIcon.png"

var workImage = new Image(42,24)
workImage.src = "assets/workIcon.png"

var mhImage = new Image(37,32)
mhImage.src = "assets/mentalIcon.png"

var playBars = [ // canvas, y positionof bar, movement speed of bar when you press a key, y position of item, item image, speed item moves, special var for calculating item position
                {"canvas": schoolCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "itemIcon": schoolImage, "itemSpeed":0.5, "itemPos":Math.random() * 100000},
                {"canvas": workCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "itemIcon": workImage, "itemSpeed":0.5, "itemPos":Math.random() * 100000},
                {"canvas": mentalCanvas, "ypos":600-BAR_HEIGHT, "movement":3, "itemYPos":300, "itemIcon": mhImage, "itemSpeed":0.5, "itemPos":Math.random() * 100000}
              ]

//fills up a progress bar to corresponding percentage
var emoticonElem = document.getElementById("level")
var lvl = 2

function setProgressBar(canvasId,percent){ // canvas id, percent out of 100%
  if(percent > 100) {
    percent = 100
  }
  if(percent < 0) percent = 0.01

  if(percent > 98){
    progressBars[canvasId].won = true
  } else {
    progressBars[canvasId].won = false
  }
  if(percent < 2){
    progressBars[canvasId].losing = true
  } else {
    progressBars[canvasId].losing = false
  }


  if(canvasId == 2 && lvl != Math.ceil(percent / 25)){
    console.log(Math.ceil(percent / 25))
    lvl = Math.ceil(percent / 25)
    var newEmote = "assets/level" + lvl + ".gif"
    emoticonElem.src = newEmote
  }

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
  var img = playBars[canvasId].itemIcon
  var itemHeight = img.height

  if((PLAY_BAR_HEIGHT - yCoord) < itemHeight) { //stop the bar from going through the bottom of the canvas
    setItem(canvasId, PLAY_BAR_HEIGHT - itemHeight)
    return
  } else if(yCoord < 0){
    setItem(canvasId, 0)
    return
  }

  canvas.beginPath();
  if(playBars[canvasId].itemIcon){
    canvas.drawImage(img, (PLAY_BAR_WIDTH-img.width)/2,yCoord, img.width, img.height); //x, y, width, height
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
var gameLoop;

function tick(){
  runs++
  var lost = true
  var won = true
  for(var i = 0; i < playBars.length; i++){
      var currentBar = playBars[i]
      var currentProgress = progressBars[i]
      currentBar.canvas.clearRect(0, 0, PLAY_BAR_WIDTH, PLAY_BAR_HEIGHT);
      currentProgress.canvas.clearRect(0, 0, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT);
      lost = lost && currentProgress.losing
      won = won && currentProgress.won

      //move play bar
      moveBar(i)

      //move item
      //speed 0-5 for school/work, mental health bar at bottom = 5 speed, mental health bar at top = 0 speed
      //0 - school, 1 - work, 2 - mental
      var stressorSpeed;
      var img = playBars[i].itemIcon

      if(i != 2){
        stressorSpeed = 1 - (progressBars[2].percent / 100)
      }
      var itemPos = playBars[i].itemPos
      var itemSpeed = playBars[i].itemSpeed
      var randomYValue = t.getValue((itemPos+itemSpeed)/(500)) //returns a value 1 to -1 exclusive //Math.sin(2 * (RANDOM_SEED + runs/180)) + Math.sin(Math.PI * (RANDOM_SEED + runs/180))
      playBars[i].itemPos = (itemPos+itemSpeed)
      playBars[i].itemSpeed = 0.25 * Math.pow(100,stressorSpeed)
      setItem(i,300 + randomYValue*(320) + (i==2 && -170))

      //move progress bar
      currentProgress.decreaseSpeed = 0.005 * Math.pow(100,stressorSpeed)
      var barTop = currentBar.ypos
      var barBottom = currentBar.ypos + BAR_HEIGHT

      var itemTop = currentBar.itemYPos
      var itemBottom = currentBar.itemYPos + img.height

      if(itemTop >= barTop && itemBottom <= barBottom){
        changeProgress(i,0.1)
      } else {
        changeProgress(i,-currentProgress.decreaseSpeed)
      }
  }

  if(won){
    console.log("WINNER!!!!!!!")
    clearInterval(gameLoop)
    onWin()
  }

  if(lost){
    console.log("LOSERR!!!!!!!")
    clearInterval(gameLoop)
    onLose()
  }
}

function setup(){
  for(var i = 0; i < progressBars.length; i++){
    changeProgress(i,50)
  }
  gameLoop = setInterval(tick,1000/60)
}

function keyPress(canvasId,isUp) {
  playBar = playBars[canvasId].canvas
  playBars[canvasId].movement = Math.abs(playBars[canvasId].movement) * (isUp && 1 || -1)
}


function onWin(){
  var win = document.getElementById("winbox");
  win.style.display = "block";
}

function onLose(){
  var lose = document.getElementById("losebox");
  lose.style.display = "block";
}

//start the game after user clicks play
var help = document.getElementById("helpbox");

function popUpClicked(){
  help.style.display = "none";
  setup()
}
document.getElementById("okbutton").addEventListener("click",popUpClicked)
