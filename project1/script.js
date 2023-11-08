var playerState = "idle";
const dropdown = document.getElementById("animations");
dropdown.addEventListener("change", function(e) {
  playerState = e.target.value;
}) 

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

var spriteAnimations = {
  "idle": {frameY: 0, numberOfFrames: 7},
  "jump": {frameY: 1, numberOfFrames: 7},
  "fall": {frameY: 2, numberOfFrames: 7},
  "sprint": {frameY: 3, numberOfFrames: 9},
  "dizzy": {frameY: 4, numberOfFrames: 11},
  "sit": {frameY: 5, numberOfFrames: 5},
  "roll": {frameY: 6, numberOfFrames: 6},
  "bite": {frameY: 7, numberOfFrames: 6},
  "collapse": {frameY: 8, numberOfFrames: 12},
  "dance": {frameY: 9, numberOfFrames: 4}
}

const playerImage = new Image();
playerImage.src = "resources/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

var frameX = 0;
var frameY = 0;
var gameFrame = 0;
var numberOfFrames = 0;
var reduceFrameSpeed = 5;

function animate() {
  frameY = spriteAnimations[playerState].frameY;
  numberOfFrames = spriteAnimations[playerState].numberOfFrames;
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(playerImage, frameX*spriteWidth, spriteHeight*frameY, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  frameX = Math.floor(gameFrame/reduceFrameSpeed) % numberOfFrames
  gameFrame++;
  
  requestAnimationFrame(animate);
}

animate();