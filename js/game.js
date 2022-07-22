'use strict'

const LIFE = '💗'
const HINT = '💡'

var gBoard
var gLevel = {
    size: 0,
    mines: 0,
}
var gGame = {
    isRunning: false,
    isOver: false,
    shownCount: 0,
    clearedCount: 0,
    flagsCount: 0,
    interval: 0,
    livesCount: 3,
}

window.oncontextmenu = () => { return false }

function initGame(size = 4, mines = 2, elSelectedLevel) {
    // if no level selected, beginner level is auto selected
    elSelectedLevel = ((typeof elSelectedLevel) !== 'undefined') ? elSelectedLevel : document.getElementById(`size-${size}`)

    const elBoardHeader = document.querySelector('.board-header')
    elBoardHeader.setAttribute('colspan', `${size}`)

    const elEmoji = document.querySelector('.emoji')
    elEmoji.innerText = `🙂`

    const elMineCount = document.querySelector('.mine-count')
    elMineCount.innerText = (mines <= 9) ? `00${mines}` : `0${mines}`

    const elLivesCount = document.getElementById('lives-count')
    elLivesCount.innerText = `${LIFE}${LIFE}${LIFE}`

    clearInterval(gGame.interval)

    resetTimer()
    gLevel.size = size
    gLevel.mines = mines
    elSelectedLevel.style.backgroundColor = '#0B2027'
    mineLocations = []
    gGame = {
        isRunning: false, isOver: false, shownCount: 0, clearedCount: 0, flagsCount: 0, interval: 0, livesCount: 3, spoilCount: 3,
    }
    gCheats = {
        spoilers: 3, hints: 3
    }

    gBoard = createBoard(size)
    renderBoard(gBoard, '.board')
}

function levelSelect(size, mines, elButton) {
    const elButtons = document.querySelectorAll('.difficulty-buttons button')
    const elEmoji = document.querySelector('.emoji')
    elEmoji.setAttribute(`onclick`, `initGame(${size}, ${mines})`)
    for (let i = 0; i < elButtons.length; i++) {
        const elLevelButton = elButtons[i];
        if (elButton === elLevelButton) {
            elButton.style.backgroundColor = '#40798C'
        }
        else elLevelButton.removeAttribute('style')
    }
    initGame(size, mines, elButton)
}

function createBoard(size) {
    const board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            const location = { i, j }
            board[i].push({ location, isClicked: false, isMine: false, isFlagged: false, isRevealed: false, content: EMPTY })
        }
    }
    return board
}

function startGame(avoidCell) {
    gGame.isRunning = true
    fillMines(gBoard, avoidCell)
    getRawBoard(gBoard)
    startTimer()
}

function checkGameOver(clickedOnMine = false) {
    const elLivesCount = document.getElementById('lives-count')
    if ((gGame.flagsCount === gLevel.mines) &&
        (gGame.clearedCount === gLevel.size ** 2 - gLevel.mines)) {
        endGame(true)
    }
    if (clickedOnMine) {
        gGame.livesCount--
        let currLives = ''
        for (let i = 0; i < gGame.livesCount; i++) {
            currLives += LIFE
        }
        elLivesCount.innerText = currLives
        if (gGame.livesCount < 1) revealMines()
    }
}

function endGame(playerWon) {
    stopTimer()
    gGame.isRunning = false
    gGame.isOver = true
    const elEmoji = document.querySelector('.emoji')
    if (playerWon) {
        elEmoji.innerText = '😎'
    } else {
        elEmoji.innerText = '🤯'
    }
}