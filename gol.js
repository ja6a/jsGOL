var delay = 50;
var size;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var refreshIntervalId;
var data;
var pix;
var isMobile;

var debug = false;
var dim1 = document.getElementById('dim1');
var dim2 = document.getElementById('dim2');

function recoverState(){	
	
	// Use Modernizr to detect whether localstorage is supported by the browser
    if (Modernizr.localstorage) {    
    	
    	if(localStorage['canvassize']){
    		size = localStorage['canvassize'];    		
    		setSize();
    	}
    	if(localStorage['canvas']){    		
    	
        	localStorageImage = new Image(canvas.width, canvas.height);
            localStorageImage.addEventListener("load", function (event) {                
                context.drawImage(localStorageImage, 0, 0);
                data = context.getImageData(0, 0, canvas.width, canvas.height);
                pix = data.data;
                
            }, false);
            localStorageImage.src = localStorage['canvas'];
            
           
    	}
    	
    	if(localStorage['delay']){
    		delay = localStorage['delay'];
    	}
    }
	else {
		if (readCookie("canvassize")){
			size = readCookie("canvassize");	
			setSize();
		}
		if (readCookie("delay")){
			delay = readCookie("delay");			
		}
	}
	// update the controls
    setSelectedSize();
    setSelectedDelay();    
    
}

function saveDelay(){
	if (Modernizr.localstorage) { 
		localStorage['delay']=delay;
	}
	else {
		createCookie("delay", delay, 7);
	}
}

function saveSize(){
	
	if (Modernizr.localstorage) { 
		localStorage['canvassize'] =size;
	}
	else {
		createCookie("canvassize", size, 7);
	}
}

function saveCanvas(){
	
	if (Modernizr.localstorage) { 
		localStorage['canvas'] = canvas.toDataURL('image/png');
	}
	
}

function stop(){
	clearInterval(refreshIntervalId);
	// save state to storage
	saveCanvas();
	saveSize();
	saveDelay();
	
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
        
function init(){
		
	data = context.createImageData(canvas.width, canvas.height);
	
	pix = data.data;
	//alert("init");
	
	for (var y = 0; y < canvas.height; y ++) {
		for (var x = 0; x < canvas.width; x ++) {		
			drawPixel(x,y, 255, pix);
		}
	}
	
}

function glider(){
	
	clearInterval(refreshIntervalId);

	init();
	
	var colour = 0;
	var deltax=canvas.width/2;
	var deltay=canvas.height/2;
	
	drawPixel(deltax+1,deltay, colour, pix);
	drawPixel(deltax+2,deltay+1, colour, pix);
	drawPixel(deltax,deltay+2, colour, pix);
	drawPixel(deltax+1,deltay+2, colour, pix);
	drawPixel(deltax+2,deltay+2, colour, pix);
	
	context.putImageData(data, 0, 0);	
	
}

function acorn() {
	
	clearInterval(refreshIntervalId);

	init();
	
	var colour = 0;
	var deltax=canvas.width/2;
	var deltay=canvas.height/2;
	
	drawPixel(deltax+1,deltay, colour, pix);
	drawPixel(deltax+3,deltay+1, colour, pix);
	drawPixel(deltax,deltay+2, colour, pix);
	drawPixel(deltax+1,deltay+2, colour, pix);
	drawPixel(deltax+4,deltay+2, colour, pix);
	drawPixel(deltax+5,deltay+2, colour, pix);
	drawPixel(deltax+6,deltay+2, colour, pix);
	
	context.putImageData(data, 0, 0);	
	
}

function random(){
	
	clearInterval(refreshIntervalId);

	init();
	for (var y = 0; y < canvas.height; y ++) {
		for (var x = 0; x < canvas.width; x ++) {
			
			// either black or white
			var blackorwhite=Math.floor(Math.random()*2)
			var colour = 255;
			if (blackorwhite==0){
				colour = 0;
			}
			drawPixel(x,y, colour, pix);
		}
	}
	
	context.putImageData(data, 0, 0);	
	
	start();
}

function drawPixel(x,y,colour, thepix){
	var pixel = (y*canvas.width + x)*4;
	for (var c = 0; c < 3; c ++) {
		var i = pixel + c;
		thepix[i] = colour;
	}
	thepix[pixel + 3] = 255; // alpha
}

function setSizeFromSelect(newsize){
	size = newsize;
	setSize();
	
	saveSize();
}

function setSize(){
	if (isMobile){
		setSizeMobile();
	}
	else {
		setSizeDesktop();
	}
	if (debug){
	
		dim1.innerText = "DEBUG: width:"+canvas.width +" height:"+ canvas.height;

	}
	
}

function setSizeDesktop(){
	clearInterval(refreshIntervalId);
	if (size=="Microvision"){
		canvas.width=16;
		canvas.height=16;
	}
	else if (size=="QQVGA"){
		canvas.width=160;
		canvas.height=120;
	}
	else if (size=="QVGA"){
		canvas.width=320;
		canvas.height=240;
	}
	else if (size=="WQVGA"){
		canvas.width=432;
		canvas.height=240;
	}
	else if (size=="VGA"){
		canvas.width=640;
		canvas.height=480;
	}
}

function setSizeMobile(){
	clearInterval(refreshIntervalId);
	if (size=="Microvision"){
		canvas.width=16;
		canvas.height=16;
	}
	else if (size=="QQVGA"){
		canvas.width=120;
		canvas.height=160;
	}
	else if (size=="QVGA"){
		canvas.width=240;
		canvas.height=320;
	}
	else if (size=="WQVGA"){
		canvas.width=240;
		canvas.height=432;
	}
	else if (size=="VGA"){
		canvas.width=480;
		canvas.height=640;
	}
}

function setDelayFromSelect(delayStr){
	clearInterval(refreshIntervalId);
	if (delayStr=="0.01"){
		delay = 10;
	}
	else if (delayStr=="0.05"){
		delay = 50;
	}
	else if (delayStr=="0.1"){
		delay = 100;
	}
	else if (delayStr=="0.5"){
		delay = 500;
	}
	else if (delayStr=="1"){
		delay = 1000;
	}
	else if (delayStr=="2"){
		delay = 2000;
	}
	if (debug){
		dim2.innerText = "DEBUG: delay:"+delay;
	}
	saveDelay();
}

function setSelectedSize(){
	
	if (isMobile){
		setSelectedSizeMobile();
	}
	else {
		setSelectedSizeDesktop();
	}
	if (debug){
	
		dim1.innerText = "DEBUG: width:"+canvas.width +" height:"+ canvas.height;

	}
}
function setSelectedSizeDesktop(){
	var selsize = document.getElementById('selsize');
	if (size=="Microvision"){
		selsize.options[0].selected = "selected";
	}
	else if (size=="QQVGA"){
		selsize.options[1].selected = "selected";
	}
	else if (size=="QVGA"){
		selsize.options[2].selected = "selected";
	}
	else if (size=="WQVGA"){
		selsize.options[3].selected = "selected";
	}
	else if (size=="VGA"){
		selsize.options[4].selected = "selected";
	}
}

function setSelectedSizeMobile(){
	var selsize = document.getElementById('selsize');
	if (size=="Microvision"){
		selsize.options[0].selected = "selected";
	}
	else if (size=="QQVGA"){
		selsize.options[1].selected = "selected";
	}
	else if (size=="QVGA"){
		selsize.options[2].selected = "selected";
	}
	else if (size=="WQVGA"){
		selsize.options[3].selected = "selected";
	}
	else if (size=="VGA"){
		selsize.options[4].selected = "selected";
	}
}

function setSelectedDelay(){
    var seldelay = document.getElementById('seldelay');	
	if (delay==10){
		seldelay.options[0].selected = "selected";
	}
	else if (delay==50){
		seldelay.options[1].selected = "selected";
	}
	else if (delay==100){
		seldelay.options[2].selected = "selected";
	}
	else if (delay==500){
		seldelay.options[3].selected = "selected";
	}
	else if (delay==1000){
		seldelay.options[4].selected = "selected";
	}
	else if (delay==2000){
		seldelay.options[5].selected = "selected";
	}
	
}

function start(){
	clearInterval(refreshIntervalId);
	
	refreshIntervalId = setInterval (  "gol();", delay);
	
}

/*
 * Taken from wikipedia:
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
function gol(){
		
	var dataNew = context.createImageData(canvas.width, canvas.height);
	var pixNew = dataNew.data;
	
	for (var y = 0; y < canvas.height; y ++) {
		for (var x = 0; x < canvas.width; x ++) {
			//d.innerText = "x:"+x +" y:"+ y;
			var cell = (y*canvas.width + x)*4;
			
			var alive = isAlive(cell, x, y);
			
			var colour = 255;
			if (alive){
				colour = 0;
			}
			drawPixel(x,y, colour, pixNew);
		}
	}
	data=dataNew;
	pix=data.data;
	context.putImageData(dataNew, 0, 0);	
	
}

function isAlive(cell, x, y){
	var alive = false;
	var aliveCount=0;
	
	for (var ky = -1; ky < 2; ky++) {
		for (var kx = -1; kx < 2; kx++) {
			var neighbour = ((y + ky)*canvas.width + (x + kx)) * 4;
			 
			//e.innerText = "neighbour:"+neighbour;			
			if (neighbour>=0&&neighbour<=pix.length&&neighbour!=cell
				&& pix[neighbour]==0){
				aliveCount++;				
			}				
		}
	}
	//e.innerText = "aliveCount:"+aliveCount;
	if((aliveCount>=2&&aliveCount<=3&&pix[cell]==0)
		||
		(aliveCount==3)){
		alive=true;
	}
	return alive;
}

function setMobileDevice(){
	isMobile=true;
	init();
	recoverState();
	setSize();
}

function setDesktopDevice(){
	isMobile=false;
	init();
	recoverState();
	setSize();
}