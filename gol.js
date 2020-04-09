let delay = 50;
let size = "Microvision";
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let refreshIntervalId;
let data;
let pix;
let isMobile;

let debug = false;
let dim1 = document.getElementById('dim1');
let dim2 = document.getElementById('dim2');

function recoverState() {

    // Use Modernizr to detect whether localstorage is supported by the browser
    let localStorageImage;
    if (Modernizr.localstorage) {

        if (localStorage['canvassize']) {
            size = localStorage['canvassize'];
            setSize();
        }
        if (localStorage['canvas']) {

            localStorageImage = new Image(canvas.width, canvas.height);
            localStorageImage.addEventListener("load", function (event) {
                context.drawImage(localStorageImage, 0, 0);
                data = context.getImageData(0, 0, canvas.width, canvas.height);
                pix = data.data;

            }, false);
            localStorageImage.src = localStorage['canvas'];


        }

        if (localStorage['delay']) {
            delay = localStorage['delay'];
        }
    } else {
        if (readCookie("canvassize")) {
            size = readCookie("canvassize");
            setSize();
        }
        if (readCookie("delay")) {
            delay = readCookie("delay");
        }
    }
    // update the controls
    setSelectedSize();
    setSelectedDelay();

}

function saveDelay() {
    if (Modernizr.localstorage) {
        localStorage['delay'] = delay;
    } else {
        createCookie("delay", delay, 7);
    }
}

function saveSize() {
    if (Modernizr.localstorage) {
        localStorage['canvassize'] = size;
    } else {
        createCookie("canvassize", size, 7);
    }
}

function saveCanvas() {
    if (Modernizr.localstorage) {
        localStorage['canvas'] = canvas.toDataURL('image/png');
    }
}

function stop() {
    clearInterval(refreshIntervalId);
    // save state to storage
    saveCanvas();
    saveSize();
    saveDelay();
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

function init() {
    data = context.createImageData(canvas.width, canvas.height);

    pix = data.data;
    //alert("init");

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            drawPixel(x, y, 255, pix);
        }
    }
}

function glider() {
    clearInterval(refreshIntervalId);

    init();

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

    init();

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

    init();
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

function setSizeFromSelect(newsize) {
    size = newsize;
    setSize();

    saveSize();
}

function setSize() {
    if (isMobile) {
        setSizeMobile();
    } else {
        setSizeDesktop();
    }
    if (debug) {
        dim1.innerText = "DEBUG: width:" + canvas.width + " height:" + canvas.height;
    }
}

function getStandardScreenSize() {
    let width, height;
    if ("Microvision" === size) {
        width = 16;
        height = 16;
    } else if ("QQVGA" === size) {
        width = 160;
        height = 120;
    } else if ("QVGA" === size) {
        width = 320;
        height = 240;
    } else if ("WQVGA" === size) {
        width = 432;
        height = 240;
    } else if ("VGA" === size) {
        width = 640;
        height = 480;
    }
    return {
        "width": width,
        "height": height
    }
}

function setSizeDesktop() {
    clearInterval(refreshIntervalId);
    const standardScreenSize = getStandardScreenSize();
    canvas.width = standardScreenSize.width;
    canvas.height = standardScreenSize.height;
}

function setSizeMobile() {
    clearInterval(refreshIntervalId);
    const standardScreenSize = getStandardScreenSize();
    canvas.height = standardScreenSize.width;
    canvas.width = standardScreenSize.height;
}

function setDelayFromSelect(delayStr) {
    clearInterval(refreshIntervalId);
    delay = parseInt(delayStr, 10) * 1000;
    if (debug) {
        dim2.innerText = "DEBUG: delay:" + delay;
    }
    saveDelay();
}

function setSelectedSize() {
    if (isMobile) {
        setSelectedSizeMobile();
    } else {
        setSelectedSizeDesktop();
    }
    if (debug) {
        dim1.innerText = "DEBUG: width:" + canvas.width + " height:" + canvas.height;
    }
}

function setSelectedSizeDesktop() {
    const sizes = ["Microvision", "QQVGA", "QVGA", "WQVGA", "VGA"];
    document.getElementById('selsize').options[sizes.indexOf(size)].selected = true;
}

// TODO add mobile friendly sizes
function setSelectedSizeMobile() {
    setSelectedSizeDesktop();
}

function setSelectedDelay() {
    const delays = [10, 50, 100, 500, 1000, 2000];
    document.getElementById('seldelay').options[delays.indexOf(delay)].selected = true;
}

function start() {
    clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval("gol();", delay);
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
            const cell = (y * canvas.width + x) * 4;

            const alive = isAlive(cell, x, y);

            let colour = 255;
            if (alive) {
                colour = 0;
            }
            drawPixel(x, y, colour, pixNew);
        }
    }
    data = dataNew;
    pix = data.data;
    context.putImageData(dataNew, 0, 0);
}

function isAlive(cell, x, y) {
    let alive = false;
    let aliveCount = 0;

    for (let ky = -1; ky < 2; ky++) {
        for (let kx = -1; kx < 2; kx++) {
            const neighbour = ((y + ky) * canvas.width + (x + kx)) * 4;

            //e.innerText = "neighbour:"+neighbour;
            if (neighbour >= 0 && neighbour <= pix.length && neighbour !== cell
                && pix[neighbour] === 0) {
                aliveCount++;
            }
        }
    }
    //e.innerText = "aliveCount:"+aliveCount;
    if ((aliveCount >= 2 && aliveCount <= 3 && pix[cell] === 0)
        ||
        (aliveCount === 3)) {
        alive = true;
    }
    return alive;
}

function setMobileDevice() {
    isMobile = true;
    init();
    recoverState();
    setSize();
}

function setDesktopDevice() {
    isMobile = false;
    init();
    recoverState();
    setSize();
}