var mapCanvas = document.getElementById("adfMapCanvas");
var mapCanvasDiv = document.getElementById("adfMapCanvasCol");
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
    
    var bb = mapCanvasDiv.getBoundingClientRect(),
    width = bb.right - bb.left;
    var heightRatio = 1;
    mapCanvas.width = width;
    mapCanvas.height = mapCanvas.width * heightRatio;
    let scaleX = mapCanvas.width / mapCanvasInternalSizeX;
    let scaleY = mapCanvas.height / mapCanvasInternalSizeY;
    reDrawMap(scaleX,scaleY);
  }

  var aircraftHdg = 0;
  function renderMap() {
    if(acftIcon) {
        
          
        
        mapCtx.fillText("click anywhere near the grid to move the aircraft to that position", 100, 10);

        mapCtx.fillText("click on the top right/left corners to turn aircraft right/left", 100, 20);

        mapCtx.fillStyle = "#FF0000";
        mapCtx.fillRect(0, 0, 40, 40);
        mapCtx.fillRect(mapCanvasInternalSizeX-40, 0, 40, 40);
        drawGrid();
        mapCtx.save();

        mapCtx.translate(acftX+25, acftY+25);
        mapCtx.rotate(aircraftHdg*Math.PI/180);
        mapCtx.translate(-acftX-25, -acftY-25);
        mapCtx.drawImage(acftIcon, acftX, acftY, 50, (acftWidth / acftHeight) * 50);
        mapCtx.restore();
        
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
    mapCtx.clearRect(0, 0, mapCanvasInternalSizeX, mapCanvasInternalSizeY);
    var rect = mapCanvas.getBoundingClientRect(), // abs. size of element
      scaleX = mapCanvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = mapCanvas.height / rect.height;  // relationship bitmap vs. element for Y

      

    var mouseX = (e.clientX - rect.left) * scaleX;
    var mouseY = (e.clientY - rect.top) * scaleY;
   

    if(mouseX < 40 && mouseY < 40) {
        aircraftHdg-=5;
        if(aircraftHdg <= -5) {
            aircraftHdg = 355;
        }
        console.log(Math.round(mouseX) + " - " + Math.round(mouseY));
        
    } else if(mouseX > mapCanvasInternalSizeX - 40 && mouseY < 40) {
        aircraftHdg+=5;
        if(aircraftHdg >= 360) {
            aircraftHdg = 0;
        }
    } else {
        acftX = mouseX - (acftWidth/2);
        acftY = mouseY - (acftHeight/2);
        

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
 
   
    


    }

    mapCtx.fillText("Heading: " + Math.round(aircraftHdg), acftX,acftY-30);
    mapCtx.fillText("Radial: " + Math.round(radial), acftX,acftY-10);
    mapCtx.fillText("QDM: " + Math.round(qdm), acftX,acftY-20);
    renderMap();
    //roseRotation = aircraftHdg;
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


