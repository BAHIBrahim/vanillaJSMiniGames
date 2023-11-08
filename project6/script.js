const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Enemy {
  constructor(x, y, spriteWidth, spriteHeight, size, timeInterval, numberOfFrames, enemyImage, displayWidth, displayHeight) {
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.size = size <=0? Math.random()*2+1:size;
    this.width = this.spriteWidth/this.size;
    this.height = this.spriteHeight/this.size;
    this.x = x;
    this.y = y;
    this.timeInterval = timeInterval;
    this.frame = 0;
    this.numberOfFrames = numberOfFrames;
    this.previousTimeStamp = 0;
    this.enemyImage = enemyImage;
    this.speedX = 0;
    this.speedY = 0;
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
  }

  update(currentTimeStamp) {
    if(currentTimeStamp-this.previousTimeStamp>=this.timeInterval) {
      this.previousTimeStamp = currentTimeStamp;
      this.frame++;
    }
  }

  draw() {
    ctx.drawImage(this.enemyImage, this.spriteWidth*(this.frame%this.numberOfFrames), 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

class Ghost extends Enemy {
  constructor(x, y, displayWidth, displayHeight) {
    super(x, y, 261, 209, 3, 50, 6, ghost, displayWidth, displayHeight)
    this.speedX = Math.random()*3+1;
    this.opacity = Math.random()*0.5+0.5;
    this.angle = 0;
    this.amplitude = Math.random()*3;
  }

  update(currentTimeStamp) {
    super.update(currentTimeStamp);
    this.x -= this.speedX;
    this.angle += 0.04;
    this.y += Math.sin(this.angle)*this.amplitude;
    if(this.x<=-this.width){
      this.x = this.displayWidth;
      this.y = Math.random()*this.displayHeight;
    };
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    super.draw();
    ctx.restore();
  }
}

class Spider extends Enemy {
  constructor(x, y, displayWidth, displayHeight) {
    super(x, y,310, 175, 3, 50, 6, spider, displayWidth, displayHeight);
    this.angle = 0;
    this.amplitude = Math.random()*5;
  }

  draw() {
    this.angle += 0.04;
    this.y -= Math.sin(this.angle)*this.amplitude;
    ctx.beginPath();
    ctx.moveTo(this.x+this.width/2,0);
    ctx.lineTo(this.x+this.width/2,this.y+10);
    ctx.stroke();
    super.draw();
  }
}

class Worm extends Enemy {
  constructor(x, y, displayWidth, displayHeight) {
    super(x, y,229, 171, 3, 50, 6, worm, displayWidth, displayHeight);
    this.speedX = Math.random()+1;
    this.x = this.x - this.width;
    this.y = this.y - this.height;
  }

  update(currentTimeStamp) {
    super.update(currentTimeStamp);
    this.x -= this.speedX;
    if(this.x<=-this.width) this.x = this.displayWidth;
  }
}

class Game {
  constructor(displayWidth, displayHeight, numberOfGhosts, numberOfSpiders, numberOfworms) {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.ghosts = [];
    this.spiders = [];
    this.worms = [];
    for(var i=0;i<numberOfGhosts;i++){
      this.ghosts.push(new Ghost(Math.random()*displayWidth, Math.random()*displayHeight, displayWidth, displayHeight));
    }
    for(var i=0;i<numberOfSpiders;i++){
      this.spiders.push(new Spider(Math.random()*displayWidth, Math.random()*displayHeight, displayWidth, displayHeight));
    }
    for(var i=0;i<numberOfworms;i++){
      this.worms.push(new Worm(Math.random()*displayWidth, displayHeight, displayWidth, displayHeight));
    }
  }

  update(currentTimeStamp){
    this.ghosts.forEach(ghost => ghost.update(currentTimeStamp));
    this.spiders.forEach(spider => spider.update(currentTimeStamp));
    this.worms.forEach(worm => worm.update(currentTimeStamp));
  }

  draw(){
    this.ghosts.forEach(ghost => ghost.draw());
    this.spiders.forEach(spider => spider.draw());
    this.worms.forEach(worm => worm.draw());
  }
}

var game = new Game(canvas.width, canvas.height, 5, 8, 7);

function animate(timestamp) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  game.draw();
  game.update(timestamp);

  requestAnimationFrame(animate);
}

animate();