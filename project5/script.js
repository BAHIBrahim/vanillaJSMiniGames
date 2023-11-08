const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const ravenImage = new Image();
ravenImage.src = "resources/raven.png";

const explosionImage = new Image();
explosionImage.src = "resources/boom.png";

let timeToNextRaven = 0;
let ravenInterval = 1000;
let lastTime = 0;
var score = 0;
let gameOver = false;

let ravens = []
let explosions = []

window.addEventListener("click",(e) => {
  const pc = collisionCtx.getImageData(e.x, e.y, 1, 1).data;

  ravens.forEach(item => {
    if(item.randomColors[0] == pc[0] && item.randomColors[1] == pc[1] && item.randomColors[2] == pc[2]) {
      item.markedForDeletion = true;
      score++;
    }
  })
});

class Raven {
  constructor() {
    this.image = ravenImage;
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.size = Math.random()*2+2;
    this.width = this.spriteWidth/this.size;
    this.height = this.spriteHeight/this.size;
    this.x = canvas.width;
    this.y = Math.random() * canvas.height - this.height;
    this.frame = 0;
    this.numberOfFrames = 6;
    this.counter = 2;
    this.flappingSpeed = Math.floor(Math.random()*5)+3;
    this.randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    this.color = "rgb("+this.randomColors[0]+","+this.randomColors[1]+","+this.randomColors[2]+")";
    this.markedForDeletion = false;

    this.speedX = -Math.random()*3;
    this.speedY = Math.random()*6-3;
  }

  update(){
    // if(this.x<= -this.width) this.x = canvas.width;
    if(this.x<= -this.width) gameOver = true;
    if(this.y< -this.height) this.y = canvas.height;
    if(this.y> canvas.height) this.y = -this.height;
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.counter%this.flappingSpeed == 0) this.frame++;
    if(this.counter > 100 && this.counter%this.flappingSpeed == 0) this.counter = this.flappingSpeed;
    this.counter++;
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, (this.frame%this.numberOfFrames)*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

class Explosion {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth/this.size;
    this.height = this.spriteHeight/this.size;
    this.frame = 0;
    this.image = explosionImage;
    this.toBeDestroyed = false;
    this.explosionSound = new Audio();
    this.explosionSound.src = "resources/sfx/boom.flac"
    this.explosionSound.play();
    this.counter = 0;
  }

  update() {
    this.counter++;
    if(this.counter%5 == 0) this.frame++;
    if(this.frame>=5) this.toBeDestroyed = true;
  }

  draw() {
    ctx.drawImage(this.image, this.spriteWidth*this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "40px Verdana";
  ctx.fillText("Score: "+score, 0, 40);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillText("Game Over, your score is: "+score, canvas.width/2, canvas.height/2);
}

function animate(timestamp) {
  collisionCanvas.width = canvas.width = window.innerWidth;
  collisionCanvas.height = canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
  let deltaTime = timestamp - lastTime;
  if(deltaTime > ravenInterval) {
    ravens.push(new Raven());
    ravens.sort(function(a,b) {
      return a.width - b.width;
    })
    lastTime = timestamp;
  }
  drawScore();
  ravens.forEach(e => {
    e.draw();
    e.update();
    if(e.markedForDeletion) {
      ravens.splice(ravens.indexOf(e),1);
      explosions.push(new Explosion(e.x, e.y, e.size));
    }
  })
  explosions.forEach(e => {
    e.draw();
    e.update();
    if(e.toBeDestroyed) explosions.splice(explosions.indexOf(e),1);
  })
  if(!gameOver) requestAnimationFrame(animate);
  else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    drawGameOver();
  }
}

animate();