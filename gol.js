const delays = [0.01, 0.05, 0.1, 0.5, 1, 2];
const ALIVE = 0;
const DEAD = 255;
const canvasStorageItem = 'canvas';
const sizeIndexStorageItem = "canvassizeIndex";
const delayIndexStorageItem = 'delayIndex';
const debug = false;
const canvas = document.getElementById(canvasStorageItem);
const context = canvas.getContext('2d');
const dim1 = document.getElementById('dim1');
const dim2 = document.getElementById('dim2');
let refreshIntervalId, data, pix, isMobile;

function setMobileDevice() {
    isMobile = true;
    recoverState();
}

function setDesktopDevice() {
    isMobile = false;
    recoverState();
}

function recoverState() {
    let sizeIndex = 0;
    let delayIndex = 0;
    // Use Modernizr to detect whether localstorage is supported by the browser
    let localStorageImage;
    if (Modernizr.localstorage) {
        if (localStorage[sizeIndexStorageItem]) {
            sizeIndex = localStorage[sizeIndexStorageItem];
        }
        if (localStorage[delayIndexStorageItem]) {
            delayIndex = localStorage[delayIndexStorageItem];
        }
        if (localStorage[canvasStorageItem]) {
            localStorageImage = new Image(canvas.width, canvas.height);
            localStorageImage.addEventListener("load", function (event) {
                context.drawImage(localStorageImage, 0, 0);
                data = context.getImageData(0, 0, canvas.width, canvas.height);
                pix = data.data;

            }, false);
            localStorageImage.src = localStorage[canvasStorageItem];
        }
    } else {
        if (readCookie(sizeIndexStorageItem)) {
            sizeIndex = readCookie(sizeIndexStorageItem);
        }
        if (readCookie(delayIndexStorageItem)) {
            delayIndex = readCookie(delayIndexStorageItem);
        }
    }
    setSize(sizeIndex);
    drawCanvas();
    // update the controls
    setSelectedSize(sizeIndex);
    setSelectedDelay(delayIndex);
}

function saveDelay(delayIndex) {
    if (Modernizr.localstorage) {
        localStorage[delayIndexStorageItem] = delayIndex;
    } else {
        createCookie(delayIndexStorageItem, delayIndex, 7);
    }
}

function saveSize(sizeIndex) {
    if (Modernizr.localstorage) {
        localStorage[sizeIndexStorageItem] = sizeIndex;
    } else {
        createCookie(sizeIndexStorageItem, sizeIndex, 7);
    }
}

function saveCanvas() {
    if (Modernizr.localstorage) {
        localStorage[canvasStorageItem] = canvas.toDataURL('image/png');
    }
}

function createCookie(name, value, days) {
    let expiresLocal;
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expiresLocal = "; expires=" + date.toGMTString();
    } else expiresLocal = "";
    document.cookie = name + "=" + value + expiresLocal + "; path=/";
}

function readCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setSizeFromSelect(sizeIndex) {
    setSize(sizeIndex);
    saveSize(sizeIndex);
    drawCanvas();
}

function setSize(sizeIndex) {
    clearInterval(refreshIntervalId);
    if (isMobile) {
        setSizeMobile(sizeIndex);
    } else {
        setSizeDesktop(sizeIndex);
    }
    if (debug) {
        dim1.innerText = "DEBUG: width:" + canvas.width + " height:" + canvas.height;
    }
}

function setSizeDesktop(sizeIndex) {
    const standardScreenSize = getStandardScreenSize(sizeIndex);
    canvas.width = standardScreenSize.width;
    canvas.height = standardScreenSize.height;
}

function setSizeMobile(sizeIndex) {
    const standardScreenSize = getStandardScreenSize(sizeIndex);
    canvas.height = standardScreenSize.width;
    canvas.width = standardScreenSize.height;
}

function getStandardScreenSize(sizeIndex) {
    const sizes = [[16, 16], [160, 120], [320, 240], [432, 240], [640, 480]];
    const size = sizes[sizeIndex];
    return {
        "width": size[0],
        "height": size[1]
    };
}

function setDelayFromSelect(delayIndex) {
    clearInterval(refreshIntervalId);
    if (debug) {
        dim2.innerText = "DEBUG: delay:" + delayIndex;
    }
    saveDelay(delayIndex);
}

function setSelectedSize(sizeIndex) {
    document.getElementById('selsize').options[sizeIndex].selected = true;
    if (debug) {
        dim1.innerText = "DEBUG: width:" + canvas.width + " height:" + canvas.height;
    }
}

function setSelectedDelay(delayIndex) {
    document.getElementById('seldelay').options[delayIndex].selected = true;
}

function start() {
    const delayIndex = document.getElementById('selsize').options.selected;
    const delay = delays[delayIndex];
    clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval("gol();", delay);
}

function stop() {
    clearInterval(refreshIntervalId);
    // save state to storage
    saveCanvas();
}

function drawCanvas() {
    data = context.createImageData(canvas.width, canvas.height);

    pix = data.data;
    //alert("init");

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            drawPixel(x, y, 255, pix);
        }
    }
    context.putImageData(data, 0, 0);
}

function glider() {
    clearInterval(refreshIntervalId);

    drawCanvas();

    const colour = 0;
    const deltax = canvas.width / 2;
    const deltay = canvas.height / 2;

    drawPixel(deltax + 1, deltay, colour, pix);
    drawPixel(deltax + 2, deltay + 1, colour, pix);
    drawPixel(deltax, deltay + 2, colour, pix);
    drawPixel(deltax + 1, deltay + 2, colour, pix);
    drawPixel(deltax + 2, deltay + 2, colour, pix);

    context.putImageData(data, 0, 0);
}

function acorn() {
    clearInterval(refreshIntervalId);

    drawCanvas();

    const colour = 0;
    const deltax = canvas.width / 2;
    const deltay = canvas.height / 2;

    drawPixel(deltax + 1, deltay, colour, pix);
    drawPixel(deltax + 3, deltay + 1, colour, pix);
    drawPixel(deltax, deltay + 2, colour, pix);
    drawPixel(deltax + 1, deltay + 2, colour, pix);
    drawPixel(deltax + 4, deltay + 2, colour, pix);
    drawPixel(deltax + 5, deltay + 2, colour, pix);
    drawPixel(deltax + 6, deltay + 2, colour, pix);

    context.putImageData(data, 0, 0);
}

function random() {
    clearInterval(refreshIntervalId);

    drawCanvas();
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {

            // either black or white
            const blackorwhite = Math.floor(Math.random() * 2);
            let colour = 255;
            if (blackorwhite === 0) {
                colour = 0;
            }
            drawPixel(x, y, colour, pix);
        }
    }

    context.putImageData(data, 0, 0);

    start();
}

function drawPixel(x, y, colour, thepix) {
    const pixel = (y * canvas.width + x) * 4;
    for (let c = 0; c < 3; c++) {
        const i = pixel + c;
        thepix[i] = colour;
    }
    thepix[pixel + 3] = 255; // alpha
}


/*
 * Taken from wikipedia:
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
function gol() {
    const dataNew = context.createImageData(canvas.width, canvas.height);
    const pixNew = dataNew.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            //d.innerText = "x:"+x +" y:"+ y;
            drawPixel(x, y, isAlive(x, y) ? ALIVE : DEAD, pixNew);
        }
    }
    data = dataNew;
    pix = data.data;
    context.putImageData(dataNew, 0, 0);
}

function isAlive(x, y) {
    let alive = false;
    let aliveNeighbours = 0;

    const cell = (y * canvas.width + x) * 4;

    for (let ky = -1; ky < 2; ky++) {
        for (let kx = -1; kx < 2; kx++) {

            const modifiedKx = ((x + kx) + canvas.width) % canvas.width;
            const modifiedKy = ((y + ky) + canvas.height) % canvas.height;
            const neighbour = ((modifiedKy) * canvas.width + (modifiedKx)) * 4;

            //e.innerText = "neighbour:"+neighbour;
            if (neighbour !== cell && pix[neighbour] === 0) {
                aliveNeighbours++;
            }
        }
    }
    //e.innerText = "aliveNeighbours:"+aliveNeighbours;
    if (3 === aliveNeighbours || (2 === aliveNeighbours && pix[cell] === ALIVE)) {
        alive = true;
    }
    return alive;
}
