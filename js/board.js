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
    for (let i = 0; i < gLevel.mines;) {
        const randomRow = getRandomInt(0, board.length)
        const randomCol = getRandomInt(0, board[0].length)
        const randomLocation = { i: randomRow, j: randomCol }
        console.log('randomLocation:', randomLocation);
        if ((randomRow !== skipCellLocation.i ||
            randomCol !== skipCellLocation.j) &&
            cellIsEmpty(randomLocation)) {
            i++
            // Model:
            board[randomRow][randomCol].content = MINE
            // DOM:
            renderCell(randomLocation, MINE)
        }
    }
}

function cellIsEmpty(location) {
    if (gBoard[location.i][location.j].content === EMPTY) {
        console.log('cell is empty');
        return true
    }
    console.log('cell is not empty');
    return false
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
    let gBoardContent = gBoard[cellLocation.i][cellLocation.j].content
    switch (gBoardContent) {
        case EMPTY:
            gBoardContent = countNeighbors(cellLocation, gBoard)
            renderCell(cellLocation, gBoardContent)
            break
        case MINE:
            console.log('You Dead:', MINE);
            break
        case FLAG:
            console.log('FLAG:', FLAG);
            break
    }
}

// Neighbors Count
function countNeighbors(cellLocation, board) {
    const cellI = cellLocation.i
    const cellJ = cellLocation.j
    let neighborsCount = 0;

    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].content === MINE) {
                neighborsCount++
            }
        }
    }
    console.log('neighborsCount:', neighborsCount);
    return neighborsCount;
}