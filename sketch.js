//adding the all global variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var message;

var restart;

//function preload will load up all the images and sounds, and prep the code with everything it needs before hand
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

//function setup will create the many sprites, along with other things, such as the canvas (playing area), animations, groups, and adjusting the properties
function setup() {
  createCanvas(600, 200);

  message = "This is a message";
 
  //creating the trex and its animations
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  //creating the ground
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating the game over sprite
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //adding the restart sprite
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //creating the invisble foundation for the trex
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //creating the Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  //creating background
  background(180);

  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log(message)
  
  //the if statement telling the code what and what not to do when the gamestate is PLAY
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    //making the ground go faster
    ground.velocityX = -(4 + 3* score/100)

    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //checkpoint
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    //infinite ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //the if statement that says if the trex hits a cactus, it will die
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }

  }
  //the if statement saying what and what not to do when the gamestate is END
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     

      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //stopping the obstacles' and clouds' movement
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
     //telling the code to restart when the restart button is pressed
     if(mousePressedOver(restart)){
       reset()
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  //drawing the sprites
  drawSprites();
}

//what to do if the restart button is pressed
function reset(){
  //sets score to 0
  score = 0
  //sets gamestate to PLAY
  gameState = PLAY
  //destroys both clouds and obstacles
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  //changes animation back to running
  trex.changeAnimation("running",trex_running)

}

//spawns the Obstacles every 60 frames
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   //increases speed of obstacles
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

//spawns clouds every 60 frames
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {                                                         
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

