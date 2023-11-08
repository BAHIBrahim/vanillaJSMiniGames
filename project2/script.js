const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 800;
const CANAVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 3;

const slider = document.getElementById("slider");
slider.value = gameSpeed;

const showGameSpeed = document.getElementById("showGameSpeed");
showGameSpeed.innerHTML = gameSpeed;

slider.addEventListener("change", function(e) {
  gameSpeed = e.target.value;
  showGameSpeed.innerHTML = gameSpeed;
})

const backgroundLayer1 = new Image();
backgroundLayer1.src = "resources/backgroundLayers/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "resources/backgroundLayers/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "resources/backgroundLayers/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "resources/backgroundLayers/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "resources/backgroundLayers/layer-5.png";

class Layer {
  constructor(x, image, speedCoef) {
    this.x = x;
    this.image = image;
    this.speedCoef = speedCoef;
  }
  update() {
    this.x>-2400?this.x-=gameSpeed*this.speedCoef:this.x=0;
  }

  draw() {
    ctx.drawImage(this.image, this.x, 0);
    ctx.drawImage(this.image, this.x+2400, 0);
  }
}

let Layers = [
  new Layer(0, backgroundLayer1, 5),
  new Layer(0, backgroundLayer2, 3),
  new Layer(0, backgroundLayer3, 4),
  new Layer(0, backgroundLayer4, 2),
  new Layer(0, backgroundLayer5, 1)
]

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANAVAS_HEIGHT);
  Layers.forEach(e => {
    e.draw();
    e.update();
  })
  
  requestAnimationFrame(animate);
}

animate();