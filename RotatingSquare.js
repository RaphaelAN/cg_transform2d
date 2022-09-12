"use strict";

var width;
var height;

var squareSmall = new Float32Array([
    // x, z, y
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
]);

var squareBig = new Float32Array([
    // x, z, y
    -0.55, -0.55, 0.55,
    -0.55, 0.55, 0.55,
    -0.55, -0.55, 0.55,
    0.55, -0.55, 0.55,
]);

var numPoints = squareSmall.length / 2;

var ANGLE_INCREMENT = 2.0;

var last_time = Date.now();

function mapToViewport (x, y, n = 5) {
    return [((x + n / 2) * width) / n, ((-y + n / 2) * height) / n];
}

function getVertexSmall (i) {
    let j = (i % numPoints) * 2;
    return [squareSmall[j], squareSmall[j + 1]];
}

function getVertexBig (i) {
    let j = (i % numPoints) * 2;
    return [squareBig[j], squareBig[j + 1]];
}

function draw (ctx, angle, index) {
    ctx.fillStyle = "rgba(0, 204, 204, 1)";
    ctx.rect(0, 0, width, height);
    ctx.fill();

    
    let [x2, y2] = mapToViewport(...getVertexBig(index));
    ctx.translate(x2, y2);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-x2, -y2)
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x2, y2] = mapToViewport(...getVertexBig(i).map((x) => x));
        if (i == 0) ctx.moveTo(x2, y2);
        else ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fillStyle = "gray";
    ctx.fill();

    let [x, y] = mapToViewport(...getVertexSmall(index));
    ctx.translate(x, y);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-x, -y)
    var grad;
    if( index == 0) {
        grad = ctx.createLinearGradient(203, 150, x, y)
        grad.addColorStop(0, "blue")
        grad.addColorStop(1, "red")
    }
    if( index == 1) {
        grad = ctx.createLinearGradient(167, 200, x, y)
        grad.addColorStop(0, "white")
        grad.addColorStop(1, "green")
    }
    if( index == 2) {
        grad = ctx.createLinearGradient(210, 270, x, y)
        grad.addColorStop(0, "red")
        grad.addColorStop(1, "blue")
    }
    if( index == 5) {
        grad = ctx.createLinearGradient(167, 200, x, y)
        grad.addColorStop(0, "green")
        grad.addColorStop(1, "white")
    }
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertexSmall(i).map((x) => x));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    
    
    for (let i = 0; i < numPoints; i++) {
        ctx.beginPath()
        let [x, y] = mapToViewport(...getVertexSmall(i).map((x) => x));
        if(i == 0){
            ctx.rect(x-3, y-3, 5, 5);
            ctx.fillStyle = "red";
            ctx.fill();
        }
        if(i == 1){
            ctx.rect(x-3, y-3, 5, 5);
            ctx.fillStyle = "green";
            ctx.fill();
        }
        if(i == 2){
            ctx.rect(x-3, y-3, 5, 5);
            ctx.fillStyle = "blue";
            ctx.fill();
        }
        if(i == 5){
            ctx.rect(x-3, y-3, 5, 5);
            ctx.fillStyle = "white";
            ctx.fill();
        }
        ctx.closePath()
    }
    
}

function calculateAngle (angle) {
    var now = Date.now();
    var elapsed = now - last_time;
    last_time = now;
    var newAngle = angle + (ANGLE_INCREMENT * elapsed) / 1000.0;
    return newAngle %= 360;
};

function mainEntrance () {
    var canvas = document.getElementById('theCanvas');
    var ctx = canvas.getContext("2d");

    if (!ctx) {
        console.log('Falha ao obter o contexto de renderização para WebGL');
    return;
    }

    width = canvas.width;
    height = canvas.height;
    var currentIndex = 0; 
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "r":
                currentIndex = 0;
                break;
            case "g":
                currentIndex = 1;
                break;
            case "b":
                currentIndex = 2;
                break;
            case "w":
                currentIndex = 5;
                break;
        }
    });


    var currentAngle = 2.0;
    var runanimation = (() => {
        currentAngle = calculateAngle(currentAngle);
        return () => {
            draw(ctx, currentAngle, currentIndex);
            requestAnimationFrame(runanimation);
        };
    })();
    runanimation();
};