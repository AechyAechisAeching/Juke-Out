
const options = {
  width: window.innerWidth,
  height: window.innerHeight
}
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


function setup() {
  canvas.width = options.width;
  canvas.height = options.height;

  requestAnimationFrame(loop)
}

function update() {

  
}

function draw() {
  console.log("draw");
}

function loop() {
update();
draw();
// debug()
}


// EVENTS
window.addEventListener('load', setup);



function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randFloat(min, max) {
  return Math.random() * (max - min + 1) + min;
}
