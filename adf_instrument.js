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

var initialNeedleRot = 45;
function render() {


    if(adfBase && adfNeedle && adfRose) {
        ctx.clearRect(0, 0, c.width, c.height);   
        
    
    //adfRose.onload = function(){
        

        ctx.save();
        ctx.translate(500/2,500/2);
        ctx.rotate(prevRot2*Math.PI/180);
        
        ctx.translate(-500/2,-500/2);
        ctx.drawImage(adfRose, 0, 0, 500, (adfRose.height / adfRose.width) * 500);
        ctx.restore();
        
    //}

  
    //adfNeedle.onload = function(){
        console.log(adfNeedle.width + " - " + adfNeedle.height);
        ctx.save();
        ctx.translate(500/2,500/2);
        ctx.rotate( (59+qdm)*Math.PI/180);
        
        ctx.translate(-500/2,-500/2);
        ctx.drawImage(adfNeedle, 100, 100, 300, (adfNeedle.height / adfNeedle.width) * 300);
        ctx.restore();
        prevRot = prevRot+1;
        if(prevRot == 360) {
            prevRot = 0;
        }

    
    ctx.drawImage(adfBase, 0, 0, 500, (adfBase.height / adfBase.width) * 500);

    ctx.drawImage(adfAircraft, 225, 225, 50, (adfAircraft.height / adfAircraft.width) * 50);

        
    }

    

        
    //}

   
}

//setInterval(render,100);




