let game = document.getElementById("game");
let canvas = document.getElementById("foreground");
let ctx = canvas.getContext("2d");
let scoreDisplay = document.getElementById("score");
let levelDisplay = document.getElementById("level");
let startBtn = document.getElementById("startBtn");
let retryBtn = document.getElementById("retryBtn");
let leftBtn = document.getElementById("left");
let upBtn = document.getElementById("up");
let rightBtn = document.getElementById("right");
let downBtn = document.getElementById("down");
let start = document.getElementById("start");
let lose = document.getElementById("lose");
let finalScore = document.getElementById("final-score");

function resizeGame() {
	game.style.width = `${window.innerWidth - (window.innerWidth % 50)}px`;
	game.style.height = `${(window.innerWidth - (window.innerWidth % 50)) / 2}px`;
	game.style.left = `${(window.innerWidth - (window.innerWidth - (window.innerWidth % 50) + window.innerWidth*0.005)) / 2}px`;
}

resizeGame();

let score = 0,
block = 50,
level = 1,
bPW = canvas.width / block,
bPH = canvas.height / block,
totalScreenW = canvas.width,
totalScreenH = canvas.height;
class Snake {
   constructor(x, y) {
      this.alive = true;
      this.head = [x, y];
      this.body = [
         [x, y + block],
         [x, y + block]
      ];
      this.direction = "up";
		this.lastDirection = "up";
   }

   move() {
      let offsetX,
         offsetY;
      if (this.direction === "up") {
         offsetX = 0;
         offsetY = -1;
      } else if (this.direction === "down") {
         offsetX = 0;
         offsetY = 1;
      } else if (this.direction === "left") {
         offsetX = -1;
         offsetY = 0;
      } else if (this.direction === "right") {
         offsetX = 1;
         offsetY = 0;
      }
      for (let i = this.body.length - 1; i > 0; i--) {
         this.body[i][0] = this.body[i - 1][0];
         this.body[i][1] = this.body[i - 1][1];
      }
      this.body[0][0] = this.head[0];
      this.body[0][1] = this.head[1];
      this.head[0] = this.head[0] + (offsetX * block);
      this.head[1] = this.head[1] + (offsetY * block);
		if (this.head[0] < 0) {
			this.head[0] = totalScreenW - block;
		} else if (this.head[0] > totalScreenW - block) {
			this.head[0] = 0;
		}
		if (this.head[1] < 0) {
			this.head[1] = totalScreenH - block;
		} else if (this.head[1] > totalScreenH - block) {
			this.head[1] = 0;
		}
		for (let i = 0; i < this.body.length; i++) {
			if (this.body[0] < 0) {
				this.body[0] = totalScreenW - block;
			} else if (this.body[0] > totalScreenW - block) {
				this.body[0] = 0;
			}
			if (this.body[1] < 0) {
				this.body[1] = totalScreenH - block;
			} else if (this.body[1] > totalScreenH - block) {
				this.body[1] = 0;
			}
		}
		this.lastDirection = this.direction;
   }

	checkDeath() {
		for (let i = 0; i < this.body.length; i++) {
			if (this.head[0] == this.body[i][0] && this.head[1] == this.body[i][1]) this.alive = false;
		}
	}

   eat() {
      let bLeng = this.body.length,
         lastPart = [this.body[bLeng - 1][0], this.body[bLeng - 1][1]],
         secondPart = [this.body[bLeng - 2][0], this.body[bLeng - 2][1]],
         xOffset = 0,
         yOffset = 0;
      if (lastPart[0] == secondPart[0]) {
         xOffset = 0;
      } else if (lastPart[0] > secondPart[0]) {
         xOffset = 1;
      } else {
         xOffset = -1;
      }
      if (lastPart[1] == secondPart[1]) {
         yOffset = 0;
      } else if (lastPart[1] > secondPart[1]) {
         yOffset = 1;
      } else {
         yOffset = -1;
      }
      this.body.push([lastPart[0] + (xOffset * block), lastPart[1] + (yOffset * block)]);
   }

   display() {
      for (let i = 0; i < this.body.length; i++) {
         ctx.fillStyle = "rgb(100,240,110)";
         ctx.fillRect(this.body[i][0], this.body[i][1], block, block);
      }
      ctx.fillRect(this.head[0], this.head[1], block, block);
   }
}

class Food {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }

   display() {
      ctx.fillStyle = "rgb(200,50,50)";
      ctx.fillRect(this.x, this.y, block, block);
   }
}


function newSnake() {
   return new Snake(totalScreenW / 2, totalScreenH / 2);
}

let snake = newSnake();

function newFood() {
	let xRandom = Math.floor(Math.random() * bPW) * block,
	yRandom = Math.floor(Math.random() * bPH) * block;
	for (let i = 0; i < snake.body.length; i++) {
		if (snake.body[i][0] == xRandom && snake.body[i][1] == yRandom) {
			xRandom = Math.floor(Math.random() * bPW) * block;
			yRandom = Math.floor(Math.random() * bPH) * block;
			i = 0;
		}
	}
   return new Food(xRandom, yRandom);
}

let foodList = [];
foodList.push(newFood());

function gameTick() {

   for (i in snake.body) {
      if (snake.head[0] == snake.body[i][0] && snake.head[1] == snake.body[i][1]) snake.alive = false;
   }

   for (i in foodList) {
      if (snake.head[0] == foodList[i].x && snake.head[1] == foodList[i].y) {
         snake.eat();
			score++;
         foodList[i] = newFood();
      }
   }

   snake.move();
	snake.checkDeath();

	if (score >= 10) {
		level = 2;
	} else if (score >= 25) {
		level = 3;
	} else if (score >= 50) {
		level = 4;
	} else if (score >= 75) {
		level = 5;
	} else if (score >= 100) {
		level = 6;
	}
	tps = 3 + (level*2);
	tInterval = 1000/tps;
}

function gameDraw() {
   ctx.clearRect(0, 0, totalScreenW, totalScreenH);

   for (i in foodList) {
      foodList[i].display();
   }
   snake.display();

	scoreDisplay.innerHTML = `Score: ${score}`;
	levelDisplay.innerHTML = `Level: ${level}`;
}

let tps = (level*2) + 3,
   tInterval = 1000 / tps,
   tickNow,
   tickThen,
   tickElapsed,
   fps = 60,
   fInterval = 1000 / fps,
   frameNow,
   frameThen,
   frameElapsed,
	frame;

function gameFrame() {


   frame = requestAnimationFrame(gameFrame);

	if (!snake.alive) {
		finalScore.innerHTML = `Your final score: ${score}`;
		lose.style.display = "block";
      cancelAnimationFrame(frame);
   }

   tickNow = Date.now();
   tickElapsed = tickNow - tickThen;
   if (tickElapsed >= tInterval) {
      tickThen = tickNow - (tickElapsed % tInterval);
      gameTick();

   }

   frameNow = Date.now();
   frameElapsed = frameNow - frameThen;
   if (frameElapsed >= fInterval) {
      frameThen = frameNow - (frameElapsed % fInterval);
      gameDraw();
   }
}

function startGame() {
	start.style.display = "none";
	lose.style.display = "none";
   tickThen = Date.now();
   frameThen = Date.now();
	snake = newSnake();
	score = 0;
	level = 1;
   gameFrame();
}

window.addEventListener("keydown", function(e) {
   switch (e.key) {
      case "ArrowLeft": //left
         if (snake.lastDirection != "right") snake.direction = "left";
         break;
      case "ArrowUp": //up
         if (snake.lastDirection != "down") snake.direction = "up";
         break;
      case "ArrowRight": //right
         if (snake.lastDirection != "left") snake.direction = "right";
         break;
      case "ArrowDown": //down
         if (snake.lastDirection != "up") snake.direction = "down"
         break;
   }
});

leftBtn.addEventListener("click", function() {
	if (snake.lastDirection != "right") snake.direction = "left";
});
upBtn.addEventListener("click", function() {
	if (snake.lastDirection != "down") snake.direction = "up";
});
rightBtn.addEventListener("click", function() {
	if (snake.lastDirection != "left") snake.direction = "right";
});
downBtn.addEventListener("click", function() {
	if (snake.lastDirection != "up") snake.direction = "down";
});

leftBtn.addEventListener("touchstart", function() {
	if (snake.lastDirection != "right") snake.direction = "left";
});
upBtn.addEventListener("touchstart", function() {
	if (snake.lastDirection != "down") snake.direction = "up";
});
rightBtn.addEventListener("touchstart", function() {
	if (snake.lastDirection != "left") snake.direction = "right";
});
downBtn.addEventListener("touchstart", function() {
	if (snake.lastDirection != "up") snake.direction = "down";
});

window.addEventListener("load", function() {
	start.style.display = "block";
});

window.addEventListener("resize", resizeGame);

startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
