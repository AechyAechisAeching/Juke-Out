let balls = []; // Initialize balls as an empty array
let square;
let squareFace;
let combinedImg;
let ballsImage;
let ballsface;
let combinedBallsImg;
let crystal;
let crystalObj;
let squareLoaded = false;
let ballsLoaded = false;
let crystalLoaded = false;

// Preload assets (images for characters and enemies)
function preload() {
  square = loadImage(
    "/assets/square.png",
    () => {
      console.log("Square loaded successfully");
      squareLoaded = true;
    },
    () => console.error("Failed to load square.png")
  );
  squareFace = loadImage(
    "/assets/squareFace.png",
    () => console.log("SquareFace loaded successfully"),
    () => console.error("Failed to load squareFace.png")
  );
  ballsImage = loadImage(
    "/assets/balls.png",
    () => {
      console.log("BallsImage loaded successfully");
      ballsLoaded = true;
    },
    () => console.error("Failed to load balls.png")
  );
  ballsface = loadImage(
    "/assets/ballsface.png",
    () => console.log("BallsFace loaded successfully"),
    () => console.error("Failed to load ballsface.png")
  );
  crystal = loadImage(
    "/assets/crystal.png",
    () => {
      console.log("Crystal loaded successfully");
      crystalLoaded = true;
    },
    () => console.error("Failed to load crystal.png")
  );
}

let threshold = 30;
let accChangeX = 0;
let accChangeY = 0;
let accChangeT = 0;
let gameOver = false;

// No editing of the width and height
// You will mess up the edge collision
// Okay? No touching.
function setup() {
  createCanvas(1500, 720);

  // Combine square and squareFace images
  combinedImg = createGraphics(40, 40);
  if (squareLoaded) {
    combinedImg.image(square, 0, 0, 40, 40);
    combinedImg.image(squareFace, 0, 0, 40, 40);
  }

  // Combine ballsImage and ballsface images
  combinedBallsImg = createGraphics(40, 40);
  if (ballsLoaded) {
    combinedBallsImg.image(ballsImage, 0, 0, 40, 40);
    combinedBallsImg.image(ballsface, 0, 0, 40, 40);
  }

  // Create multiple enemies
  for (let i = 0; i < 30; i++) {
    balls.push(new Ball());
  }

  // Create crystal object
  crystalObj = new Crystal();

  noCursor();
}

// Game Over Menu
function draw() {
  if (gameOver) {
    background(0);
    fill(255, 0, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    return;
  }

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  background(0);

  // Update and display balls
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].display();

    // Check collision with player
    if (balls[i].checkCollision(mouseX - 20, mouseY - 20, 40, 40)) {
      gameOver = true;
    }
  }

  // Check for device shake
  checkForShake();

  // Check collision with crystal
  if (crystalObj.checkCollision(mouseX - 20, mouseY - 20, 40, 40)) {
    crystalObj.randomizePosition();
  }

  // Display custom cursor and crystal
  if (squareLoaded) {
    image(combinedImg, mouseX - 20, mouseY - 20, 40, 40);
  } else {
    fill(255);
    rect(mouseX - 20, mouseY - 20, 40, 40);
  }

  crystalObj.display();
}

function checkForShake() {
  accChangeX = abs(accelerationX - pAccelerationX);
  accChangeY = abs(accelerationY - pAccelerationY);
  accChangeT = accChangeX + accChangeY;

  if (accChangeT >= threshold) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].shake();
      balls[i].turn();
    }
  } else {
    // Slow down ball movement
    for (let i = 0; i < balls.length; i++) {
      balls[i].stopShake();
      balls[i].turn();
    }
  }
}

// BALLERS
class Ball {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(30, 60);
    this.xspeed = random(-2, 8);
    this.yspeed = random(-2, 2);
    this.direction = 1.7;

    // Original speed for slowing down
    this.oxspeed = this.xspeed;
    this.oyspeed = this.yspeed;
  }

  move() {
    this.x += this.xspeed * this.direction;
    this.y += this.yspeed * this.direction;
  }

  // Canvas edge adjustments
  turn() {
    if (this.x < 0) {
      this.x = 0;
      this.direction = -this.direction;
    } else if (this.y < 0) {
      this.y = 0;
      this.direction = -this.direction;
    } else if (this.x > width - this.diameter) {
      this.x = width - this.diameter;
      this.direction = -this.direction;
    } else if (this.y > height - this.diameter) {
      this.y = height - this.diameter;
      this.direction = -this.direction;
    }
  }

  // Increase speed on shake
  shake() {
    this.xspeed += random(5, accChangeX / 3);
    this.yspeed += random(5, accChangeX / 3);
  }

  // Restore original speed
  stopShake() {
    if (this.xspeed > this.oxspeed) {
      this.xspeed -= 0.6;
    } else {
      this.xspeed = this.oxspeed;
    }
    if (this.yspeed > this.oyspeed) {
      this.yspeed -= 0.6;
    } else {
      this.yspeed = this.oyspeed;
    }
  }

  display() {
    if (ballsLoaded) {
      image(combinedBallsImg, this.x, this.y, this.diameter, this.diameter);
    } else {
      fill(255, 0, 0);
      ellipse(this.x + this.diameter / 2, this.y + this.diameter / 2, this.diameter);
    }
  }

  // Check collision with the player
  checkCollision(sqX, sqY, sqWidth, sqHeight) {
    return (
      this.x < sqX + sqWidth &&
      this.x + this.diameter > sqX &&
      this.y < sqY + sqHeight &&
      this.y + this.diameter > sqY
    );
  }
}

class Crystal {
  constructor() {
    this.x = random(width - 40); // Initial random position
    this.y = random(height - 40);
    this.size = 20; // Size of the crystal
  }

  // Display the crystal
  display() {
    if (crystalLoaded) {
      image(crystal, this.x, this.y, this.size, this.size);
    } else {
      fill(0, 255, 255);
      rect(this.x, this.y, this.size, this.size);
    }
  }

  // Check collision with the square
  checkCollision(sqX, sqY, sqWidth, sqHeight) {
    return (
      this.x < sqX + sqWidth &&
      this.x + this.size > sqX &&
      this.y < sqY + sqHeight &&
      this.y + this.size > sqY
    );
  }

  // Randomize crystal position
  randomizePosition() {
    this.x = random(width - this.size);
    this.y = random(height - this.size);
  }
}
