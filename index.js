'use strict'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const buttons = document.querySelectorAll('.controls button')
const btnAgain = document.querySelector('.options button')
const modal = document.querySelector('.modal')
const showScore = document.querySelector('.score span')

//Configure Canvas Dimensions based on Canvas size
const updateCanvasSize = () => {
  // Update the dimensions of Canvas dynamically
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}
// canvas measures
const canvasWidth = canvas.width
const canvasHeight = canvas.height
let score = 0
let foodPosition = null
let direction = undefined
let counter = 0
let speed = 1
const radio = 5
const snakeWidth = 10
const snakeHeight = 10
const Snake = [
  {
    x: canvasWidth / 2 - 10,
    y: canvasHeight - 2 * snakeHeight,
    width: snakeWidth,
    height: snakeHeight,
  },
]

updateCanvasSize()
// <== drawing functions ==>
function drawSnake() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  Snake.forEach(({ x, y, width, height }, index) => {
    ctx.fillStyle = '#5bd30b'
    ctx.fillRect(x, y, width, height)
  })
  if (foodPosition) {
    drawFood(foodPosition.x, foodPosition.y)
  }
}
function drawFood(x, y) {
  if (!x || !y) {
    y = Math.floor(Math.random() * (canvasHeight - 60)) + 20
    x = Math.floor(Math.random() * (canvasWidth - 40)) + 15
    foodPosition = { x, y }
  }
  ctx.fillStyle = '#14fadbd7'
  ctx.beginPath()
  ctx.arc(x, y, radio, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
}
// <== logical functions ==>
function moveSnake() {
  let controls = getControls(speed)
  if (!controls[direction] || modal.style.display === 'flex') return
  speed = handleSpeed()
  const head = { ...Snake[0] }
  head.x += controls[direction].x
  head.y += controls[direction].y
  if (
    head.x < 0 ||
    head.x + snakeWidth > canvasWidth ||
    head.y < 0 ||
    head.y + snakeHeight >= canvasHeight
  ) {
    return gameOver()
  }
  for (let i = Snake.length - 1; i > 0; i--) {
    Snake[i] = { ...Snake[i - 1] }
  }
  Snake[0] = head
  if (foodPosition && detectCollisionFood(head, foodPosition)) {
    growSnake()
    score++
    showScore.textContent = score
    foodPosition = null
    drawFood()
  }
}
function growSnake() {
  let tail = { ...Snake[Snake.length - 1] }
  Snake.push(tail)
}
function gameOver() {
  // restore default value
  Snake[0].x = canvas.width / 2 - 10
  Snake[0].y = canvas.height - 20
  ;(score = 0), (foodPosition = null), (direction = null), (counter = 0)
  modal.style.display = 'flex'
  drawFood()
}
function getControls(speed) {
  return {
    ArrowUp: { x: 0, y: -speed },
    ArrowDown: { x: 0, y: speed },
    ArrowLeft: { x: -speed, y: 0 },
    ArrowRight: { x: speed, y: 0 },
  }
}
function playAgain() {
  modal.style.display = 'none'
}
function handleSpeed() {
  if (score === 5) speed = 2
  if (score === 10) speed = 3
  if (score === 15) speed = 4
  if (score === 20) speed = 5
  if (score === 25) speed = 6
  return speed
}
function detectCollisionFood(snakeHead, food) {
  const distX = Math.abs(snakeHead.x + snakeHead.width / 2 - food.x)
  const distY = Math.abs(snakeHead.y + snakeHead.height / 2 - food.y)
  const distance = Math.sqrt(distX * distX + distY * distY)
  return distance < snakeHead.width / 2 + radio
}
//<=== Game Events ===>
window.addEventListener('keydown', ({ key }) => {
  if (getControls(speed)[key]) direction = key
})
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    let key = btn.getAttribute('name')
    if (getControls(speed)[key]) direction = key
  })
})
btnAgain.addEventListener('click', () => playAgain())

function startGame() {
  drawFood()
  function loopGame() {
    drawSnake()
    moveSnake()
    window.requestAnimationFrame(loopGame)
  }
  loopGame()
}
startGame()
