'use strict'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const buttons = document.querySelectorAll('.controls button')
const btnAgain = document.querySelector('.options button')
const modal = document.querySelector('.modal')
canvas.width = 400
canvas.height = 500
const snake = {
  width: 10,
  height: 10,
  x: canvas.width / 2 - 10,
  y: canvas.height - 20,
}
let key
const controls = {
  ArrowUp: moveToUp,
  ArrowLeft: moveToLeft,
  ArrowRight: moveToRight,
  ArrowDown: moveToDown,
}
let foodPosition = null
function drawSnake() {
  const { x, y, width, height } = snake
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.fillStyle = '#afee1d'
  ctx.fillRect(x, y, width, height)
  ctx.closePath()
  ctx.stroke()
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
  ctx.beginPath()
  ctx.fillStyle = '#06f0a2ab'
  ctx.strokeStyle = 'transparent'
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
drawFood()
function moveToUp() {
  if (snake.y <= 0) return gameOver()
  snake.y -= 1
}
function moveToRight() {
  if (snake.x >= canvas.width - snake.width) return gameOver()
  snake.x += 1
}
function moveToLeft() {
  if (snake.x <= 0) return gameOver()
  snake.x -= 1
}
function moveToDown() {
  if (snake.y > canvas.height - snake.height) return gameOver()
  snake.y += 1
}
function gameOver() {
  snake.x = canvas.width / 2 - 10
  snake.y = canvas.height - 20
  modal.style.display = 'flex'
  return (key = null)
}
function palyAgain() {
  modal.style.display = 'none'
}
btnAgain.addEventListener('click', () => palyAgain())
window.addEventListener('keydown', (event) => {
  key = event.key
})
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    let name = btn.getAttribute('name')
    key = name
  })
})
function startGame() {
  drawSnake()
  controls?.[key] ? controls[key]() : undefined

  //controls snake
  //TO DO create handle controls
  window.requestAnimationFrame(startGame)
}
startGame()
