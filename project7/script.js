const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

class Enemy {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.spriteWidth = 160;
    this.spriteHeight = 119;
    this.ctx = ctx;
    this.size = (canvas.height-this.y)*0.005+1;
    this.width = this.spriteWidth/this.size;
    this.height = this.spriteHeight/this.size;
    this.previousTimeStamp = 0;
    this.frameX = 0;
    this.numberOfFrames = 6;
    this.speedX = Math.random()*3+2;
    this.timeInterval = Math.random()*this.speedX + 40;
    this.toBeDestroyed = false;
  }

  update(currentTimeStamp) {
    this.x -= this.speedX;
    if(currentTimeStamp - this.previousTimeStamp >= this.timeInterval){
      this.frameX ++;
      this.previousTimeStamp = currentTimeStamp;
    }
    if(this.frameX >= this.numberOfFrames) this.frameX = 0;
    if(this.x <= -this.width) this.toBeDestroyed = true;
  }

  draw() {
    // this.ctx.beginPath();
    // this.ctx.arc(this.x+this.width/2-10, this.y+this.height/2, this.width*0.5, 0, Math.PI*2);
    // ctx.stroke();
    this.ctx.drawImage(enemy, this.frameX*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

class InputHandler {
  constructor() {
    this.keys = []
    window.addEventListener("keydown", (e) => {
      if(this.keys.indexOf(e.key) == -1) this.keys.push(e.key);
    })
    window.addEventListener("keyup", (e) => {
      this.keys.splice(this.keys.indexOf(e.key),1);
    })
  }
}

class Player {
  constructor(x, y, ctx, inputhandler) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.frameX = 0;
    this.frameY = 0;
    this.numberOfFrames = 9;
    this.speedX = 10;
    this.speedY = 0;
    this.previousTimeStamp = 0;
    this.timeInterval = 50;
    this.onGround = true;
    this.weight = 2;
    this.inputhandler = inputhandler;
  }

  update(currentTimeStamp) {

    if(this.onGround == false) {
      this.frameY = 1;
      this.numberOfFrames = 7;
      this.y -= this.speedY;
      if(this.inputhandler.keys.indexOf("ArrowDown") == -1) this.speedY -= this.weight;
      else this.speedY -= 4*this.weight;
    }

    //frame movements
    if(currentTimeStamp - this.previousTimeStamp >= this.timeInterval){
      this.frameX ++;
      this.previousTimeStamp = currentTimeStamp;
    }
    if(this.frameX >= this.numberOfFrames) this.frameX = 0;

    //player movements
    if(this.inputhandler.keys.indexOf("ArrowRight") != -1) this.x += this.speedX;
    if(this.inputhandler.keys.indexOf("ArrowLeft") != -1) this.x -= this.speedX;

    
    if(this.inputhandler.keys.indexOf("ArrowUp") != -1 && this.onGround == true) {
      this.onGround = false;
      this.speedY = 40;
    }

    //limitations
    if(this.x < 0) this.x = 0;
    if(this.x > canvas.width-this.width) this.x=canvas.width-this.width;
    if(this.y > canvas.height-this.height) {
      this.onGround = true;
      this.numberOfFrames = 9;
      this.frameY = 0;
      this.y = canvas.height-this.height;
    }

  }
  draw() {
    // this.ctx.beginPath();
    // this.ctx.arc(this.x+this.width/2, this.y+this.height/2, this.width*0.44, 0, Math.PI*2);
    // ctx.stroke();
    this.ctx.drawImage(player, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

class Background {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.backgroundWidth = 2400;
    this.backgroundHeight = 720;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  update() {
    this.x > -this.backgroundWidth ? this.x-=6: this.x=0;
  }

  draw() {
    this.ctx.drawImage(background, this.x+this.backgroundWidth, 0);
    this.ctx.drawImage(background, this.x, 0);
  }
}

class Game {
  constructor(canvas, collisionCanvas, ctx, collisionCtx) {
    this.canvas = canvas;
    this.collisionCanvas = collisionCanvas;
    this.ctx = ctx;
    this.collisionCtx = collisionCtx;
    this.inputhandler = new InputHandler();
    this.player = new Player(0, canvas.height-200, this.ctx, this.inputhandler);
    this.enemies = [];
    this.addEnemyInterval = 5000;
    this.previousTimeStamp = 0;
    this.background = new Background(this.canvas, this.ctx);
    this.score = 0;
    this.gameOver = false;
  }

  update(currentTimeStamp) {
    if(currentTimeStamp-this.previousTimeStamp>=this.addEnemyInterval) {
      this.enemies.push(new Enemy(this.canvas.width*(1+Math.random()/4), (95/100+Math.random()*5/100)*this.canvas.height-70, this.ctx));
      this.enemies.sort((e,v) => {return e.y-v.y});
      this.previousTimeStamp = currentTimeStamp;
    }
    this.enemies.forEach(enemy => {
      if(enemy.toBeDestroyed) {
        this.enemies.splice(this.enemies.indexOf(enemy),1)
        this.score++;
      }
    });
    this.player.update(currentTimeStamp);
    this.enemies.forEach(enemy => enemy.update(currentTimeStamp));
    this.background.update();

    //check collision with player
    this.enemies.forEach(enemy => {
      if((this.player.x+this.player.width/2-enemy.x-enemy.width/2+10)**2+(this.player.y+this.player.height/2-enemy.y-enemy.height/2)**2 <= (this.player.width*0.44+enemy.width*0.5)**2) this.gameOver = true;
    })
  }

  draw() {
    this.background.draw();
    this.#displayScore();
    this.player.draw();
    this.enemies.forEach(enemy => enemy.draw());
  }

  #displayScore() {
    ctx.font = "40px Helvetica";
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+this.score, 25, 50);
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+this.score, 27, 52);
  }
}

var game = new Game(canvas, collisionCanvas, ctx, collisionCtx);

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
  //collisionCanvas.width = window.innerWidth;
  //collisionCanvas.height = window.innerHeight;
  game.update(timestamp);
  game.draw();

  if(!game.gameOver) requestAnimationFrame(animate);
}

animate();