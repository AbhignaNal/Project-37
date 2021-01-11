var dog, happyDog, dogImg;
var database; 
var foodS, foodStock;
var addFood, feed;
var fedTime, lastFed;
var foodObj;
var changeState, readState;
var bedroom, garden, washroom;
var deadDog, lazyDog;
var gameState;

function preload(){
  dogImg = loadImage("images/dogImg1.png");
  happyDog = loadImage("images/dogImg.png");
  bedroom = loadImage("images2/imgs/BedRoom.png");
  garden = loadImage("images2/imgs/Garden.png");
  washroom = loadImage("images2/imgs/WashRoom.png");
  deadDog = loadImage("images2/imgs/deadDog.png");
  lazyDog = loadImage('images2/imgs/deadDog.png');
}

function setup() {
  createCanvas(550, 550);

  database = firebase.database();
  
  dog = createSprite(270, 490, 100, 100);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Foods();

  feed = createButton('Feed The Dog');
  feed.position(550, 95);
  feed.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(650, 95)
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}

function draw() {
  background(46, 139, 87);

  foodObj.display();

  drawSprites();

  textFont("Times New Roman");
  fill("white");

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(gameState != "Hungry"){
    addFood.hide();
    feed.hide();
  }
  else{
    feed.show();
    addFood.show();
  }
  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime==(lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  
  //text("Food Remaining:" + " " + foodS, 220, 300);

  if(lastFed>=12){
    text("Last Fed:" + lastFed%12 + " " + "PM", 250, 30);
  }
  else if(lastFed === 0){
    text("Last Fed: 12:00 PM", 250, 30);
  }
  else{
    text("Last Fed:" + lastFed + " " + "PM", 250, 30);
  }
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}