var whichscreen = "start"
var score = 0
let fontBold;


function setup() {
  createCanvas(1500, 690);
}

function draw() {
  
  if (whichscreen === "start") {
    startScreen()
  } else if (whichscreen === "maingame") {
    mainGame()
  } else {
    endScreen()
  }
}

function startScreen() {
  background("black");
  textSize(80);
  fill(250);
  text("JUKE", 650, 130);
  text("OUT", 670, 230);
  textSize(100);
  text("PLAY NOW", 500, 530);
  
  if (keyIsPressed) {
    whichscreen = "maingame"
  }
}

// all of your game logic can move into this
// function!
function mainGame() {
  background("pink")
  text("GAMEPLAY, continue", 50, 200, 300)
  
  // at some point you'll have to decide when the game is
  // over: maybe once their lives drop to 0, or
  // if their score reaches a certain point.
  if (score === 1) {
    whichscreen = "endscreen"
  }
}

// some little message to display once the game
// is over.
function endScreen() {
  background(0)
  textSize(80)
  text("GAME OVER", 515, 200)
  stroke()

  // text("PLAY AGAIN", 200, 100)


  // text("RETURN TO THE MENU", 50, 10)

}


function keyPressed() {
  if (keyCode === 66) {
    score = score + 1
  }
}