const maxSpeed = 12;
const moveAccel = 0.4;
const gravitySpeed = 0.2;

let bg;
let gameOver
let xSpeed = 0;
let ySpeed = -3;
let xAccel = 0;
let yAccel = gravitySpeed;

let playerX;
let playerY;
let playerDiameter = 100;
let playerColor;
let laserBase;

let score = 0;

function laser(y1, y2)
{
   this.y1 = y1;
   this.y2 = y2;
   this.animTime = 0;
   this.endTime = 10;
   this.curFrame = 0;
   this.lifeTime = 70;
   this.activeTime = 60;
   this.curTime = 0;
   this.handleLaser = function()
   {
      if(++this.curTime > this.activeTime)
     {
       //Find Y based on Y = mx+b; //
       m  = (y2-y1)/(width);
       //B is y1 if solved
       
       checkY = m * playerX + y1;
       //print((playerY + playerDiameter/2  >  checkY ) + " && " + (playerY + playerDiameter/2 < checkY) );
       if(playerY + playerDiameter/2 > checkY && playerY - playerDiameter/2 < checkY)
       {
         setup();
       }
     }
     
     if(this.curTime > this.lifeTime)
     {
       lasers.shift(); // deletes first element (dequeue)
     }
   };
   this.drawLaser = function()
   {
     if(this.animTime++ > this.endTime)
     {
       this.animTime = 0;
       this.curFrame = ++this.curFrame % laserAnim.length;
     }
     let img = laserAnim[this.curFrame];
     print("curFrame: " + this.curFrame);
     if (this.curFrame % 2 == 1 || this.curTime > this.activeTime)
     {
       if(this.curTime > this.activeTime) // Greater than 80%
       {
         stroke(255,0,0);
       }
       else
       {
         stroke(255,255,0);
       }
       line(img.width/2,y1,width-img.width/2,y2);
     }
     image(img, 0, y1);
     push();
     scale(-1,1)
     image(img, -width, y2);
     pop();
     
   };
}

let lasers = [];
let curTime = 0;
let laserTime = 240;


const laserAnim = [];

function preload() { 
  //https://www.freepik.com/premium-vector/steel-wall-cartoon-seamless-pattern_4367274.htm
  bg = loadImage("assets/background.jpg");
  laserAnim.push(loadImage("assets/laser0.png"));
  laserAnim.push(loadImage("assets/laser1.png"));
}

function setup() {
  createCanvas(1600, 800);
  playerX = width/2 - playerDiameter/2;
  playerY = height/2 - playerDiameter/2;
  print(playerX + '-' + playerY);
  playerColor = color(random(255),random(255),random(255));
  bg.resize(width*4,height*4);
  imageMode(CENTER);
  textAlign(CENTER);
  gameOver = true;
  lasers = [];
  xSpeed = random(-5,5);
  ySpeed = random(-5,5);
}

function draw() {
  image(bg,0,0);
  if(gameOver)
  {
    fill(255, 172, 94);
    textSize(48);
    text("-- Uncontrollable --", width/2, height/2 - 120);
    
    textSize(24);
    text("-- Created by Gabe Kotton --", width/2, height/2 - 80);
    
    if(score > 0)
    {
      fill(252, 228, 40);
      text("SCORE: " + score, width/2, height/2 + 80);
    }
    return;
  }
  score += 7.5; // This number is the "Difficulty"
  fill(playerColor);
  playerX += xSpeed;
  if(abs(xSpeed+xAccel) < maxSpeed)
  {
    xSpeed += xAccel;
  }
  playerY += ySpeed;
  ySpeed += yAccel;
  checkCollisions();
  
  if(curTime++ > laserTime - (score / 100))
  {
    curTime  = 0;
    addLaser();
  }
  
  //Reverse array to prevent concurrent modification errors.
  for(let i = lasers.length -1; i >= 0; i--)
  {
    print("Length: " + lasers.length);
    let myLaser = lasers[i]; // Good convention to make code more readible and operator faster
    myLaser.drawLaser();
    myLaser.handleLaser();
  }
  
  circle(playerX, playerY, playerDiameter);
  
  
}

function keyPressed()
{
  
  if(keyCode == 13 && gameOver) // If enter is pressed and game is over
  {
    score = 0;
    gameOver = false;
  }  
  
  if(key == 'w' || key == 'W' || keyCode == UP_ARROW)
  {
     yAccel = gravitySpeed / 2;
  }
  
  if(key == 's' || key == 'S' || keyCode == DOWN_ARROW)
  {
     yAccel = gravitySpeed + moveAccel;
  }
  
  if(key == 'a' || key == 'A' || keyCode == LEFT_ARROW)
  {
    xAccel = -moveAccel;
  }
  
  if(key == 'd' || key == 'D' || keyCode == RIGHT_ARROW)
  {
    xAccel = moveAccel;
  }
}

function keyReleased()
{
  if(key == 's' || key == 'S' || keyCode == DOWN_ARROW || key == 'w' || key == 'W' || keyCode == UP_ARROW)
  {
     yAccel = gravitySpeed;
  }
  
  if(key == 'a' || key == 'A' || keyCode == LEFT_ARROW || key == 'd' || key == 'D' || keyCode == RIGHT_ARROW)
  {
    xAccel = 0;
  }
}

function addLaser()
{
  let y = random(height);
  let y2 = random(height);
  
  lasers.push(new laser(y, y2));
}

function checkCollisions()
{
  let r = playerDiameter/2; // This is here becus powerups
  if(playerX + r > width || playerX < -r)
  {
    xSpeed = -xSpeed;
  }
  if(playerY + r  > height || playerY < -r)
  {
    ySpeed = -ySpeed;
  }
}
