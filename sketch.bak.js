var bgimg;
var timg;
var font;

var b;
var bg;
var obstacles;
var checks;
var score;
var timer;
var nextSpawn;
var goTimer;

var gameover;
var start;

var speedy;


var scr; 
var scry;

var knob_1 = 16;
var slider_1 = 0;
var inputMidi;

var bgcR;
var bgcG;
var bgcB;

function preload(){
  font = loadFont('/assets/font.TTF');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgimg = loadImage('/assets/bgtr.png'); // imatge de fons
  timg =loadImage('/assets/tube.png'); // imatge tuberies

 
  bg = new BG(); // creem el fons

  b = new Bird(windowWidth/4, windowHeight/2, 50); // creem l'ocell


// creem grups pels diferents sprites
  obstacles = new Group();
  checks = new Group();

// color RGB inicial del fons
  bgcR = 78;
  bgcG = 192;
  bgcB = 202;

// inicialitzem vars
  nextSpawn = 0;
  timer = 1.5;
  score = 0;
  start = 1;
  gameover = 0;
  speedy = 4;

// ratio de la pantalla que permet adaptar el programa a diferents mides
  scr = windowHeight/939;
  scry = windowWidth/1880;

  textFont(font); // carreguem la font
}

function draw() {
  background(bgcR, bgcG, bgcB);  

// agafem dades del midi
  inputMidi = p5.midi.onInput();

  if(inputMidi != null){
    console.log(inputMidi.data); 

    // el knob 1 canvia la velocitat del joc
    if(inputMidi.data[1] == 16){
      speedy = map(inputMidi.data[2],0,127,4,8);
    }
    // l'slider 1 canvia el component R del color del cel 
    if(inputMidi.data[1] == 0){
      bgcR = map(inputMidi.data[2],0,127,100,250);
    }
    
    // l'slider 1 canvia el component G del color del cel 
    if(inputMidi.data[1] == 1){
      bgcG = map(inputMidi.data[2],0,127,100,250);
    }
    
    // l'slider 1 canvia el component B del color del cel
    if(inputMidi.data[1] == 2){
      bgcB = map(inputMidi.data[2],0,127,100,250);
    }
  }	

// dibuixem els sprites i fem que es mogui el fons
  drawSprites();
  bg.movebg();
    
// comprovem l'estat del joc
  if(start || gameover){

    // pantalla d'inici
    if(start){
      textSize(48*scry);
      fill(0);
      text('Press space to start', windowWidth/2-200*scry, windowHeight/2);
    
    // pantalla de game over
    }else{
      textSize(48*scry);
      fill(0);
      text('Press space to restart', windowWidth/2-200*scry, windowHeight/2);     
    }

// pantalla de joc   
  }else{

    b.draw();

    // comptador que crida la funcio spawn cada segon
    if(millis() - nextSpawn >= timer*1000){
      spawn();
      nextSpawn = millis();
    }

    if(obstacles != []){

      // mou les tuberies i comprova les collisions
      for (let i = 0; i<obstacles.length; i++){
        obstacles[i].setSpeed(-speedy,0);
        obstacles[i].collide(b.spr, ded);
      }

      // augmenta la puntuacio quan superem un obstacle
      for (let ii = 0; ii<checks.length; ii++){
        checks[ii].setSpeed(-speedy,0);
        if(checks[ii].collide(b.spr)){
          checks[ii].remove();
          score++;
        }
      }
    }
  
    // marcador de puntuacio
    fill(0);
    textSize(60*scr);
    text(score, windowWidth/20, windowHeight/8);  
  } 

}

// classe que s'encarrega de pintar i moure el fons
class BG {
  constructor(){
    this.bg1 = createSprite(0, windowHeight-400);
    this.bg1.addImage(bgimg);
    this.bg1.scale = 2.5;

    this.bg2 = createSprite(720, windowHeight-400);
    this.bg2.addImage(bgimg);
    this.bg2.scale = 2.5;

    this.bg3 = createSprite(1440, windowHeight-400);
    this.bg3.addImage(bgimg);
    this.bg3.scale = 2.5;

    this.bg4 = createSprite(2160, windowHeight-400);
    this.bg4.addImage(bgimg);
    this.bg4.scale = 2.5;

    this.bg5 = createSprite(2880, windowHeight-400);
    this.bg5.addImage(bgimg);
    this.bg5.scale = 2.5;
  }

  movebg(){
    this.bg1.setSpeed(-speedy,0);
    if(this.bg1.position.x <= -720){
      this.bg1.position.x = 2880;
    }
    this.bg2.setSpeed(-speedy,0);
    if(this.bg2.position.x <= -720){
      this.bg2.position.x = 2880;
    }
    this.bg3.setSpeed(-speedy,0);
    if(this.bg3.position.x <= -720){
      this.bg3.position.x = 2880;
    }
    this.bg4.setSpeed(-speedy,0);
    if(this.bg4.position.x <= -720){
      this.bg4.position.x = 2880;
    }
    this.bg5.setSpeed(-speedy,0);
    if(this.bg5.position.x <= -720){
      this.bg5.position.x = 2880;
    }
  }

}

// funcio que crea les tuberies
function spawn(){ 

    offset = Math.floor(Math.random()*(0 - 200))+100;
    var o1 = createSprite(windowWidth, -200*scr+offset, 100, windowHeight/3);
    o1.addImage(timg);
    o1.scale = 0.5*scr;
    o1.mirrorY(-1);
    var o2 = createSprite(windowWidth, windowHeight+200*scr+offset, 100, windowHeight/3);
    o2.addImage(timg);
    o2.scale = 0.5*scr;

    var c = createSprite(windowWidth, windowHeight/2+10, 20, windowHeight);

    o1.life = 1000;
    o2.life = 1000;
    c.shapeColor = color(0, 111, 0, 0);

    o1.addToGroup(obstacles);
    o2.addToGroup(obstacles);
    c.addToGroup(checks);

}

// classe que mou i controla l'ocell
class Bird {
  constructor(xi,yi,m){
    this.x = xi;
    this.y = yi;
    this.m = m;
    this.spr = createSprite(this.x, this.y, this.m, this.m);
    this.spr.addAnimation('fly', '/assets/fb0.png', '/assets/fb1.png', '/assets/fb2.png');
    this.spr.scale = 1.3*scr;
  }

  draw() {
    // moviment de caiguda i rotacio
    this.spr.addSpeed(0.5*scr, 90);
    this.spr.rotation += 1;
    
    // comprova si surt de la pantalla per sota
    if(this.spr.position.y >= windowHeight-40*scr) {
      ded();
    }
    
    // comprova si arriba al limit superior de la  pantalla
    if(this.spr.position.y <= windowHeight-40*scr) {
      this.spr.position.y = windowHeight-40*scr;
      this.spr.addSpeed(0.3*scr, 90);
    }

  }
}

// funcio que es crida quan morim
function ded(){

  // elimina totes les tuberies
  obstacles.removeSprites();
  checks.removeSprites();

  // canvia l'estat del joc
  gameover = 1;

  // inicia un comptador que bloqueja l'input
  goTimer = millis();

  // reseteja l'ocell
  b.spr.remove();
  b = new Bird(windowWidth/4, windowHeight/2, 50);

}

function keyPressed(){
  // si apretem la tecla de espai
  if(keyCode === 32){

    // si esta a la pantalla inicial comença el joc
    if(start){
      start = 0;

    // si esta a la pantalla de game over s'espera 0.1 segons per evitar
    // poder clicar massa rapid i despres retorna al joc
    }else if(gameover && millis()-goTimer >= 100){
      gameover = 0;
      score = 0;
      nextSpawn = millis();

    // si esta a la pantalla del joc fa que l'ocell salti
    }else if(!start && !gameover){
      b.spr.setSpeed(0);
      b.spr.addSpeed(10*scr,-90);
      b.spr.rotation = -15;
    }
  }
  return false;
}

