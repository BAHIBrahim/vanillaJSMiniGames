/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnemies = 20;
const enemies = [];
const enemy1Image = new Image();
enemy1Image.src = "resources/enemies/enemy1.png";
const enemy2Image = new Image();
enemy2Image.src = "resources/enemies/enemy2.png";
const enemy3Image = new Image();
enemy3Image.src = "resources/enemies/enemy3.png";
const enemy4Image = new Image();
enemy4Image.src = "resources/enemies/enemy4.png";

class Enemy1 {
  constructor(
    spriteWidth = 293,
    spriteHeight = 155,
    enemyImage = enemy1Image
  ) {
    this.x = Math.random()*CANVAS_WIDTH;
    this.y = Math.random()*CANVAS_HEIGHT;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = Math.floor(this.spriteWidth / 3);
    this.height = Math.floor(this.spriteHeight / 3);
    this.speedX = Math.floor(Math.random()*4)-2;
    this.speedY = Math.floor(Math.random()*4)-2;
    this.frameX = 0;
    this.enemyImage = enemyImage;
    this.numberOfFrames = 6;
  }

  update() {
    //Floating
    // this.x += Math.random()*5-2.5;
    // this.y += Math.random()*5-2.5;
    //Flying  
    this.x += this.speedX;
    this.y += this.speedY;
    // Bounce off the edges
    // if(this.x>=CANVAS_WIDTH-this.width || this.x<=0) this.speedX *=-1;
    // if(this.y>=CANVAS_HEIGHT-this.height || this.y<=0) this.speedY *=-1;
    // Pass through the edge
    if(this.x<-this.width) this.x=CANVAS_WIDTH;
    if(this.x>CANVAS_WIDTH) this.x=-this.width;
    if(this.y<-this.height) this.y=CANVAS_HEIGHT;
    if(this.y>CANVAS_HEIGHT) this.y=-this.height;

    //Flying, flap speed
    Math.floor(this.x)%1.5==0 || Math.floor(this.y)%1.5==0 || this.speedX==0 & this.speedY==0?this.frameX<this.spriteWidth*(this.numberOfFrames-1)?this.frameX+=this.spriteWidth:this.frameX=0:null;
    //Floating flap speed
    // Math.floor(this.x)%1.5 ==0 || Math.floor(this.y)%2==0?this.frameX<1465?this.frameX+=this.spriteWidth:this.frameX=0:null;
  }

  draw() {
    ctx.drawImage(this.enemyImage, this.frameX, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

class Enemy2 extends Enemy1 {
  constructor() {
    super(266,188,enemy2Image);
    this.speedX = -Math.random()*5;
    this.R = Math.random();
    this.speedSinusY = Math.random()*3;
    //super.speedY = 0;
  }

  update() {
    super.update();
    this.R+=Math.random()*0.3;
    this.speedSinusY = Math.sin(this.R)*3;
    Math.sin(this.R) == 0 && this.R>100?R=0:null;
  }
}

class Enemy3 extends Enemy1 {
  constructor() {
    super(218, 177, enemy3Image);
    this.speedX = 0;
    this.speedY = 0;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.angleSpeed = Math.random()*1.5+0.5;
  }

  update() {
    super.update();
    this.x = (canvas.width/2)*Math.sin(this.angle*Math.PI/90)+(canvas.width/2-this.width/2);
    this.y = (canvas.height/2)*Math.cos(this.angle*Math.PI/180)+(canvas.height/2-this.height/2);
    this.angle += this.angleSpeed;
  }
}

class Enemy4 extends Enemy1 {
  constructor() {
    super(213,212,enemy4Image);
    this.numberOfFrames = 9;
    this.speedX = 0;
    this.speedY = 0;
    this.gameFrame = 60;
    this.x = Math.random()*(canvas.width-this.width);
    this.y = Math.random()*(canvas.height-this.height);
    this.newX = 0;
    this.newY = 0;
    this.dx = 0;
    this.dy = 0;
    this.interval = Math.floor(Math.random()*100+55);
  }

  update() {
    super.update();
    if(this.gameFrame%this.interval==0){
      this.newX = Math.floor(Math.random()*(canvas.width-this.width));
      this.newY = Math.floor(Math.random()*(canvas.height-this.height));
    }
    this.dx = this.x-this.newX;
    this.dy = this.y-this.newY;
    this.x -= this.dx/55;
    this.y -= this.dy/55;
    this.gameFrame++;
  }
}

// initializing enemies
for(var i=0;i<numberOfEnemies;i++) {
  enemies.push(new Enemy1());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemies.forEach(enemy => {
    enemy.draw();
    enemy.update();
  });
  
  requestAnimationFrame(animate);
}

animate();