var dog,happyDog,dogImg;
var foodS,foodStock,database,lastFed;
var milk;
var changeState,readState,gameState;
var bedroom,garden,washroom;
var input,name,setName,enter;
var button,button2;  

function preload()
{
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");

}

function setup() {
	createCanvas(1200, 600);
  dog = createSprite(800,350,50,50);
  dog.addImage(dogImg)
  dog.scale=0.2;
  database = firebase.database();

  button = createButton("Add Milk");

button.position(570,20);

input = createInput("Name");
enter = createButton("Enter Name");

enter.position(displayHeight/2,440);
input.position(displayHeight/2,400);
  
  

milk = new Food(720,220,10,10);
}


function draw() {  
background(0,255,0);
milk.display();

enter.mousePressed(function(){
  name = input.value();
  updateName(name);
})
button2 = createButton("Feed "+name);
button2.position(660,20);

setName = database.ref("Name");
setName.on("value",function(data){
  setName = data.val();
})

fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val()
  })
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  readState = database.ref("gameState")
  readState.on("value",function(data){
    gameState =data.val()
  })
fill("red")
textSize(24)
if(lastFed>=12){
   text("Last Feed: "+lastFed%12+" PM",250,30)
}else if(lastFed===0){
  text("Last Feed : 12AM ",250,30)
}else{
  text("Last Feed : "+ lastFed + " AM",250,30)
}

 button.mousePressed(function(){
   addStock(foodS)
 
 })
 button2.mousePressed(function(){
  writeStock(foodS)
})


  drawSprites();
  textSize(32);
  fill(255);
  stroke(2)

text("foodRemaining: " + foodS,500,100);
currentTime = hour();
if(currentTime ===lastFed+1){
   update("Playing");
   milk.garden();
}else if(currentTime ===lastFed+2){
  update("Sleeping");
  milk.bedroom();
}else if(currentTime >=lastFed+2 && currentTime<=lastFed+4){
  update("Bathing");
  milk.washroom();
}else{
  update("Hungry");
  milk.display();
  
}
if(gameState ==="Hungry"){ 
  button2.show();
  button.show();
  dog.add;
  dog.addImage(dogImg);
  input.show();
  enter.show();
}else{ 
  button.hide();
  button2.hide();
  dog.remove();
  input.hide();
  enter.hide();
}
}

function readStock(data){
foodS = data.val();
}
function addStock(x){
if(x>=20){
  x=20
}else{
x=x+1
}
database.ref("/").update({
  Food : x
})
milk.updateStock(x);
}
function writeStock(x){
  if(x<=0){
    x = 0;
  }else{
    x = x-1;
  }
  

database.ref("/").update({
  Food : x,
  FeedTime:hour()
})
milk.updateStock(x);
}
function update(state){
  database.ref("/").update({
    gameState:state
  });
}
function updateName(x){
  database.ref("/").update({
    Name:x
  })
  }
  



