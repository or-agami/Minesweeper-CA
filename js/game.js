'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    flagsCount: 0,
    interval: 0,
    startTime: 0,
    livesCount: 3,
    spoilCount: 3,
};

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
    printMat(createBoard(size), '.board')
}

function createBoard(size, mines) {
    gBoard = []
    for (let i = 0; i < size; i++) {
        gBoard.push([])
        for (let j = 0; j < size; j++) {
            gBoard[i].push(`${i + 1 * j + 1}`)
        }
    }
    return gBoard
}

// function startGame() {
    
// }