var mapCanvas = document.getElementById("adfMapCanvas");
var canvasDiv = document.getElementById("advMapCanvasCol");
var mapCtx = mapCanvas.getContext("2d");

window.addEventListener("resize", resizeMapCanvas);

var mapCanvasInternalSizeX = 500;
var mapCanvasInternalSizeY = 500;

reDrawMap(1,1);

var acftIcon = new Image();
acftIcon.src = 'img/adf_acft.png';

var isDraggable = false;

acftIcon.onload = function(){ 
    renderMap();
}

function reDrawMap(scaleX,scaleY) {
    
    mapCtx.scale(scaleX,scaleY);
    setpixelated(ctx);
    mapCtx.moveTo(0,0);
    renderMap();

    
    
}

var acftWidth = 50;
var acftHeight = 50;
var acftX = mapCanvasInternalSizeX/2 - (acftWidth/2);
var acftY = 50;

var qdm = 0;
var radial = 0; 

function resizeMapCanvas() {
    
    var bb = canvasDiv.getBoundingClientRect(),
    width = bb.right - bb.left;
    var heightRatio = 1;
    mapCanvas.width = width;
    mapCanvas.height = mapCanvas.width * heightRatio;
    let scaleX = mapCanvas.width / mapCanvasInternalSizeX;
    let scaleY = mapCanvas.height / mapCanvasInternalSizeY;
    reDrawMap(scaleX,scaleY);
  }

  function renderMap() {
    if(acftIcon) {
        
        mapCtx.clearRect(0, 0, mapCanvasInternalSizeX, mapCanvasInternalSizeY);   
        drawGrid();
    
        mapCtx.drawImage(acftIcon, acftX, acftY, 50, (acftWidth / acftHeight) * 50);
        
    }
    
  }

  function drawGrid() {
      let rotationInterval = 45;
      for(i=0; i<=360; i+=rotationInterval) {
            mapCtx.save();

            //rotate
            mapCtx.translate(mapCanvasInternalSizeX/2,mapCanvasInternalSizeY/2);
            mapCtx.rotate(i*Math.PI/180);
            mapCtx.translate(-mapCanvasInternalSizeX/2,-mapCanvasInternalSizeY/2);
            //draw
            mapCtx.beginPath();
            mapCtx.moveTo(mapCanvasInternalSizeX / 2, 150);
            mapCtx.lineTo(mapCanvasInternalSizeX / 2, mapCanvasInternalSizeY - 150);
            mapCtx.stroke();
            if(i != 360) {
                mapCtx.fillText(i, mapCanvasInternalSizeX / 2, 130);
            }
            
            
            mapCtx.restore();

      }
  }

  mapCanvas.onmousedown = function(e) {

    var rect = mapCanvas.getBoundingClientRect(), // abs. size of element
      scaleX = mapCanvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = mapCanvas.height / rect.height;  // relationship bitmap vs. element for Y

      

    var mouseX = (e.clientX - rect.left) * scaleX;
    var mouseY = (e.clientY - rect.top) * scaleY;

    console.log(Math.round(mouseX) + " - " + Math.round(mouseY));

    acftX = mouseX - (acftWidth/2);
    acftY = mouseY - (acftHeight/2);
    reDrawMap();

    mapCtx.beginPath();
    mapCtx.moveTo(mouseX, mouseY);
    mapCtx.lineTo(mapCanvasInternalSizeX / 2, mapCanvasInternalSizeY / 2);
    mapCtx.stroke();

    distX = Math.abs(mouseX - 250);
    distY = Math.abs(mouseY - 250);

    radial = (Math.atan(distX / distY) * 180) / Math.PI;
    qdm = radial + 180;

    if(mouseX > mapCanvasInternalSizeX/2 && mouseY > mapCanvasInternalSizeY / 2) {
        //south east
        radial = 90 + (Math.atan(distY / distX) * 180) / Math.PI;
        qdm = radial + 180;
    } else if(mouseX < mapCanvasInternalSizeX / 2 && mouseY > mapCanvasInternalSizeY / 2) {
        //south west
        radial = 180 + (Math.atan(distX / distY) * 180) / Math.PI;
        qdm = radial - 180;

    } else if(mouseX < mapCanvasInternalSizeX /2 && mouseY < mapCanvasInternalSizeY / 2) {
        radial = 270 + (Math.atan(distY / distX) * 180) / Math.PI;
        qdm = radial - 180;
    }

    if(radial == 360) {
        radial = 0;
    }
 
    mapCtx.fillText("Radial: " + Math.round(radial), acftX,acftY-10);
    mapCtx.fillText("QDM: " + Math.round(qdm), acftX,acftY-20);
    render();

   /* if (mouseX >= (currentX - star_img.width/2) &&
        mouseX <= (currentX + star_img.width/2) &&
        mouseY >= (currentY - star_img.height/2) &&
        mouseY <= (currentY + star_img.height/2)) {
      isDraggable = true;
    }*/
};

mapCanvas.onmouseup = function(e) {
    isDraggable = false;
}
