function setpixelated(context){
    context['imageSmoothingEnabled'] = false;       /* standard */
    context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    context['oImageSmoothingEnabled'] = false;      /* Opera */
    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    context['msImageSmoothingEnabled'] = false;     /* IE */
}

var c = document.getElementById("adfInstrumentCanvas");
var canvasDiv = document.getElementById("canvasCol");
var ctx = c.getContext("2d");

window.addEventListener("resize", resizeCanvas);

var canvasInternalSizeX = 500;
var canvasInternalSizeY = 500;
var roseRotation = 0;
var requestId;
var debugText = "";

reDraw(1,1);

function resizeCanvas() {
    
    var bb = canvasDiv.getBoundingClientRect(),
    width = bb.right - bb.left;
    var heightRatio = 1;
    c.width = width;
    c.height = c.width * heightRatio;
    let scaleX = c.width / canvasInternalSizeX;
    let scaleY = c.height / canvasInternalSizeY;
    reDraw(scaleX,scaleY);
  }



function reDraw(scaleX,scaleY) {
    
    ctx.scale(scaleX,scaleY);
    setpixelated(ctx);
    ctx.moveTo(0,0);
    render();

    
    
}
var prevRot = 0;
var prevRot2 = 0;

var adfBase = new Image();
adfBase.src = 'img/adf_base.png';

var adfRose = new Image();
adfRose.src = 'img/adf_rose_black.png';

var adfNeedle = new Image();
adfNeedle.src = 'img/adf_needle.png';

var adfAircraft = new Image();
adfAircraft.src = 'img/adf_acft.png';

adfBase.onload = function(){ 
    render();
}

adfRose.onload = function(){ 
    render();
}

adfNeedle.onload = function(){ 
    render();
}

function render() {


    if(adfBase && adfNeedle && adfRose) {
        ctx.clearRect(0, 0, canvasInternalSizeX, canvasInternalSizeY);   
        
    
    //adfRose.onload = function(){
        

        ctx.save();
        ctx.translate(500/2,500/2);
        ctx.rotate(roseRotation*Math.PI/180);
        
        ctx.translate(-500/2,-500/2);
        ctx.drawImage(adfRose, 0, 0, 500, (adfRose.height / adfRose.width) * 500);
        ctx.restore();
        
    //}

  
    //adfNeedle.onload = function(){
        ctx.save();
        ctx.translate(500/2,500/2);
        ctx.rotate( (59+qdm-aircraftHdg)*Math.PI/180);
        
        ctx.translate(-500/2,-500/2);
        ctx.drawImage(adfNeedle, 100, 100, 300, (adfNeedle.height / adfNeedle.width) * 300);
        ctx.restore();
        prevRot = prevRot+1;
        if(prevRot == 360) {
            prevRot = 0;
        }

    
    ctx.drawImage(adfBase, 0, 0, 500, (adfBase.height / adfBase.width) * 500);

    ctx.drawImage(adfAircraft, 225, 225, 50, (adfAircraft.height / adfAircraft.width) * 50);

    ctx.fillStyle = "#FF0000";
    ctx.fillText(debugText,10,10);
    ctx.fillStyle = "#000000";

    //ctx.fillRect(20, 400, 60, 100);
    //ctx.fillRect(80, 400, 60, 100);
        
    }   
}

var roseInterval = null;
var mouseX = 0;
var mouseY = 0;
var animationRunning = false;
function handleAnimation() {
    if(animationRunning) {
        if(mouseX >= 20 && mouseX <= 80 && mouseY >= 400 && mouseY <= 500 ) {
            roseRotation--;
            if(roseRotation < 0) {
                roseRotation = 359;
            }
        }
    
        if(mouseX >= 80 && mouseX <= 140 && mouseY >= 400 && mouseY <= 500 ) {
            roseRotation++;
            if(roseRotation >=360) {
                roseRotation = 0;
            }
        }
    
        //ctx.clearRect(0, 0, canvasInternalSizeX, canvasInternalSizeY);
        render();
        setTimeout(handleAnimation, 33);
    }
} 


async function handleEvent(e) {
    var rect = c.getBoundingClientRect(), // abs. size of element
      scaleX = canvasInternalSizeX / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvasInternalSizeY / rect.height;  // relationship bitmap vs. element for Y

    
      clientX = e.pageX - window.pageXOffset;
      clientY = e.pageY - window.pageYOffset;
    mouseX = (clientX - rect.left) * scaleX;
    mouseY = (clientY - rect.top) * scaleY;

    //debugText = e.clientX + " - " + e.clientY + ",";
    //debugText += clientX + " - " + clientY + ",";
    
    animationRunning = true;
    handleAnimation();
}

c.onmousedown = function(e) {
    e.preventDefault();
    handleEvent(e);
}

c.ontouchstart = function(e) {
    e.preventDefault();
    handleEvent(e);
}

c.ontouchend = function(e) {
    animationRunning = false;
}

c.onmouseup = function(e) {
    animationRunning = false;
}
