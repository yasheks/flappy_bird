let canvasW;
let canvasH;
let max = 0
let mouseX = 0;
let mouseY = 0;
let obstacles = []
const canvas = document.getElementById("screen");
let jumping = false;
let jumpHeight = document.body.clientHeight / 10;
let score = 0;
let loaded_images = 0;
let interval;
let cadr = 1
const images = {
    "sm1": "./images/sm1.png",
    "sm2": "./images/sm2.png",
    "sm3": "./images/sm3.png",
    "sm4": "./images/sm4.png",
    "sm5": "./images/sm5.png",
    "sm6": "./images/sm6.png",
    "sm7": "./images/sm7.png",
    "sm8": "./images/sm8.png",
    "sm9": "./images/sm9.png",
    "sm10": "./images/sm10.png",
    "sm11": "./images/sm11.png",
    "sm12": "./images/sm12.png",
    "sm13": "./images/sm13.png",
    "sm14": "./images/sm14.png",

    "tower": "./images/tower.png",
    "fire": "./images/fire.png"
}

function loadAllImages() {
    Object.keys(images).forEach((image_title) => {
        let img = new Image()

        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === Object.keys(images).length) {
                startGame()
            }
        });

        img.src = images[image_title]
        images[image_title] = img
    })
}

function createObstacle() {
    const obstacle = {
        x: canvasW, // начальное положение справа за пределами экрана
        y: random(0, canvasH), // случайная высота
        width: 200, // ширина препятствия
        height: random(canvasH / 4, canvasH / 2), // случайная высота проема
        speed: 5 // скорость движения препятствия
    };
    obstacles.push(obstacle);
}
function restartGame() {

    obstacles = [];
    score = 0;
    mouseX = 0;
    mouseY = 0;
    loaded_images = 0;
    startGame();
}
function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.x -= obstacle.speed;
    });

    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvasW / 2) {
        createObstacle();
    }
}

function drawObstacles(ctx) {
    obstacles.forEach((obstacle) => {

        ctx.drawImage(images.tower, obstacle.x, 0, obstacle.width, obstacle.y);
        ctx.drawImage(images.tower, obstacle.x, obstacle.y + obstacle.height, obstacle.width, canvasH - (obstacle.y + obstacle.height));
    });
}

function jump() {
    if (mouseY > 0 || jumping) {
        jumping = true;
        if (mouseY > 0) {
            mouseY -= jumpHeight;
            setTimeout(() => {
                jumping = false;
            }, 10);
        }
    }
}

function checkCollision() {
    obstacles.forEach((obstacle) => {
        if (mouseX >= obstacle.x && mouseX <= obstacle.x + obstacle.width && (mouseY <= obstacle.y || mouseY >= obstacle.y + obstacle.height)) {
            const ctx = canvas.getContext("2d");
            ctx.drawImage(images.fire, mouseX - 25, mouseY - 25, 50, 50);

            max = Math.max(max, score)
            alert("о нет=( Ваш счет: " + score + " Ваш рекорд: " + max);

            restartGame();

        }
        if (mouseX >= obstacle.x && mouseX <= obstacle.x + obstacle.width && mouseY > obstacle.y && mouseY < obstacle.y + obstacle.height) {
            score += 1;
        }
    });
}
function drawScore(ctx) {
    ctx.font = "48px serif";
    ctx.fillStyle = "green";
    let textSize = ctx.measureText(score);
    ctx.fillText("Score: " + score, 50, 50);
}

function random(a, b) {
    return Math.random() * (b - a) + a;
}

function makeFullscreen() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    canvasW = canvas.width;
    canvasH = canvas.height;
}

function saveMousePosition(e) {
    mouseX = canvasW / 4;
    if (!jumping){
        if (mouseY < canvasH) {
            mouseY += 5;
        }
    }
}

function mouseClick(e) {
    if (!jumping) {
        jump();
    }
}

function drawBackground(ctx) {
    ctx.fillStyle = "#f5f5dc";
    ctx.fillRect(0, 0, canvasW, canvasH);
}

function drawPlane(ctx) {
    if (cadr>14){
        cadr = 1
    }
    let imagee = "sm" + cadr;
    console.log(imagee)
    ctx.drawImage(images[imagee], mouseX - 25, mouseY - 25, 50, 50);
    cadr += 1;
}

function drawFrame() {

    makeFullscreen();

    const ctx = canvas.getContext("2d");
    saveMousePosition(ctx);
    drawBackground(ctx);
    updateObstacles();
    drawObstacles(ctx);
    drawPlane(ctx);
    drawScore(ctx);
    checkCollision();
}

function startGame() {
    clearInterval(interval)

    interval = setInterval(drawFrame, 20);
    // addEventListener("mousemove", saveMousePosition);
    addEventListener("mousedown", mouseClick);
}

loadAllImages();
