'use strict'


var gBoard;
var gLevel = {
    size: 0,
    mines: 0,
};
var gGame = {
    isRunning: false,
    shownCount: 0,
    clearedCount: 0,
    flagsCount: 0,
    interval: 0,
    livesCount: 3,
    spoilCount: 3,
};

window.oncontextmenu = () => {return false}

function initGame(size = 4, mines = 2, elSelectedLevel) {
    // if no level selected, beginner level is auto selected
    elSelectedLevel = (typeof elSelectedLevel !== 'undefined') ?  elSelectedLevel : document.getElementById(`size-${size}`)
    clearInterval(gGame.interval)
    resetTimer()
    gLevel.size = size
    gLevel.mines = mines
    elSelectedLevel.style.backgroundColor = '#40798C'

    gBoard = createBoard(size)
    renderBoard(gBoard, '.board')
}

function levelSelect(size, mines, elButton) {
    const elButtons = document.querySelectorAll('.difficulty-buttons button')
    for (let i = 0; i < elButtons.length; i++) {
        const elLevelButton = elButtons[i];
        if (elButton === elLevelButton) {
            elButton.style.backgroundColor = '#40798C'
        }
        else elLevelButton.removeAttribute('style')
    }
    initGame(size, mines, elButton)
    // console.table(gBoard)
}

function createBoard(size) {
    const board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            const location = { i, j }
            board[i].push({ location, isClicked: false, isMine: false, isFlagged: false, content: EMPTY })
        }
    }
    return board
}

function startGame(avoidCell) {
    gGame.isRunning = true
    fillMines(gBoard, avoidCell)
    startTimer()   
}

function endGame(playerWon) {
    stopTimer()
    if (playerWon) {
        alert('You Won')
    } else {
        for (let i = 0; i < mineLocations.length; i++) {
            renderCell(mineLocations[i], MINE, true)
        }
        // alert('Game Over')
    }
}