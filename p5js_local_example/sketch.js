var whichscreen = "maingame";

function setup() {
  createCanvas(1500, 690);
}

function draw() {
  if (whichscreen === "maingame") {
    mainGame();
  } else {
    endScreen();
  }
}

// All of your game logic can move into this function!
function mainGame() {
  background("black");

  // At some point, you'll have to decide when the game is
  // over: maybe once their lives drop to 0, or
  // if their score reaches a certain point.
  if (score === 1) {
    whichscreen = "endscreen";
  }
}

// Some little message to display once the game
// is over.
function endScreen() {
  background(0);
  textSize(80);
  text("GAME OVER", 515, 200);
  stroke();
}

// Adjust later on
function keyPressed() {
  if (keyCode === 66) {
    score = score + 1;
  }
}
