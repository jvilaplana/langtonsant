var canvasWidth = 800;
var canvasHeight = 400;
var blockSize = 10;
var currentStep = 0;

var antPos = [canvasWidth / blockSize / 2, canvasHeight / blockSize / 2];
var antDir = 0;
var speed = 1000;
var running = false;

function grid(w, h, totalW, totalH){
  var $this = this;
  this.blockW = w || blockSize;
  this.blockH = h || blockSize;
  this.container;
  $('#grid').empty();

  this.container = document.createElement('div');
  this.container.id = 'gridContainer';

  var c = document.createElement("canvas");
  c.id = 'antCanvas';
  c.width  = totalW;
  c.height = totalH;
  c.className ="antCanvas";

  var totalW = totalW || $(document).width();
  var totalH = totalH || $(document).height();

  var mapGridCanvas = c.getContext("2d");
  mapGridCanvas.fillStyle = "#FFFFFF";
  mapGridCanvas.fillRect(0, 0, c.width, c.height);
  mapGridCanvas.globalAlpha = 1;

  this.container.appendChild(c);

  document.getElementById('grid').appendChild(this.container);
};

function draw(x, y, c) {
  var canvas = document.getElementById('antCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = c;
    ctx.fillRect(blockSize*x, blockSize*y, blockSize, blockSize);
  }
}

function nextStep() {
  var colour = getColour(antPos[0], antPos[1]);

  if(colour == 0) {
    draw(antPos[0], antPos[1], "#FFFFFF");
  }
  else {
    draw(antPos[0], antPos[1], "#000000");
  }

  if(antDir == 0) {
    antPos[1]--;
    if(antPos[1] < 0) antPos[1] = canvasHeight / blockSize;
  }
  else if(antDir == 1) {
    antPos[0]++;
    if(antPos[0] > canvasWidth / blockSize) antPos[0] = 0;
  }
  else if(antDir == 2) {
    antPos[1]++;
    if(antPos[1] > canvasHeight / blockSize) antPos[1] = 0;
  }
  else if(antDir == 3) {
    antPos[0]--;
    if(antPos[0] < 0) antPos[0] = canvasWidth / blockSize;;
  }

  colour = getColour(antPos[0], antPos[1]);
  if(colour == 0) {
    antDir++;
    if(antDir > 3) antDir = 0;
  }
  else {
    antDir--;
    if(antDir < 0) antDir = 3;
  }

  drawAnt(antPos[0], antPos[1]);

  currentStep++;

  $("#currentStep").html(currentStep);
}

function drawAnt(x, y) {
  var canvas = document.getElementById('antCanvas');

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';

  var path=new Path2D();
  var initialX = blockSize*x;
  var initialY = blockSize*y;

  if(antDir == 0) {
    path.moveTo(initialX+blockSize/2, initialY);
    path.lineTo(initialX, initialY+blockSize);
    path.lineTo(initialX+blockSize, initialY+blockSize);
  }
  else if(antDir == 1) {
    path.moveTo(initialX+blockSize, initialY+blockSize/2);
    path.lineTo(initialX+2, initialY+2);
    path.lineTo(initialX+2, initialY+blockSize);
  }
  else if(antDir == 2) {
    path.moveTo(initialX+blockSize/2, initialY+blockSize);
    path.lineTo(initialX+2, initialY+2);
    path.lineTo(initialX+blockSize, initialY+2);
  }
  else if(antDir == 3) {
    path.moveTo(initialX, initialY+blockSize/2);
    path.lineTo(initialX+blockSize, initialY);
    path.lineTo(initialX+blockSize, initialY+blockSize);
  }
  ctx.fill(path);

  /*
  var imageObj = new Image();

  imageObj.onload = function() {
    ctx.drawImage(imageObj, 250, 250);
  };
  imageObj.src = 'image/ant.png';
  */
}

function getColour(x, y) {
  var canvas = document.getElementById('antCanvas');
  var ctx = canvas.getContext('2d');

  var p = ctx.getImageData((x*blockSize)+1, (y*blockSize)+1, 1, 1).data;
  if(p[0] == 0 && p[1] == 0 && p[2] == 0) return 0;
  else return 1;
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
  throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function simulate() {
  setTimeout(function() {
    nextStep();
    if(running) simulate();
  }, speed);
}

$(function() {

  $('#initializeCanvas').click(function() {
    blockSize = parseInt($('#blockSize').val());
    canvasWidth = parseInt($('#canvasWidth').val());
    canvasHeight = parseInt($('#canvasHeight').val());
    antPos = [canvasWidth / blockSize / 2, canvasHeight / blockSize / 2];

    console.log(blockSize);
    console.log(canvasWidth);
    console.log(canvasHeight);

    grid(blockSize, blockSize, canvasWidth, canvasHeight);
    draw(antPos[0], antPos[1], "#FFFFFF");
    drawAnt(antPos[0], antPos[1]);

    $('#start').prop('disabled', false);
    $('#initializeCanvas').prop('disabled', true);
  });

  $('#start').click(function() {
    if($('#start').is(':disabled')) return;
    if(!running) {
      running = true;
      simulate();
      $('#start').html("Stop");
    }
    else {
      running = false;
      $('#start').html("Start");
    }

  });

  $('#speedDown').click(function() {
    speed += 50;
    $('#currentSpeed').html(speed);
  });

  $('#speedUp').click(function() {
    speed -= 50;
    if(speed < 0) speed = 0;
    $('#currentSpeed').html(speed);
  });

  $('#currentSpeed').html(speed);
});
