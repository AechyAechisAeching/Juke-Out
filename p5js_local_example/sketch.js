let balls = []; 
let square; 
let squareFace; 
let combinedImg; 
let ballsImage; 
let ballsface;
let combinedBallsImg;
let crystal;
let x = 0;
let y = 0;
let crystalObj;
//All preload assets (images for characters and enemies)
function preload() {
  square = loadImage("/assets/square.png");
  squareFace = loadImage("/assets/squareface.png");
  ballsImage = loadImage("/assets/balls.png");
  ballsface = loadImage("/assets/ballsface.png");
  crystal = loadImage("/assets/crystal.png");
}

let threshold = 30;
let accChangeX = 0;
let accChangeY = 0;
let accChangeT = 0;

// Continues on line 51
let gameOver = false;

// No editing of the width and height
// You will mess up the edge collision
// Okay Vincent? No touching.
function setup() {
  createCanvas(1500, 720);

  // Resizing Character
  combinedImg = createGraphics(40, 40); 
  combinedImg.image(square, 0, 0, 40, 40);
  combinedImg.image(squareFace, 0, 0, 40, 40);

  // Resizing enemies
  combinedBallsImg = createGraphics(40, 40);
  combinedBallsImg.image(ballsImage, 0, 0, 40, 40);
  combinedBallsImg.image(ballsface, 0, 0, 40, 40); 

  // Created amount of enemies in the canvas
  for (let i = 0; i < 5; i++) {
    balls.push(new Ball());
  }

  crystalObj = new Crystal();

  noCursor();
}

// Game Over Menu (fix later on)
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

  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].display();

    // Collision adjusts for square and enemies
    if (balls[i].checkCollision(mouseX - 20, mouseY - 20, 40, 40)) {
      gameOver = true;
    }
  }

  checkForShake();

  // Collision adjusts for cystal hitbox
  if (crystalObj.checkCollision(mouseX - 20, mouseY - 20, 40, 40)) {
    crystalObj.randomizePosition();
  }

  //Custom Cursor on everything
  image(combinedImg, mouseX - 20, mouseY - 20, 40, 40);
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
    // Slows ball movement speed (use for wave features)
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

  // canvas edge adjustments
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

 // SHAKE SHAKE SHAKE
  shake() {
    this.xspeed += random(5, accChangeX / 3);
    this.yspeed += random(5, accChangeX / 3);
  }

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
    image(combinedBallsImg, this.x, this.y, this.diameter, this.diameter);
  }

  // Square collision with enememies (its a check function)
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
    this.size = 40; // Size of the crystal
  }

  // Display the crystal
  display() {
    image(crystal, this.x, this.y, this.size, this.size);
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

  // Crystal Position Randomizer
  randomizePosition() {
    this.x = random(width - this.size);
    this.y = random(height - this.size);
  }
}
