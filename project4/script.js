const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;

const explosions = new Array();

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth*0.5;
    this.height = this.spriteHeight*0.5;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "resources/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.animationCompleted = false;
    this.angle = Math.random() * 6.28;
    this.sound = new Audio();
    this.sound.src = "resources/sfx/boom.wav"
  }

  update() {
    if(this.frame == 0) this.sound.play();
    this.timer++;
    this.timer%8 == 0? this.frame++:null;
    this.animationCompleted = this.frame >=5;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.spriteWidth*this.frame, 0, this.spriteWidth, this.spriteHeight, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  }
}

window.addEventListener("click", function(e) {
  let canvasPosition = canvas.getBoundingClientRect();
  let positionX = e.x - canvasPosition.x;
  let positionY = e.y - canvasPosition.y;
  console.log(e);
  console.log(canvasPosition);
  let explosion = new Explosion(positionX, positionY);
  explosions.push(explosion);
});


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i< explosions.length; i++){
    explosions[i].draw();
    explosions[i].update();
    if(explosions[i].animationCompleted) explosions.splice(i,1);
  }

  requestAnimationFrame(animate);
}

animate();