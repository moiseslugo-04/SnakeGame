'use strict'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const buttons = document.querySelectorAll('.controls button')
const btnAgain = document.querySelector('.options button')
const modal = document.querySelector('.modal')
const showScore = document.querySelector('.score span')

let width = (canvas.width = 400)
let height = (canvas.height = 500)
let x = canvas.width / 2 - 10
let y = canvas.height - 20
let foodPosition, direction
const snake = [{ x, y, width: 10, height: 10 }]
let score = 0
let speed = 1

const controls = {
  ArrowUp: { x: 0, y: -speed },
  ArrowDown: { x: 0, y: speed },
  ArrowLeft: { x: -speed, y: 0 },
  ArrowRight: { x: speed, y: 0 },
}

//Snake drawing Function
function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  snake.forEach(({ x, y, width, height }) => {
    ctx.fillStyle = '#b3fa0c'
    ctx.fillRect(x, y, width, height)
  })
  if (foodPosition) {
    drawFood(foodPosition.x, foodPosition.y)
  }
}
function drawFood(x, y) {
  if (!x || !y) {
    y = Math.floor(Math.random() * (canvas.height - 60)) + 20
    x = Math.floor(Math.random() * (canvas.width - 40)) + 15
    foodPosition = { x, y }
  }
  ctx.fillStyle = '#06f0a2ab'
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
function growSnake() {
  const newTail = { ...snake[snake.length - 1] }
  if (direction === 'ArrowUp') newTail.y += 1
  if (direction === 'ArrowDown') newTail.y -= 1
  if (direction === 'ArrowLeft') newTail.x += 1
  if (direction === 'ArrowRight') newTail.x -= 1
  snake.push(newTail)
}
//Snake movement function
function moveSnake() {
  if (!controls[direction] || modal.style.display === 'flex')
    return (direction = null)

  const head = { ...snake[0] }
  head.x += controls[direction].x
  head.y += controls[direction].y
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= height) {
    console.log('yes')
    return gameOver()
  }
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = { ...snake[i - 1] }
  }
  snake[0] = head
  if (foodPosition && detectFoodCollision(head, foodPosition)) {
    score += 1
    showScore.textContent = score
    foodPosition = null
    drawFood()
    growSnake()
  }
  if (detectSnakeCollision()) {
    return gameOver()
  }
}
//detect Food collision
function detectFoodCollision(snakeHead, food) {
  const distX = Math.abs(snakeHead.x + snakeHead.width / 2 - food.x)
  const distY = Math.abs(snakeHead.y + snakeHead.width / 2 - food.y)
  const distance = Math.sqrt(distX * distX + distY * distY)
  return distance < snakeHead.width / 2 + 5
}
// detect Snake Collision
function detectSnakeCollision() {
  const head = snake[0]
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }
  return false
}
if (detectSnakeCollision()) {
  console.log('yes')
}

function gameOver() {
  snake.length = 1
  snake[0].x = x // initial value line 11
  snake[0].y = y // initial value line 12
  foodPosition = null
  score = 0
  direction = null
  modal.style.display = 'flex'
  drawFood()
}
function playAgain() {
  modal.style.display = 'none'
}
//Game Events
window.addEventListener('keydown', ({ key }) => {
  if (controls[key]) {
    direction = key
  }
})
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    let key = btn.getAttribute('name')
    if (controls[key]) {
      direction = key
    }
  })
})
btnAgain.addEventListener('click', () => playAgain())
//Game Start function
function startGame() {
  drawFood()
  function loopGame() {
    moveSnake()
    drawSnake()
    window.requestAnimationFrame(loopGame)
  }
  loopGame()
}
startGame()
