let canvas, ctx, maxX, maxY, interval, food;
const snake = [];
const consumedFood = [];
let direction = "l"

document.addEventListener("DOMContentLoaded", async () => {
  await getCanvas();
  await createSnake();
  await renderSnake();

  let startBtn = document.getElementById("start");
  let pauseBtn = document.getElementById("pause");
  startBtn.addEventListener("click", () => {
    if (interval) {
      return
    }
    moveSnake();
    generateFood();
  })
  pauseBtn.addEventListener("click", pauseSnake)
  document.addEventListener("keydown", changeDirection)
})

function changeDirection(ev) {
  console.log(ev.key);
  if (ev.key == "ArrowUp" && direction !== "b") {
    direction = "t"
  }
  if (ev.key == "ArrowDown" && direction !== "t") {
    direction = "b"
  }
  if (ev.key == "ArrowRight" && direction !== "l") {
    direction = "r"
  }
  if (ev.key == "ArrowLeft" && direction !== "r") {
    direction = "l"
  }
}

async function getCanvas() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  maxX = canvas.offsetWidth - 10;
  maxY = canvas.offsetHeight - 10;
}

async function createSnake() {
  let midX = Math.floor((maxX / 2) / 10) * 10;
  let midY = Math.floor((maxY / 2) / 10) * 10;
  for (let index = 0; index < 5; index++) {
    snake.push({ x: midX, y: midY })
    midX += 10;
  }
}

async function renderSnake() {
  for (let index = 0; index < snake.length; index++) {
    const snakeChunk = snake[index];
    renderSnakeChunk(snakeChunk)
  }
}

async function renderSnakeChunk(snakeChunk) {
  ctx.strokestyle = "darkgreen";
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(snakeChunk.x, snakeChunk.y, 10, 10);
  ctx.strokeRect(snakeChunk.x, snakeChunk.y, 10, 10);
}

async function clearSnakeChunk(snakeChunk) {
  ctx.clearRect(snakeChunk.x - 1, snakeChunk.y - 1, 12, 12);
}

async function pauseSnake() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

function getRandomInt(max) {
  return Math.floor((Math.random() * max) / 10) * 10;
}

async function generateFood() {
  food = {
    x: getRandomInt(maxX),
    y: getRandomInt(maxY)
  }
  if (isValidLocation(food)) {
    renderFood(food)
  } else {
    generateFood()
  }
}

async function isValidLocation(food) {
  for (let index = 0; index < snake.length; index++) {
    const snakeChunk = snake[index];
    if (snakeChunk.x == food.x && snakeChunk.y == food.y) {
      return false
    }
  }
  return true
}

async function renderFood(food) {
  let ctxFood = canvas.getContext("2d");
  ctxFood.strokestyle = "black";
  ctxFood.fillStyle = "lightred";
  ctxFood.fillRect(food.x, food.y, 10, 10);
  ctxFood.strokeRect(food.x, food.y, 10, 10);
}

async function moveSnake() {
  interval = setInterval(async () => {
    let prevChunk = snake.at(-1);
    let nextChunk = { ...snake[0] };

    await checkDirection(nextChunk)

    if (food.x == nextChunk.x && food.y == nextChunk.y) {
      consumedFood.push({ ...food })
      generateFood()
    }

    snake.unshift(nextChunk);
    
    if (consumedFood.length) {
      const lastConsumedFood = consumedFood[0];
      if (lastConsumedFood && (prevChunk.x != lastConsumedFood.x || prevChunk.y != lastConsumedFood.y)) {
        removeTailChunk();
      } else {
        consumedFood.splice(0, 1)
      }
    } else {
      removeTailChunk()
    }

    renderSnakeChunk(nextChunk);
  }, 200)
}

function removeTailChunk() {
  const snakeChunk = snake.pop();
  clearSnakeChunk(snakeChunk);
}

async function checkDirection(nextChunk) {
  if (direction == 'l') {
    if (nextChunk.x <= 0) {
      nextChunk.x = maxX
    } else {
      nextChunk.x -= 10
    }
  }
  if (direction == 'r') {
    if (nextChunk.x >= maxX) {
      nextChunk.x = 0
    } else {
      nextChunk.x += 10
    }
  }
  if (direction == 't') {
    if (nextChunk.y <= 0) {
      nextChunk.y = maxY
    } else {
      nextChunk.y -= 10
    }
  }
  if (direction == 'b') {
    if (nextChunk.y >= maxY) {
      nextChunk.y = 0
    } else {
      nextChunk.y += 10
    }
  }
}