'use strict'


var gBoard;
var gLevel = {
    size: 0,
    mines: 0,
};
var gGame = {
    isRunning: false,
    shownCount: 0,
    markedCount: 0,
    flagsCount: 0,
    interval: 0,
    startTime: 0,
    livesCount: 3,
    spoilCount: 3,
};

window.oncontextmenu = () => {return false}

function initGame(size = 4, mines = 2) {
    const elDefaultLevel = document.querySelector('.difficulty-buttons button')
    elDefaultLevel.style.backgroundColor = '#40798C'
    levelSelect(size, mines, elDefaultLevel)
}

function levelSelect(size, mines, elButton) {
    clearInterval(gGame.interval)
    const elButtons = document.querySelectorAll('.difficulty-buttons button')
    for (let i = 0; i < elButtons.length; i++) {
        const elLevelButton = elButtons[i];
        if (elButton === elLevelButton) {
            elButton.style.backgroundColor = '#40798C'
        }
        else elLevelButton.removeAttribute('style')
    }
    gLevel.size = size
    gLevel.mines = mines
    gBoard = createBoard(size)
    // console.table(gBoard)
    renderBoard(gBoard, '.board')
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

// function startGame() {
    
// }