let balls = [];
let walls = [];
let cursor;
let crystals = [];
let powerUps = [];
let score = 0;
let wave = 1;
let superSpeedActive = false;
let boss;
let isBossActive = false;


function setup() {
  createCanvas(1500, 690);

  walls.push(new Wall(200, 150, 400, 20)); //  wall
  walls.push(new Wall(300, 300, 20, 200)); //  wall
  walls.push(new Wall(500, 500, 300, 20)); //  wall
  walls.push(new Wall(800, 200, 20, 300)); //  vertical wall
  walls.push(new Wall(1000, 400, 200, 20)); //  horizontal wall
  walls.push(new Wall(1200, 100, 20, 400)); // vertical wall

  cursor = new Cursor();

  balls.push(new Ball(random(width), random(height), wave));

  spawnCrystal();
}

function draw() {
  background(0);

  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    balls[i].display();

    if (balls[i].isColliding(cursor)) {
      balls.splice(i, 1);  
      cursor.die();  
      noLoop();
    }

    balls[i].checkWalls(walls);
  }

  for (let wall of walls) {
    wall.display();
  }

  cursor.update();
  cursor.display();

  if (balls.length === 0 && !isBossActive) {
    wave++;
    if (wave > 20) {
      isBossActive = true;
      boss = new Boss(width / 2, height / 2);
      balls = [];
    } else {
      for (let i = 0; i < Math.min(wave, 20); i++) {
        balls.push(new Ball(random(width), random(height), wave));
      }
    }
    spawnCrystal();

    if (wave >= 20 && powerUps.length === 0) {
      spawnPowerUp();
    }
  }

  for (let powerUp of powerUps) {
    powerUp.display();

    if (powerUp.isCollected(cursor)) {
      score += 10;
      powerUp.respawn();
      if (isBossActive) {
        boss.takeDamage(10);
        if (boss.health <= 0) {
          boss.die();
          isBossActive = false;
          wave = 1;
          balls.push(new Ball(random(width), random(height), wave));
        }
      }
    }
  }

  for (let crystal of crystals) {
    crystal.display();

    if (crystal.isCollected(cursor)) {
      score += 10; 
      crystal.respawn();
      wave++; 
      balls.push(new Ball(random(width), random(height), wave));
    }
  }

  if (isBossActive) {
    boss.update();
    boss.display();
  }
}

function spawnCrystal() {
  let x = random(20, width - 20);
  let y = random(20, height - 20);
  crystals.push(new Crystal(x, y));
}

function spawnPowerUp() {
  let x = random(20, width - 20);
  let y = random(20, height - 20);
  powerUps.push(new PowerUp(x, y));
}

class Ball {
  constructor(x, y, wave) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0); 
    this.radius = 10 + wave; 
    this.type = random(["chasing", "bouncing", "random"]); 
    this.color = color(random(255), random(255), random(255));
    this.wave = wave;

    // Prevents spawning nearby player
    while (dist(this.pos.x, this.pos.y, cursor.pos.x, cursor.pos.y) < 100) {
      this.pos = createVector(random(width), random(height));
    }

    if (this.type === "chasing") {
      let direction = cursor.pos.copy().sub(this.pos).normalize();
      this.vel = direction.mult(wave * 0.5); 
    } else if (this.type === "bouncing") {
      this.vel = p5.Vector.random2D().mult(wave * 0.75);
    } else {
      this.vel = p5.Vector.random2D().mult(wave * 0.75);
    }
  }

  update() {
    if (this.type === "chasing") {
      let direction = cursor.pos.copy().sub(this.pos).normalize();
      this.vel = direction.mult(this.wave * 0.5); // Adjustable ball speed
    }

    this.pos.add(this.vel);

    // makes sure it bounces off the canvas
    if (this.pos.x < this.radius || this.pos.x > width - this.radius) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.radius, width - this.radius);
    }
    if (this.pos.y < this.radius || this.pos.y > height - this.radius) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.radius, height - this.radius);
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  checkWalls(walls) {
    for (let wall of walls) {
      if (wall.isColliding(this)) {
        let normal = wall.getNormal(this);
        this.vel.reflect(normal);
        // Prevent ball from getting stuck in wall (needs fixing)
        this.pos.add(this.vel);
      }
    }
  }

  isColliding(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    return d < this.radius + other.radius;
  }
}

class Wall {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  display() {
    fill(100);
    noStroke();
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }

  isColliding(ball) {
    return (
      ball.pos.x + ball.radius > this.pos.x &&
      ball.pos.x - ball.radius < this.pos.x + this.w &&
      ball.pos.y + ball.radius > this.pos.y &&
      ball.pos.y - ball.radius < this.pos.y + this.h
    );
  }

  getNormal(ball) {
    let dx = max(this.pos.x - ball.pos.x, 0, ball.pos.x - (this.pos.x + this.w));
    let dy = max(this.pos.y - ball.pos.y, 0, ball.pos.y - (this.pos.y + this.h));
    if (dx > dy) {
      return createVector(1, 0);
    } else {
      return createVector(0, 1);
    }
  }
}
// Square display
class Cursor {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.speed = 1.5;
    this.radius = 10;
    this.dead = false;
  }

  update() {
    if (this.dead) return;

    let move = createVector(0, 0);
    if (keyIsDown(87)) move.y -= this.speed; // W
    if (keyIsDown(83)) move.y += this.speed; // S
    if (keyIsDown(65)) move.x -= this.speed; // A
    if (keyIsDown(68)) move.x += this.speed; // D

    if (superSpeedActive) {
      move.mult(2);
    }
// sliding effect (drifts yk)
    this.vel.add(move);
    this.vel.limit(10);  
    this.pos.add(this.vel);
    this.vel.mult(0.9);

    for (let wall of walls) {
      if (wall.isColliding(this)) {
        let normal = wall.getNormal(this);
        this.vel.reflect(normal);
        this.pos.add(this.vel);
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
      }
    }
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  display() {
    if (this.dead) return;
    push();
    translate(this.pos.x, this.pos.y);
    fill(255, 255, 0);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }

  die() {
    this.dead = true;
  }
}

class Crystal {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 15;
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }

  isCollected(cursor) {
    let d = dist(this.pos.x, this.pos.y, cursor.pos.x, cursor.pos.y);
    return d < this.size + cursor.radius;
  }

  respawn() {
    this.pos = createVector(random(20, width - 20), random(20, height - 20));
  }
}

class PowerUp {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 20;
  }

  display() {
    fill(255, 165, 0);
    noStroke();
    triangle(
      this.pos.x, this.pos.y - this.size / 2,
      this.pos.x - this.size / 2, this.pos.y + this.size / 2,
      this.pos.x + this.size / 2, this.pos.y + this.size / 2
    );
  }

  isCollected(cursor) {
    let d = dist(this.pos.x, this.pos.y, cursor.pos.x, cursor.pos.y);
    return d < this.size + cursor.radius;
  }

  // Spawns the items IN, IN canvas. IN. (was pain in the ass)
  respawn() {
    this.pos = createVector(random(20, width - 20), random(20, height - 20));
  }
}

class Boss {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 50;
    this.health = 200;
  }

  update() {
    let direction = cursor.pos.copy().sub(this.pos).normalize();
    let speed = 1.5;
    this.pos.add(direction.mult(speed));
  }

  // boss display (needs fixing too it not spawning)
  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  die() {
    this.pos = createVector(width / 2, height / 2); // makes sure the boss is in center when wave 20
  }
}
