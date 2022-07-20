'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

function cellClicked(elCellI, elCellJ) {
    const lClickedCellLocation = { i: elCellI, j: elCellJ }
    console.log('lClickedCellLocation:', lClickedCellLocation);
    if (!gGame.isRunning) {
        gGame.isRunning = true
        fillMines(gBoard, lClickedCellLocation)
        // checkCell(lClickedCellLocation)
        startTimer()
    }
    checkCell(lClickedCellLocation)
}

function cellRightClicked(elCellI, elCellJ) {
    const rClickedCellLocation = { i: elCellI, j: elCellJ }
    console.log('rClickedCellLocation:', rClickedCellLocation);
    if (!gGame.isRunning) {
        gGame.isRunning = true
        fillMines(gBoard, rClickedCellLocation)
        // checkCell(rClickedCellLocation)
        startTimer()
    }
    checkCell(rClickedCellLocation, true)

}

function fillMines(board, skipCellLocation) {
    for (let i = 0; i < gLevel.mines;) {
        const randomRow = getRandomInt(0, board.length)
        const randomCol = getRandomInt(0, board[0].length)
        const randomLocation = { i: randomRow, j: randomCol }
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

function checkCell(cellLocation, rightClicked = false) {
    let gBoardContent = gBoard[cellLocation.i][cellLocation.j].content
    if (rightClicked) {
        console.log('gBoard[cellLocation.i][cellLocation.j].isFlagged:', gBoard[cellLocation.i][cellLocation.j].isFlagged);
        console.log('cellLocation:', cellLocation);
        if (gBoard[cellLocation.i][cellLocation.j].isFlagged) {
            gBoard[cellLocation.i][cellLocation.j].isFlagged = false
            renderCell(cellLocation, EMPTY)
        }
        else {
            gBoard[cellLocation.i][cellLocation.j].isFlagged = true
            renderCell(cellLocation, FLAG)
        }
        return
    }
    switch (gBoardContent) {
        case EMPTY:
            gBoardContent = countNeighbors(cellLocation, gBoard, MINE)
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