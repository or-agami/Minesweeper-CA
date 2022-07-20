'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

function cellClicked(elCellI, elCellJ) {
    const clickedCellLocation = { row: elCellI, col: elCellJ }
    if (!gGame.isRunning) {
        gGame.isRunning = true
        fillMines(gBoard, clickedCellLocation)
        startTimer()
    } else {
        checkCell(clickedCellLocation)
    }
}

function fillMines(board, skipCellLocation) {
    let minesLeft = gLevel.mines
    console.log('skipping on:', skipCellLocation);
    for (let i = 0; i < minesLeft; i++) {
        while (condition) {
            gBoard[getRandomInt()]
        }
    }
    console.log('board:', board);
}

function getSafeCells() {
    const safeCells = []
    for (let i = 0; i < gBoard.length; i++) {
        safeCells.push([])
        for (let j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j];
            if (!cell.isMine) safeCells[i].push(cell.location)
        }
    }
    console.table(safeCells)
    return safeCells
}

function checkCell(cellLocation) {
    console.log('you clicked on:', cellLocation);
}