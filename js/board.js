'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

function cellClicked(elCellI, elCellJ) {
    const clickedCellLocation = { i: elCellI, j: elCellJ }
    console.log('clickedCellLocation:', clickedCellLocation);
    if (!gGame.isRunning) {
        gGame.isRunning = true
        fillMines(gBoard, clickedCellLocation)
        startTimer()
    } else {
        checkCell(clickedCellLocation)
    }
}

function fillMines(board, skipCellLocation) {
    console.log('skipping on:', skipCellLocation);
    for (let i = 0; i < gLevel.mines;) {
        const randomRow = getRandomInt(0, gBoard.length)
        const randomCol = getRandomInt(0, gBoard[0].length)
        const randomLocation = { i: randomRow, j: randomCol }
        console.log('randomLocation:', randomLocation);
        if (randomLocation !== skipCellLocation && cellIsEmpty(randomLocation)) {
            i++
            renderCell(randomLocation, MINE)
        }

    }
    console.log('board:', board);
}

function cellIsEmpty(location) {
    return true
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