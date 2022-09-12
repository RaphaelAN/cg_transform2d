"use strict";

var width;  // Largura do canvas
var height; // Altura do canvas

//  v1------v0
//  |       | 
//  |       |
//  |       |
//  v2------v3
var positionSmall = new Float32Array([ // Coordenada dos vertices
    // x, z, y
    // v0-v1-v2-v3
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
]);

var positionBig = new Float32Array([ // Coordenada dos vertices
    // x, z, y
    // v0-v1-v2-v3
    -0.55, -0.55, 0.55,
    -0.55, 0.55, 0.55,
    -0.55, -0.55, 0.55,
    0.55, -0.55, 0.55,
]);

var numPoints = positionSmall.length / 2;

var ANGLE_INCREMENT = 2.0; // Incremento do angulo (velocidade)

var last_time = Date.now();

function mapToViewport (x, y, n = 5) {
    return [((x + n / 2) * width) / n, ((-y + n / 2) * height) / n];
}

function getVertexSmall (i) {
    let j = (i % numPoints) * 2;
    return [positionSmall[j], positionSmall[j + 1]];
}

function getVertexBig (i) {
    let j = (i % numPoints) * 2;
    return [positionBig[j], positionBig[j + 1]];
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
    // Recupera o elemento <canvas>
    var canvas = document.getElementById('theCanvas');

    // Obtém o contexto de renderização para WebGL
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.log('Falha ao obter o contexto de renderização para WebGL');
    return;
    }

    // Recupera as medidas do canvas
    width = canvas.width;
    height = canvas.height;

    // Muda a direcao da rotacao
    var currentIndex = 0; // Indice inicial de rotacao
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

    // Gera o loop da animacao
    var currentAngle = 2.0; // Angulo inicial
    var runanimation = (() => {
        currentAngle = calculateAngle(currentAngle);
        return () => {
            draw(ctx, currentAngle, currentIndex);
            requestAnimationFrame(runanimation);
        };
    })();
    runanimation();
};