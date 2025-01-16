var whichscreen = "maingame";

function setup() {
  createCanvas(1520, 705);
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

  // right now the function is when your score is equal to 1 or higher it ends
  if (score === 1) {
    whichscreen = "endscreen";
  }
}


// Adjust later on
//Deathscreen here
// // Some little message to display once the game
// is over.
function endScreen() {
  background(0);
  textSize(80);
  text("GAME OVER", 515, 200);
  stroke();
}
