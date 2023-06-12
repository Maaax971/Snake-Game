// Définition des constantes
const canvasWidth = 400;
const canvasHeight = 400;
const gridSize = 20;
const initialSnakeLength = 4;
const frameRate = 8;

// Déclaration des variables
let canvas, ctx;

let gameScore = document.querySelector("#score");
let score;

let snake;

let snakeHeadImgs;
let snakeHeadImgsRotat;

let snakeTailImg;
let tailRotation;

let food;
let foodImage;

let direction;

let gameLoop;

// Fonction d'initialisation du jeu
function init() {
  // Création du canvas
  canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  document.querySelector("#canva").appendChild(canvas);
  
  ctx = canvas.getContext("2d");

  // Initialisation de la direction de départ
  direction = "right";

  // Initialisation du serpent
  snake = [];
  for (let i = initialSnakeLength - 1; i >= 0; i--) {
    snake.push({ x: i, y: 0 });
    }
   

  // Génération de la nourriture
  generateFood();
  
  // Démarrage de la boucle de jeu
  gameLoop = setInterval(draw, 1000 / frameRate);
  
  // Écoute des événements clavier
  document.addEventListener("keydown", changeDirection);

  //On charge les images pour le style du jeu   
  loadImages();
  

}

// Fonction de génération de la nourriture
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasWidth / gridSize)),
    y: Math.floor(Math.random() * (canvasHeight / gridSize))
  };
}

function loadImages() {

    foodImage = new Image();
    foodImage.src = "/img/apple.png";

    snakeHeadImgs = [];
    snakeHeadImgs[0] = new Image();
    snakeHeadImgs[0].src = "/img/headSnakeR.png";
    snakeHeadImgs[1] = new Image();
    snakeHeadImgs[1].src = "/img/headSnakeD.png";
    snakeHeadImgs[2] = new Image();
    snakeHeadImgs[2].src = "/img/headSnakeL.png";
    snakeHeadImgs[3] = new Image();
    snakeHeadImgs[3].src = "/img/headSnakeU.png";
    
    
    snakeTailImg = new Image();
    snakeTailImg.src = "/img/tailSnake.png";

    snakeHeadImgs[0].onload();
    snakeTailImg.onload();
}

// Fonction de dessin du jeu (Serpent entier + nourriture)
function draw() {

  // Déplacement du serpent
  moveSnake();

  // Vérification des collisions
  if (checkCollision()) {
    gameOver();
    return;
  }

  // Effacement du canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Dessin de la nourriture
  ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Dessin du serpent

  ctx.drawImage(snakeHeadImgs[snakeHeadImgsRotat], snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
  
    for (let i = 1; i < snake.length - 1; i++) {
      ctx.fillStyle = '#3e702e';
      ctx.fillRect(
          snake[i].x * gridSize,
          snake[i].y * gridSize,
          gridSize,
          gridSize
          );
    }
    // ce code fonctionne !
    // On stocke le dernier segment avec length - 1
    const tailSegment = snake[snake.length - 1];
    // On sauvegarde l'état du dernier dessin et on ajuste par rapport à sa position avec translate et rotate puis on dessine la queue du serpent avec l'image 
    ctx.save();
    ctx.translate(tailSegment.x * gridSize + gridSize / 2, tailSegment.y * gridSize + gridSize / 2);
    ctx.rotate(tailRotation);
    ctx.drawImage(
    snakeTailImg,
    -gridSize / 2,
    -gridSize / 2,
    gridSize,
    gridSize
    );
    ctx.restore();
}

// Fonction de déplacement du serpent
function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  
  switch (direction) {
    case "up":
      head.y--;
      snakeHeadImgsRotat = 3;
      break;
    case "down":
      head.y++;
      snakeHeadImgsRotat = 1;
      break;
    case "left":
      head.x--;
      snakeHeadImgsRotat = 2;
      break;
    case "right":
      head.x++;
      snakeHeadImgsRotat = 0;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    // Le serpent a mangé la nourriture
    generateFood();
    score = snake.length - 4;
    gameScore.textContent = score;
    } else {
    // Le serpent n'a pas mangé la nourriture, on supprime le dernier segment
    snake.pop();
    }

    updateTailRotation();
    

}

// Fonction de vérification des collisions
function checkCollision() {
  const head = snake[0];

  // Collision avec les bords du canvas
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasWidth / gridSize ||
    head.y >= canvasHeight / gridSize
  ) {
    return true;
  }

  // Collision avec le corps du serpent
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Fonction de gestion de la fin de jeu
function gameOver() {

  clearInterval(gameLoop);

  if (window.confirm("Game Over ! " + "Votre score est de : "+ score +" Une nouvelle Partie ?")) {
    document.location.reload();
  }
  
}

// Fonction de gestion des événements clavier avec code des touches clavier
function changeDirection(event) {
  const key = event.keyCode;

  switch (key) {
    case 37: // left arrow
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case 38: // up arrow
      if (direction !== "down") {
        direction = "up";
        
      }
      break;
    case 39: // right arrow
      if (direction !== "left") {
        direction = "right";
        
      }
      break;
    case 40: // down arrow
      if (direction !== "up") {
        direction = "down";
        
      }
      break;
  }
}

// Fonction pour sauvegarder la position de l'avant dernier segment (avant la queue du serpent) pour gérer la rotation logique de la queue

function updateTailRotation() {
    const tailSegment = snake[snake.length - 1];
    const previousSegment = snake[snake.length - 2];
  
    if (previousSegment.x < tailSegment.x) {
      tailRotation = 0;
    } else if (previousSegment.x > tailSegment.x) {
      tailRotation = Math.PI;
    } else if (previousSegment.y < tailSegment.y) {
      tailRotation = Math.PI / 2;
    } else if (previousSegment.y > tailSegment.y) {
      tailRotation = -Math.PI / 2;
    }
  }

// Initialisation du jeu



init();
