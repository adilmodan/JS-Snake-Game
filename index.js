// DOM elements
const grid = document.querySelector(".grid")
const startBtn = document.getElementById("start")
const scoreBoard = document.getElementById("score")

// variables
let squares = []
let currentSnake = [2, 1, 0]
let direction = 1
let lastDirectionUsed = 1
const width = 10
let time = 600
let speedIncrease = .05 // in %
let appleIndex = 0
let applePoints = 1
let score = 0

// Initialize game
function createGrid() {
    for(let i=0; i<100; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)
        squares.push(square)
    }
}

// reset Game
function reset() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [2, 1, 0]
    createSnake()
    generateApple()
    direction = 1
    time = 600
    score = 0
    scoreBoard.textContent = score
    timerId = setInterval(move, time)
}

function createSnake() {
    currentSnake.forEach(index => squares[index].classList.add('snake'))
}

createGrid()
createSnake()
generateApple()

// controls
function move() {
    if (!isGameOver()) {
        const tail = currentSnake.pop(0)
        squares[tail].classList.remove('snake')
        const head = currentSnake.unshift(currentSnake[0] + direction)
        if(squares[currentSnake[0]].classList.contains('apple')) {
            eatApple(tail)
            clearInterval(timerId)
            timerId = setInterval(move, time)
        }
        squares[currentSnake[0]].classList.add('snake')
        lastDirectionUsed = direction
    } else {
        clearInterval(timerId)
    }    
}

let timerId = setInterval(move, time)

function control(e) {
    //right
    if (e.keyCode === 39 && lastDirectionUsed !== -1) direction = 1
    // left
    else if (e.keyCode === 37 && lastDirectionUsed !== 1) direction = -1
    // up
    else if (e.keyCode === 38 && lastDirectionUsed !== width) direction = -width
    // down
    else if (e.keyCode === 40 && lastDirectionUsed !== -width) direction = +width
}

document.addEventListener('keydown', control)
startBtn.addEventListener('click', reset)

// Game rules
function isGameOver() {
    return (currentSnake[0] + direction < 0 ||
        currentSnake[0] + direction > width*width ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] % width === 9 && direction === 1) ||
        squares[currentSnake[0] + direction].classList.contains('snake')
    )
}

function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (
        squares[appleIndex].classList.contains('snake') ||
        squares[appleIndex].classList.contains('apple')
    )

    squares[appleIndex].classList.add('apple')
}

function eatApple(tail) {
    squares[appleIndex].classList.remove('apple')
    currentSnake.push(tail)
    squares[tail].classList.add('snake')
    time -= (time*speedIncrease)
    console.log(`${time} ms.`)
    score += applePoints
    scoreBoard.textContent = score
    generateApple()
}
